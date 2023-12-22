const express = require("express");
const router = express.Router();
const userCtrl = require("../controller/user");
const auth = require("../middleware/auth");
const user = require("../models/user");
router.post("/addUser", (req, res) => {
  userCtrl
    .add(req)
    .then((result) => {
      res.send({
        message: "Sign Up Success",
        data: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({
        message: "Internal server error",
      });
    });
});
router.post("/updateAvatar", auth, userCtrl.updateAvatar);
router.get("/generatePin", async (req, res) => {
  userCtrl
    .generatePin(req.query)
    .then((result) => {
      res.status(200).json({ message: "PIN code sent successfully" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({
        message: "Internal server error",
      });
    });
});
router.post("/verifyPin", userCtrl.verifyPin);
router.post("/setfavorite", auth, userCtrl.setFavorite);
router.get("/findAllUsersByDistance", auth, userCtrl.findUserByLocation);
router.post("/followUser", auth, userCtrl.followUser);
router.get("/getMyFriend", auth, userCtrl.getMyFriend);
router.get("/getMyWhatIlearned", auth, userCtrl.getMyWhatIlearned);
router.get(
  "/getMyFavoriteWhatIlearned",
  auth,
  userCtrl.getMyFavoriteWhatIlearned
);
router.get("/getFriendOfOther", auth, userCtrl.getFriendOfOther);
router.get("/getWhatIlearnedOfOther", auth, userCtrl.getWhatIlearnedOfOther);
router.get(
  "/getFollowingAndFollowerCntOfOther",
  auth,
  userCtrl.getFollowingAndFollowerCntOfOther
);
router.get(
  "/getMyFollowingAndFollowerCnt",
  auth,
  userCtrl.getMyFollowingAndFollowerCnt
);
router.get("/notification", auth, userCtrl.getNotification);
router.get("/setNotificationViewed", auth, userCtrl.setNotificationViewed);
router.get("/getAgreeUserList", auth, userCtrl.getAgreeUserList);
router.get("/getDisAgreeUserList", auth, userCtrl.getDisAgreeUserList);
router.post("/updateLocation", auth, userCtrl.updateUserLocation);
router.get("/getUserInfo", auth, userCtrl.getUserInfo);
router.get("/getUserByPhoneNumber", userCtrl.getUserByPhoneNumber);
router.get("/checkUserFollow", auth, userCtrl.checkUserFollow);
module.exports = router;
