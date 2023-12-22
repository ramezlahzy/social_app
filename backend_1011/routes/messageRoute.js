const express = require("express");
const router = express.Router();
const messageCtrl = require("../controller/message");
router.post('/send', messageCtrl.add);
router.post('/getAllMessages', messageCtrl.getAllMessages);
router.post('/getLastMessages', messageCtrl.getLastMessages);
module.exports = router;
