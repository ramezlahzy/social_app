const db = require("../models");
const { Op } = require("sequelize");
const add = async (req, res) => {
  const userID = req.user.id;
  const { toUserID, messageBody } = req.body;
  console.log("userID", userID);
  console.log("toUserID", toUserID);
  console.log("messageBody", messageBody);

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
module.exports = {
  add,
  getAllMessages,
};
