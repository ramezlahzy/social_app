const db = require("../models");
const { Op } = require("sequelize");
//admin can get all users
const {sendNotification} = require("./user");
const getRecentUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: ["id", "createdAt"],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date() - 5 * 30 * 24 * 60 * 60 * 1000),
        },
      },
    });
    // console.log(users);
    // "5 Months ago",
    // "4 Months ago",
    // "3 Months ago",
    // "2 Months ago",
    // "1 Months ago",
    // "Now",
    const map = {
      "5 Months ago": 0,
      "4 Months ago": 0,
      "3 Months ago": 0,
      "2 Months ago": 0,
      "1 Months ago": 0,
      Now: 0,
    };
    users.forEach((user) => {
      const date = user.createdAt;
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 30) {
        map["Now"]++;
      } else if (diffDays <= 60) {
        map["1 Months ago"]++;
      } else if (diffDays <= 90) {
        map["2 Months ago"]++;
      } else if (diffDays <= 120) {
        map["3 Months ago"]++;
      } else if (diffDays <= 150) {
        map["4 Months ago"]++;
      } else if (diffDays <= 180) {
        map["5 Months ago"]++;
      }
    });
    console.log(map);
    const mapToArray = Object.values(map);
    console.log(mapToArray);
    res.status(200).send(mapToArray);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: [
        "id",
        "avatar",
        "firstName",
        "lastName",
        "createdAt",
        "expoPushToken",
        "blocked",
        "phoneNumber",
      ],
    });
    res.status(200).send(users);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};
const blockUser = async (req, res) => {
  const user = await db.User.findOne({
    where: {
      id: req.body.userId,
    },
  });
  console.log(user.blocked);

  if (user.blocked)
    await user.update({
      blocked: false,
    });
  else
    await user.update({
      blocked: true,
    });
  res.status(200).send({
    message: "updated",
  });
};
const getMyWhatIlearned = async (req, res) => {
  try {
    const { count, rows } = await db.WhatIlearned.findAndCountAll({
      order: [["createdAt", "DESC"]], // Order by creation date, you can adjust as needed
    });
    res.status(200).json({
      count,
      entries: rows,
      message: "Search Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getReportedMyWhatIlearned = async (req, res) => {
  console.log("getReportedMyWhatIlearned")
  try {
    const Reports = await db.Reports.findAll({
      // attributes: ["whatILearnedID"],
    });
    //return earch whatILearnedId and number of reports

    const map = {};
    Reports.forEach((report) => {
      if (map[report.whatIlearnedID]) {
        map[report.whatIlearnedID]++;
      } else {
        map[report.whatIlearnedID] = 1;
      }
    });
    console.log("object keys ", Object.keys(map));
    const WhatILearned = await db.WhatIlearned.findAll({
      where: {
        id: {
          [Op.in]: Object.keys(map),
        },
      },
    });

    //add number of reports to each whatILearned
    WhatILearned.forEach((whatILearned) => {
      whatILearned.dataValues.reports = map[whatILearned.id];
    });
    console.log("my what I learned with reports");
    console.log(WhatILearned);
    res.status(200).send(WhatILearned);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

const sendNotificationController = async (req, res) => {
  try {
    const { expoPushTokens, title, body } = req.body;
    console.log(expoPushTokens, title, body);
    expoPushTokens.forEach(async (token) => {
      await sendNotification({pushToken:token, title, body});

    });
    res.status(200).send({ message: "Notification Sent Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  getRecentUsers,
  getAllUsers,
  blockUser,
  getMyWhatIlearned,
  getReportedMyWhatIlearned,
  sendNotificationController,
};
