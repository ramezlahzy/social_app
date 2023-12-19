const db = require("../models");
const { Expo } = require('expo-server-sdk');
const { Op } = require("sequelize");
let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

const send = async (req, res) => {
  const { pushToken, title, body } = req.body;

  if (!Expo.isExpoPushToken(pushToken)) {
    return res.status(400).send({ error: "Invalid Expo Push Token" });
  }

  const messages = [
    {
      to: pushToken,
      sound: "default",
      title: title || "Notification Title",
      body: body || "Notification Body",
      data: { anyData: "you want to send with the notification" },
    },
  ];

  try {
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    return res.json({ success: true, tickets });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error sending push notification", details: error });
  }
};
module.exports = {
  send,
};
