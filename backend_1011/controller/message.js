const db = require("../models");
const { Op } = require("sequelize");
const add = async (req, res) => {
  const userID = req.user.id;
  const { toUserID, messageBody } = req.body;

  const message = await db.Messages.create({
    fromUserID: userID,
    toUserID,
    message: messageBody,
    read: false,
  });
  return res.json({ success: true, message });
};
const getAllMessages = async (req, res) => {
  const userID = req.user.id;
  const { friendID } = req.body;
  const messages = await db.Messages.findAll({
    where: {
      [Op.or]: [
        { fromUserID: userID, toUserID: friendID },
        { fromUserID: friendID, toUserID: userID },
      ],
    },
  });
  return res.json({ success: true, messages });
};

const getLastMessages = async (req, res) => {
try{
  
  const userID = req.user.id;
  const user = await db.User.findOne({ where: { id: userID } });
  const messages = await db.Messages.findAll({
    where: {
      [Op.or]: [{ fromUserID: userID }, { toUserID: userID }],
    },
    order: [["createdAt", "DESC"]],
  });
  const allMessages = [];
  const promises = messages.map(async (message) => {
    const distanceLiteral = db.Sequelize.literal(
      `(6371 * acos(cos(radians(${user.latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${user.longitude})) + sin(radians(${user.latitude})) * sin(radians(latitude))))`
    );
    const friendID = message.fromUserID === userID ? message.toUserID : message.fromUserID;
    const friend = await db.User.findOne({
      attributes: {
        include: [[distanceLiteral, "distance"]],
      },
      where: {
        id: friendID,
      },
    });
    message.dataValues.friendName = friend.dataValues.firstName + " " + friend.dataValues.lastName;
    message.dataValues.friendAvatar = friend.dataValues.avatar;
    message.dataValues.friendDistance = friend.dataValues.distance;

    allMessages.push(message);
  });


  await Promise.all(promises);
  const lastMessages = [];
  const lastMessagesIDs = [];
  
  allMessages.forEach((message) => {
    const friendID =  message.fromUserID === userID ? message.toUserID : message.fromUserID;
    console.log("friendID", friendID);
    console.log("lastMessagesIDs", lastMessagesIDs);
    if (!lastMessagesIDs.includes(friendID)) {
      lastMessages.push(message);
      lastMessagesIDs.push(friendID);
    }else{
      if(message.createdAt > lastMessages[lastMessagesIDs.indexOf(friendID)].createdAt){
        lastMessages[lastMessagesIDs.indexOf(friendID)] = message;
      }
    }
  });
  console.log("lastMessage", lastMessages);
  return res.json({ success: true, messages: lastMessages });
  
}catch{
  return res.json({ success: false });
 
}
};
module.exports = {
  add,
  getAllMessages,
  getLastMessages,
};
