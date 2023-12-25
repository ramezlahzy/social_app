const db = require("../models");
const jwt = require("jsonwebtoken");
const { Expo } = require("expo-server-sdk");

const { Op } = require("sequelize");
const { send } = require("./notification");
// const
let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

 const sendNotification = async ({ pushToken, title, body, data }) => {
  if (!Expo.isExpoPushToken(pushToken)) {
    console.log("Invalid Expo Push Token",pushToken);
    return { error: "Invalid Expo Push Token" };
  }
  console.log("sendNotificati  on",pushToken);

  const messages = [
    {
      to: pushToken,
      sound: "default",
      title: title || "Notification Title",
      body: body || "Notification Body",
      data: data,
    },
  ];

  try {
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    return { success: true, tickets };
  } catch (error) {
    return {
      error: "Error sending push notification",
      details: error,
    };
  }
};
const getUserByPhoneNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.query;
    console.log("getUserByPhoneNumber",phoneNumber);
    const user = await db.User.findOne({ where: { phoneNumber } });
    console.log("user IS  ",user);
    if (user == null) {
        res.status(200).json({ message: "User not found" });
    } else
      res.status(200).json({ message: "Get user info successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const add = (req) =>
  new Promise((resolve, reject) => {
    let userInfo = JSON.parse(req.body.userData);
    userInfo["fullName"] = userInfo["firstName"] + " " + userInfo["lastName"];
    userInfo["avatar"] = req.files[0].filename;
    db.User.create(userInfo)
      .then((users) => {
        resolve(users);
      })
      .catch((error) => {
        reject(error);
      });
  });

// const sendNot

const updateAvatar = async (req, res) => {
  try {
    const userID = req.user.id;
    const user = await db.User.findByPk(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.update({ avatar: req.files[0].filename });
    res.status(200).json({ message: "Photo Updated Successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const generatePin = (userObj) =>
  new Promise((resolve, reject) => {
    const { phoneNumber } = userObj;
    const pinCode =
      333333 || Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save the PIN code with the phone number in TempUser table
    db.TempUser.findOne({ where: { phoneNumber } })
      .then((existOne) => {
        if (existOne) {
          existOne
            .destroy()
            .then((success) => {
              db.TempUser.create({
                phoneNumber,
                token: pinCode,
                expiresAt: expirationTime,
              })
                .then((tempUser) => {
                  resolve(tempUser);
                })
                .catch((error) => {
                  reject(error);
                });
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          db.TempUser.create({
            phoneNumber,
            token: pinCode,
            expiresAt: expirationTime,
          })
            .then((tempUser) => {
              resolve(tempUser);
            })
            .catch((error) => {
              reject(error);
            });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

const verifyPin = async (req, res) => {
  try {
    const { phoneNumber, pinCode } = req.body;

    // Find the TempUser record by phone number
    const tempUser = await db.TempUser.findOne({ where: { phoneNumber } });

    const user = await db.User.findOne({ where: { phoneNumber } });

    if (!tempUser) {
      return res.status(404).json({ message: "Phone number not found" });
    }

    const currentTimestamp = new Date();

    if (tempUser.expiresAt && currentTimestamp <= tempUser.expiresAt) {
      // Check if the PIN code matches and it hasn't expired
      if (tempUser.token === pinCode) {
        // PIN code matches, you can proceed with registration
        // You can delete the TempUser record here if needed
        await tempUser.destroy();
        const userData = { phoneNumber };
        const secretKey = "socialapp-secretkey";
        const token = jwt.sign(userData, secretKey, { expiresIn: "365d" });
        if (user) {
          return res
            .status(200)
            .json({ message: "Login Success", token, state: 1, user }); //state 1 is sign in and state 0 is sign up
        } else
          return res.status(200).json({
            message: "PhoneNumber Verification Success",
            token,
            state: 0,
          });
      } else {
        return res.status(401).json({ message: "Invalid PIN code" });
      }
    } else {
      return res.status(401).json({ message: "PIN code has expired" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const findUserByLocation = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const userID = req.user.id;
    const user = await db.User.findByPk(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const offset = (page - 1) * pageSize;
    // Define the Haversine formula SQL expression
    const distanceLiteral = db.Sequelize.literal(
      `(6371 * acos(cos(radians(${user.latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${user.longitude})) + sin(radians(${user.latitude})) * sin(radians(latitude))))`
    );
    // Query the database to find users
    const { count, rows } = await db.User.findAndCountAll({
      attributes: {
        include: [[distanceLiteral, "distance"]],
      },
      limit: parseInt(pageSize, 10),
      offset,
      where: {
        id: {
          [Op.not]: userID, // Exclude the target user
        },
      },
      order: [["distance", "ASC"]], // Sort by distance in ascending order
    });
    res.status(200).json({
      page,
      pageSize,
      count,
      users: rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const setFavorite = async (req, res) => {
  try {
    const { whatIlearnedID } = req.body;
    const userID = req.user.id;
    const user = await db.User.findByPk(userID);
    const whatILearned = await db.WhatIlearned.findByPk(whatIlearnedID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("before parse", user.favoriteWIL);

    user.favoriteWIL = user.favoriteWIL ? user.favoriteWIL : [];

    console.log("after parse ", user.favoriteWIL);
    if (user.favoriteWIL.includes(whatIlearnedID)) {
      await user.update({
        favoriteWIL: user.favoriteWIL.filter((id) => id != whatIlearnedID),
      });
      const author = await db.User.findByPk(whatILearned.author);

      sendNotification({
        pushToken: author.expoPushToken,
        title: "WhatILearned Unfavorite",
        body: `${req.user.fullName} has unset your WhatILearned as favorites.`,
        data: whatIlearnedID,
      });

      await db.Notification.create({
        userID: whatILearned.author,
        content: `${req.user.fullName} has unset your WhatILearned as favorites.`,
        type: "WhatILearned unfavorite",
        data: whatIlearnedID,
        viewed: false,
      });
      res.status(200).json({ message: "Set as unfavorite successfully", user });
    } else {
      await user.update({
        favoriteWIL: [...user.favoriteWIL, whatIlearnedID],
      });

      const author = await db.User.findByPk(whatILearned.author);
      sendNotification({
        pushToken: author.expoPushToken,
        title: "WhatILearned Favorite",
        body: `${req.user.fullName} has set your WhatILearned as favorites.`,
        data: whatIlearnedID,
      });

      await db.Notification.create({
        userID: whatILearned.author,
        content: `${req.user.fullName} has set your WhatILearned as favorites.`,
        type: "WhatILearned favorite",
        data: whatIlearnedID,
        viewed: false,
      });
      res.status(200).json({ message: "Set as favorite successfully", user });
    }
    // res.status(200).json({ message: 'Set as favorite successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const followUser = async (req, res) => {
  try {
    let { followUserID } = req.body;
    const userID = req.user.id;
    const user = await db.User.findByPk(userID);
    followUserID = parseInt(followUserID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let friends = await db.Friends.findAll({
      where: {
        userID1: userID,
      },
    });

    friends = friends.map((item) => item.userID2);

    if (friends.includes(followUserID)) {
      await db.Friends.destroy({
        where: {
          userID1: userID,
          userID2: followUserID,
        },
      });
      const followUser = await db.User.findByPk(followUserID);
      sendNotification({
        pushToken: followUser.expoPushToken,
        title: "User Unfollow",
        body: `${req.user.fullName} has unfollowed you.`,
        data: userID,
      });

      await db.Notification.create({
        userID: followUserID,
        content: `${req.user.fullName} has unfollowed you.`,
        type: "User unfollow",
        data: userID,
        viewed: false,
      });
      res.status(200).json({ message: "Unfollow successfully", user });
    } //follow
    else {
      await db.Friends.create({
        userID1: userID,
        userID2: followUserID,
      });

      const followUser = await db.User.findByPk(followUserID);
      sendNotification({
        pushToken: followUser.expoPushToken,
        title: "User Follow",
        body: `${req.user.fullName} has followed you.`,
        data: userID,
      });
      await db.Notification.create({
        userID: followUserID,
        content: `${req.user.fullName} has followed you.`,
        type: "User follow",
        data: userID,
        viewed: false,
      });
      res.status(200).json({ message: "Follow successfully", user });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyFollowingAndFollowerCnt = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await db.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // user.friend = user.friend ? JSON.parse(user.friend) : [];
    // // Count the number of friends for the user
    // const follwingCnt = user.friend.length;

    // //Count the number of users who have the user as a friend
    // const followerCnt = await db.User.count({
    //   where: db.Sequelize.literal(
    //     `JSON_SEARCH(friend, 'one', ${userId}) IS NOT NULL`
    //   ),
    // });
    const follwingCnt = await db.Friends.count({
      where: {
        userID1: userId,
      },
    });
    const followerCnt = await db.Friends.count({
      where: {
        userID2: userId,
      },
    });

    res.status(200).json({ follwingCnt, followerCnt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getFollowingAndFollowerCntOfOther = async (req, res) => {
  try {
    const userId = req.query.userID;

    const user = await db.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // user.friend = user.friend ? JSON.parse(user.friend) : [];
    // // Count the number of friends for the user
    // const follwingCnt = user.friend.length;

    // //Count the number of users who have the user as a friend
    // const followerCnt = await db.User.count({
    //   where: db.Sequelize.literal(
    //     `JSON_SEARCH(friend, 'one', ${userId}) IS NOT NULL`
    //   ),
    // });
    const follwingCnt = await db.Friends.count({
      where: {
        userID1: userId,
      },
    });
    const followerCnt = await db.Friends.count({
      where: {
        userID2: userId,
      },
    });

    res.status(200).json({ follwingCnt, followerCnt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyFriend = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, keyword } = req.query;

    const offset = (page - 1) * pageSize;
    const userID = req.user.id;
    console.log(userID);
    const user = await db.User.findByPk(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user);
    // Convert the user IDs to an array of integers
    const friends = await db.Friends.findAll({
      where: {
        userID1: userID,
      },
    });
    const userIdArray = friends.map((item) => item.userID2);
    // const userIdArray = (user.friend ? user.friend : []).map((id) =>
    //   parseInt(id.trim())
    // );

    // Define the Sequelize literal for searching by full name
    const fullNameSearchCondition = db.Sequelize.literal(
      `fullName LIKE '%${keyword ?? ""}%'`
    );

    // Define the Haversine formula SQL expression
    const distanceLiteral = db.Sequelize.literal(
      `(6371 * acos(cos(radians(${user.latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${user.longitude})) + sin(radians(${user.latitude})) * sin(radians(latitude))))`
    );

    // Query the User table to find the users based on the user IDs
    const { count, rows } = await db.User.findAndCountAll({
      attributes: {
        include: [[distanceLiteral, "distance"]],
      },
      where: {
        id: userIdArray, // Find users with matching IDs
        fullNameSearchCondition,
      },
      limit: parseInt(pageSize, 10),
      offset,
      order: [["distance", "ASC"]], // Sort by distance in ascending order
    });
    res.status(200).json({
      users: rows,
      count,
      page,
      pageSize,
      message: "Search Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyWhatIlearned = async (req, res) => {
  try {
    const { page = 1, pageSize = 5 } = req.query;
    const offset = (page - 1) * pageSize;
    const userID = req.user.id;

    let whereConditions = {};
    whereConditions.author = userID;
    const { count, rows } = await db.WhatIlearned.findAndCountAll({
      where: whereConditions,
      // limit: parseInt(pageSize, 10),
      // offset,
      order: [["createdAt", "DESC"]], // Order by creation date, you can adjust as needed
    });
    res.status(200).json({
      count,
      page,
      pageSize,
      entries: rows,
      message: "Search Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyFavoriteWhatIlearned = async (req, res) => {
  try {
    const { page = 1, pageSize = 5, keyword } = req.query;
    const offset = (page - 1) * pageSize;

    const userID = req.user.id;
    const user = await db.User.findByPk(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert the whatIlearned IDs to an array of integers
    const whatIlearnedIDArray = (
      user.favoriteWIL ? user.favoriteWIL : []
    ).map((id) => parseInt(id.trim()));

    let whereConditions = {};

    if (keyword) {
      whereConditions = {
        [Op.or]: [
          {
            content: { [Op.like]: `%${keyword}%` }, // Search keyword in content
          },
          {
            authorName: { [Op.like]: `%${keyword}%` }, // Search keyword in author's fullName
          },
        ],
      };
    }
    const searchCondition = db.Sequelize.literal(
      `(authorName LIKE '%${keyword ?? ""}%' or content LIKE '%${
        keyword ?? ""
      }%')`
    );

    const { count, rows } = await db.WhatIlearned.findAndCountAll({
      where: {
        id: whatIlearnedIDArray, // Find whatIlearned with matching IDs,
        searchCondition,
      },
      include: [
        {
          model: db.User,
          attributes: ["avatar", "fullName"], // Include only the 'avatar' attribute from the User model
        },
      ],
      limit: parseInt(pageSize, 10),
      offset,
      order: [["createdAt", "DESC"]], // Order by creation date, you can adjust as needed
    });

    res.status(200).json({
      count,
      page,
      pageSize,
      entries: rows,
      message: "Search Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getFriendOfOther = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, keyword, userID } = req.query;

    const offset = (page - 1) * pageSize;
    const user = await db.User.findByPk(userID);
    const currentUser = await db.User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Convert the user IDs to an array of integers
    // const userIdArray = (user.friend ? user.friend : []).map((id) =>
    //   parseInt(id.trim())
    // );
    const friends = await db.Friends.findAll({
      where: {
        userID1: userID,
      },
    });
    const userIdArray = friends.map((item) => item.userID2);

    // Define the Sequelize literal for searching by full name
    const fullNameSearchCondition = db.Sequelize.literal(
      `fullName LIKE '%${keyword ?? ""}%'`
    );

    // Define the Haversine formula SQL expression
    const distanceLiteral = db.Sequelize.literal(
      `(6371 * acos(cos(radians(${currentUser.latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${currentUser.longitude})) + sin(radians(${currentUser.latitude})) * sin(radians(latitude))))`
    );

    // Query the User table to find the users based on the user IDs
    const { count, rows } = await db.User.findAndCountAll({
      attributes: {
        include: [[distanceLiteral, "distance"]],
      },
      where: {
        id: userIdArray, // Find users with matching IDs
        fullNameSearchCondition,
      },
      limit: parseInt(pageSize, 10),
      offset,
      order: [["distance", "ASC"]], // Sort by distance in ascending order
    });
    sendNotification({
      pushToken: user.expoPushToken,
      title: "User Viewed",
      body: `${req.user.fullName} has viewed you.`,
      data: req.user.id,
    });
    await db.Notification.create({
      userID: userID,
      content: `${req.user.fullName} has viewed you.`,
      type: "Profile Viewed",
      data: req.user.id,
      viewed: false,
    });
    res.status(200).json({ users: rows, count, page, pageSize });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getWhatIlearnedOfOther = async (req, res) => {
  try {
    const { page = 1, pageSize = 5, userID } = req.query;
    const offset = (page - 1) * pageSize;

    let whereConditions = {};
    whereConditions.author = userID;
    const { count, rows } = await db.WhatIlearned.findAndCountAll({
      where: whereConditions,
      limit: parseInt(pageSize, 10),
      offset,
      order: [["createdAt", "DESC"]], // Order by creation date, you can adjust as needed
    });
    res.status(200).json({ count, page, pageSize, entries: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getNotification = async (req, res) => {
  try {
    const userID = req.user.id;
    const count = await db.Notification.count({
      where: { viewed: false, userID: userID },
    });
    console.log(count);
    const { count1, rows } = await db.Notification.findAndCountAll({
      where: { userID: userID },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ count, notification: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const setNotificationViewed = async (req, res) => {
  try {
    const userID = req.user.id;
    await db.Notification.update(
      { viewed: true },
      { where: { viewed: false, userID: userID } }
    );
    const { count, rows } = await db.Notification.findAndCountAll({
      where: { userID: userID },
      order: [["createdAt", "DESC"]],
    });
    res
      .status(200)
      .json({ message: "Notifications are viewed", notification: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAgreeUserList = async (req, res) => {
  try {
    let agreeIDList = JSON.parse(req.query.agreeIDList);
    const { count, rows } = await db.User.findAndCountAll({
      where: {
        id: agreeIDList,
      },
    });
    res.status(200).json({
      userList: rows.map((item) => {
        return { id: item.id, name: item.fullName, avatar: item.avatar };
      }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getDisAgreeUserList = async (req, res) => {
  try {
    let disagreeIDList = JSON.parse(req.query.disagreeIDList);
    const { count, rows } = await db.User.findAndCountAll({
      where: {
        id: disagreeIDList,
      },
    });
    res.status(200).json({
      userList: rows.map((item) => {
        return { id: item.id, name: item.fullName, avatar: item.avatar };
      }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userID = req.user.id;
    const user = await db.User.findByPk(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.update({ latitude, longitude });
    res.status(200).json({ message: "Location updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getUserInfo = async (req, res) => {
  try {
    const userID = req.query.id;
    const user = await db.User.findByPk(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Get user info successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const checkUserFollow =async (req,res)=>{
  try {
    console.log("checkUserFollow",req.query);
    const {userID} = req.query;
    const currentUserID = req.user.id;
    console.log("userID",parseInt(userID));
    console.log("currentUserID",currentUserID);
    const friends = await db.Friends.findAll({
      where: {
        userID1: currentUserID,
        userID2: parseInt(userID),
      },
    });

    console.log("friends following ",friends);
    if(friends.length>0){
      res.status(200).json({isFollowed:true});
    }
    else{
      res.status(200).json({isFollowed:false});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
module.exports = {
  add,
  generatePin,
  verifyPin,
  setFavorite,
  findUserByLocation,
  followUser,
  getMyFriend,
  getMyWhatIlearned,
  getMyFavoriteWhatIlearned,
  getFriendOfOther,
  getWhatIlearnedOfOther,
  getFollowingAndFollowerCntOfOther,
  getMyFollowingAndFollowerCnt,
  updateAvatar,
  getNotification,
  setNotificationViewed,
  getAgreeUserList,
  getDisAgreeUserList,
  updateUserLocation,
  getUserInfo,
  sendNotification,
  getUserByPhoneNumber,
  checkUserFollow,
  sendNotification
};
