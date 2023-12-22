const db = require("../models");
const { Op } = require("sequelize");
const {sendNotification} = require("./user");
const { send } = require("./notification");
const addWhatIlearned = async (req, res) => {
  try {
    const { content, shareWithFriend, shareWithWorldWide } = req.body;

    // Create a new WhatILearned entry and associate it with the user
    const whatILearned = await db.WhatIlearned.create({
      content,
      shareWithFriend,
      shareWithWorldWide,
      author: req.user.id,
      authorName: req.user.fullName,
    });
    // Notify friends if shareWithFriend is true
    if (shareWithFriend) {
      // const friends = (req.user.friend ? req.user.friend : []).map((id) =>
      //   parseInt(id.trim())
      // ); // Assuming you have a friends field in your User model
      const friends = await db.Friends.findAll({
        where: {
          userID1: req.user.id,
        },
      });
      
      for (const friendId of friends) {
        // Create a notification for each friend
        // { pushToken, title, body, data }
        const friend = await db.User.findByPk(friendId);
        sendNotification({
          pushToken: friend.expoPushToken,
          title: "New WhatILearned",
          body: `${req.user.fullName} has shared a new WhatILearned with you.`,
          data: { whatILearnedID: whatILearned.id },
        })
        await db.Notification.create({
          userID: friendId,
          content: `${req.user.fullName} has shared a new WhatILearned with you.`,
          type: "WhatILearned created",
          data: whatILearned.id,
          viewed: false,
        });
        // You can send the actual notifications here (e.g., push notifications, emails, etc.)
      }
    }
    const user = await db.User.findByPk(req.user.id);
    res
      .status(201)
      .json({ message: "WhatIlearned entry created successfully", user });
  } catch (error) {
    console.error("500 ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOneWhatIlearned = async (req, res) => {
  try {
    const { whatIlearnedID } = req.query;
    const whatILearned = await db.WhatIlearned.findByPk(whatIlearnedID);
    if (!whatILearned) {
      return res.status(404).json({ message: "WhatIlearned entry not found" });
    }
    return res.status(200).json({ data: whatILearned });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getWhatIlearned = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 5,
      keyword,
      shareWithFriend,
      shareWithWorldWide,
    } = req.query;
    const offset = (page - 1) * pageSize;
    const userID = req.user.id;
    const user = await db.User.findByPk(userID);
    // const friends = (user.friend ? JSON.parse(user.friend) : []).map((id) =>
    //   parseInt(id.trim())
    // ); // Assuming you have a friends field in your User model
    let friends = await db.Friends.findAll({
      where: {
        userID1: userID,
      },
    });
    console.log(friends);
    friends = friends.map((item) => {
      return item.userID2;
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
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
    if ( shareWithFriend === "true" ) {
      whereConditions.author = friends;
    }

    // Add the userID to the "shareWithWorldWide" condition

    if (shareWithWorldWide === "true") {
      whereConditions.author = {
        [Op.and]: [{ [Op.notIn]: friends }, { [Op.not]: userID }],
      };
    }
    // if (!shareWithFriend && !shareWithWorldWide)
    //   whereConditions.author = {}//..{ [Op.not]: userID };

      whereConditions.reportUser = {
      [Op.or]: [
        {
          reportUser: {
            [Op.and]: [
              db.Sequelize.literal("JSON_LENGTH(reportUser) < 5"), // Check if the JSON array has less than 5 elements
            ],
          },
        },
        { [Op.eq]: null }, // Include entries with a null reportUser
      ],
    };
    const { count, rows } = await db.WhatIlearned.findAndCountAll({
      where: whereConditions,
      // limit: parseInt(pageSize, 10),
      // offset,
      order: [["createdAt", "DESC"]], // Order by creation date, you can adjust as needed
      include: [
        {
          model: db.User,
          attributes: ["avatar","country","city"], // Include only the 'avatar' attribute from the User model
        },
      ],
    });
    // console.log(" rows is ",rows);
    rows.forEach((item) => {
      console.log("item is ", item.User);
    })
    //make if has the same city as user first and then the same country
    const rowsWithSameCity = rows.filter((item) => {
      return item.User.city === user.city;
    }
    );
    const rowsWithSameCountry = rows.filter((item) => {
      return item.User.country === user.country && item.User.city !== user.city;
    }
    );
    const other=rows.filter((item) => {
      return item.User.country !== user.country&&item.User.city !== user.city;
    }
    );
    const rowsWithSameCityAndCountryAndOther = rowsWithSameCity.concat(rowsWithSameCountry,other)
    //if dublicates return error
    if(rowsWithSameCityAndCountryAndOther.length!==rows.length){
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json({ count, page, pageSize, entries: rowsWithSameCityAndCountryAndOther });
    console.log("rowsWithSameCityAndCountryAndOther is ",rowsWithSameCityAndCountryAndOther);


    // res.status(200).json({ count, page, pageSize, entries: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const agreeWhatIlearned = async (req, res) => {
  // res.status(200).json({ message: "Agreement recorded successfully" });
  try {
    const { whatIlearnedID } = req.body;
    const userID = req.user.id;
    // Find the user and WhatIlearned entry
    let whatILearned = await db.WhatIlearned.findByPk(whatIlearnedID);
    if (!whatILearned) {
      return res.status(404).json({ message: "WhatIlearned entry not found" });
    }
    // Check if the user has already agreed
    whatILearned.agree = whatILearned.agree
      ? JSON.parse(whatILearned.agree)
      : [];
    whatILearned.disagree = whatILearned.disagree
      ? JSON.parse(whatILearned.disagree)
      : [];

    //get all tables in db

    // const aag=db.DisAgrees.findByPk(whatIlearnedID)
    const agree = await db.Agrees.findOne({
      where: {
        userID: userID,
        whatIlearnedID: whatIlearnedID,
      },
    });
    if (agree) {
      db.Agrees.destroy({
        where: {
          userID: userID,
          whatIlearnedID: whatIlearnedID,
        },
      });
      res.status(200).json({ message: "Agreement removed successfully" });
    } else {

      const author = await db.User.findByPk(whatILearned.author);
      // sendNotification
      sendNotification({
        pushToken: author.expoPushToken,
        title: "Agreement",
        body: `${req.user.fullName} has agreed with your WhatILearned.`,
        data: { whatILearnedID: whatILearned.id },
      });

      await db.Notification.create({
        userID: whatILearned.author,
        content: `${req.user.fullName} has agreed with your WhatILearned.`,
        type: "WhatILearned agreed",
        data: whatILearned.id,
        viewed: false,
      });
      db.Agrees.create({
        userID: userID,
        whatIlearnedID: whatIlearnedID,
      });
      res.status(200).json({ message: "Agreement recorded successfully" });
    }
    // console.log(agree)
    // if (whatILearned.agree && whatILearned.agree.includes(userID)) {
    //   return res.status(404).json({ message: "Agreement recorded already" });
    // } else
    {
      // Add user to the 'agree' array
      // const agree=db.Agree.create({
      //   userID:userID,
      //   whatIlearnedID:whatIlearnedID
      // })
      // console.log(agree)
      // await whatILearned.update({
      //   agree: [...whatILearned.agree, userID],
      // });
    }
    // if (whatILearned.disagree && whatILearned.disagree.includes(userID)) {
    //   // Remove user from the 'disagree' array
    //   await whatILearned.update({
    //     disagree: whatILearned.disagree.filter((id) => id !== userID),
    //   });
    // }

    // res.status(200).json({ message: "Agreement recorded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const disagreeWhatIlearned = async (req, res) => {
  try {
    const { whatIlearnedID } = req.body;
    const userID = req.user.id;
    // Find the user and WhatIlearned entry
    let whatILearned = await db.WhatIlearned.findByPk(whatIlearnedID);
    if (!whatILearned) {
      return res.status(404).json({ message: "WhatIlearned entry not found" });
    }

    // Check if the user has already agreed
    // whatILearned.agree = whatILearned.agree
    //   ? JSON.parse(whatILearned.agree)
    //   : [];
    // whatILearned.disagree = whatILearned.disagree
    //   ? JSON.parse(whatILearned.disagree)
    //   : [];

    const disagree = await db.DisAgrees.findOne({
      where: {
        userID: userID,
        whatIlearnedID: whatIlearnedID,
      },
    });
    console.log("dis agree is", disagree);
    if (disagree) {
      db.DisAgrees.destroy({
        where: {
          userID: userID,
          whatIlearnedID: whatIlearnedID,
        },
      });
      res.status(200).json({ message: "Disagreement removed successfully" });
    } else {

      const author = await db.User.findByPk(whatILearned.author);
      // sendNotification
      sendNotification({
        pushToken: author.expoPushToken,
        title: "Disagreement",
        body: `${req.user.fullName} has disagreed with your WhatILearned.`,
        data: { whatILearnedID: whatILearned.id },
      });

      await db.Notification.create({
        userID: whatILearned.author,
        content: `${req.user.fullName} has disagreed with your WhatILearned.`,
        type: "WhatILearned disagreed",
        data: whatILearned.id,
        viewed: false,
      });
      db.DisAgrees.create({
        userID: userID,
        whatIlearnedID: whatIlearnedID,
      });
      res.status(200).json({ message: "Disagreement recorded successfully" });
    }

    // if (whatILearned.disagree && whatILearned.disagree.includes(userID)) {
    //   return res.status(404).json({ message: "Disagreement recorded already" });
    // } else {
    //   // Add user to the 'agree' array
    //   await whatILearned.update({
    //     disagree: [...whatILearned.disagree, userID],
    //   });
    //   await db.Notification.create({
    //     userID: whatILearned.author,
    //     content: `${req.user.fullName} has disagreed with your WhatILearned.`,
    //     type: "WhatILearned disagreed",
    //     data: whatILearned.id,
    //     viewed: false,
    //   });
    // }
    // if (whatILearned.agree && whatILearned.agree.includes(userID)) {
    //   // Remove user from the 'agree' array
    //   await whatILearned.update({
    //     agree: whatILearned.agree.filter((id) => id !== userID),
    //   });
    // }
    // res.status(200).json({ message: "Disagreement recorded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const reportWhatIlearned = async (req, res) => {
  try {
    const { whatIlearnedID } = req.body;
    const userID = req.user.id;

    // Find the user and WhatIlearned entry
    let whatILearned = await db.WhatIlearned.findByPk(whatIlearnedID);
    if (!whatILearned) {
      return res.status(404).json({ message: "WhatIlearned entry not found" });
    }

    whatILearned.reportUser = whatILearned.reportUser
      ? whatILearned.reportUser
      : [];

    // Check if the user has already reported
    if (whatILearned.reportUser.includes(userID)) {
      return res.status(404).json({ message: "Reported already" });
    } else {
      // Update the reportUser array
      await whatILearned.update({
        reportUser: [...whatILearned.reportUser, userID],
      });

      // Check if the WhatIlearned entry has been reported 5 times
      if (whatILearned.reportUser.length >= 5) {
        // Delete the WhatIlearned entry
        await whatILearned.destroy();

        const author = await db.User.findByPk(whatILearned.author);
        // sendNotification
        sendNotification({
          pushToken: author.expoPushToken,
          title: "WhatILearned deleted",
          body: `Your WhatIlearned has been deleted due to multiple reports.`,
          data: { whatILearnedID: whatILearned.id },
        });

        // Send a notification to the author
        await db.Notification.create({
          userID: whatILearned.author,
          content:
            "Your WhatIlearned has been deleted due to multiple reports.",
          type: "WhatILearned deleted",
          data: whatILearned.id,
          viewed: false,
        });

        return res.status(200).json({
          message:
            "Reported successfully. WhatIlearned deleted and notification sent.",
        });
      } else {
        // Send a notification to the author
        const author = await db.User.findByPk(whatILearned.author);
        // sendNotification
        sendNotification({
          pushToken: author.expoPushToken,
          title: "WhatILearned reported",
          body: `Somebody has reported your WhatIlearned.`,
          data: { whatILearnedID: whatILearned.id },
        });

        await db.Notification.create({
          userID: whatILearned.author,
          content: "Somebody has reported your WhatIlearned.",
          type: "WhatILearned reported",
          data: whatILearned.id,
          viewed: false,
        });

        return res.status(200).json({ message: "Reported successfully" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addComment = async (req, res) => {
  try {
    const { text, whatIlearnedID } = req.body;
    const userID = req.user.id;
    const whatILearned = await db.WhatIlearned.findByPk(whatIlearnedID);
    if (!whatILearned) {
      return res.status(404).json({ message: "WhatIlearned entry not found" });
    }
    // Create comment with request param
    const comment = await db.Comment.create({
      text,
      userID,
      whatIlearnedID,
    });

    // whatILearned.comment = whatILearned.comment ? whatILearned.comment : [];

    // await whatILearned.update({
    //   comment: [...whatILearned.comment, comment.id],
    // });

    const author = await db.User.findByPk(whatILearned.author);
    // sendNotification
    sendNotification({
      pushToken: author.expoPushToken,
      title: "New Comment",
      body: `${req.user.fullName} has added comment to your WhatILearned.`,
      data: { whatILearnedID: whatILearned.id },
    });
    
    await db.Notification.create({
      userID: whatILearned.author,
      content: `${req.user.fullName} has added comment to your WhatILearned.`,
      type: "WhatILearned commented",
      data: whatILearned.id,
      viewed: false,
    });
    res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getComment = async (req, res) => {
  try {
    const { page = 1, pageSize = 5, whatIlearnedID } = req.query;
    const offset = (page - 1) * pageSize;
    const whatILearned = await db.WhatIlearned.findByPk(whatIlearnedID);
    if (!whatILearned) {
      return res.status(404).json({ message: "WhatIlearned entry not found" });
    }

    // Fetch all comments associated with the specified "WhatIlearned" entry
    const { count, rows } = await db.Comment.findAndCountAll({
      where: { whatIlearnedID },
      limit: parseInt(pageSize, 10),
      include: [
        {
          model: db.User,
          attributes: ["avatar", "fullName"], // Include only the 'avatar' attribute from the User model
        },
      ],
      offset,
      order: [["createdAt", "DESC"]], // Order by creation date, you can adjust as needed
    });

    res.status(200).json({ comments: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateWhatIlearned = async (req, res) => {
  try {
    const { whatIlearnedID, updateContent } = req.body;
    const whatILearned = await db.WhatIlearned.findByPk(whatIlearnedID);

    //if you did not find a post called what i learned according to given whatIlearnedID
    if (!whatILearned) {
      return res.status(404).json({ message: "WhatIlearned entry not found" });
    }
    console.log(updateContent);
    await whatILearned.update({ content: updateContent });
    res
      .status(200)
      .json({ message: "WhatIlearned Content Updated Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteWhatIlearned = async (req, res) => {
  try {
    const whatIlearnedID = req.params.id;
    console.log(whatIlearnedID);
    const whatILearned = await db.WhatIlearned.findByPk(whatIlearnedID);
    if (!whatILearned) {
      return res.status(404).json({ message: "WhatIlearned entry not found" });
    }
    await whatILearned.destroy();
    res.status(200).json({ message: "WhatIlearned Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAgreeUserList = async (req, res) => {
  try {
    const { whatIlearnedID } = req.query;
    const whatILearned = await db.WhatIlearned.findByPk(whatIlearnedID);
    if (!whatILearned) {
      return res.status(404).json({ message: "WhatIlearned entry not found" });
    }
    const agreeUserList = await db.Agrees.findAll({
      where: {
        whatIlearnedID: whatIlearnedID,
      },
    });
    res.status(200).json({ userList: agreeUserList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getDisAgreeUserList = async (req, res) => {
  try {
    const { whatIlearnedID } = req.query;
    const whatILearned = await db.WhatIlearned.findByPk(whatIlearnedID);
    if (!whatILearned) {
      return res.status(404).json({ message: "WhatIlearned entry not found" });
    }
    const disagreeUserList = await db.DisAgrees.findAll({
      where: {
        whatIlearnedID: whatIlearnedID,
      },
    });
    res.status(200).json({ userList: disagreeUserList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addWhatIlearned,
  getWhatIlearned,
  agreeWhatIlearned,
  disagreeWhatIlearned,
  reportWhatIlearned,
  addComment,
  getComment,
  deleteWhatIlearned,
  updateWhatIlearned,
  getOneWhatIlearned,
  getAgreeUserList,
  getDisAgreeUserList,
};
