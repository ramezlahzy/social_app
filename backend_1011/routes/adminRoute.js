const express = require("express");
const router = express.Router();
const adminCtrl = require("../controller/admin");

router.get("/recentUsers", adminCtrl.getRecentUsers);
router.get("/allUsers", adminCtrl.getAllUsers);
router.post("/blockUser",adminCtrl.blockUser);
router.get("/getWhatIlearned",adminCtrl.getMyWhatIlearned)
router.get("/getReportedMyWhatIlearned",adminCtrl.getReportedMyWhatIlearned)
router.post("/sendNotification",adminCtrl.sendNotificationController)
module.exports = router;
