const express = require("express");
const router = express.Router();
const notificationCtrl = require("../controller/notification");

router.post('/send', notificationCtrl.send);

module.exports = router;