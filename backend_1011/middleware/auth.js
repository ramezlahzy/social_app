const config = require("../config");
const db = require("../models");
const admin=require('../firebase')
module.exports = (req, res, next) => {
 
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      if(!decodedToken||!decodedToken.phone_number) return res.status(401).json({ message: "Unauthorized" });
      let phoneNumber = decodedToken.phone_number;
      phoneNumber = phoneNumber.replace("+", "");
      console.log(phoneNumber)
      db.User.findOne({ where: { phoneNumber } })
        .then((existOne) => {
          req.user = existOne;
          console.log("exist one is ",existOne)
          next();
        })
        .catch((error) => {
          console.log("error is ", error);
          return res.status(404).json({ message: "User not found" });
        });

    })
    .catch((error) => {
      console.log("error is ", error);
      return res.status(404).json({ message: "User not found" });
    });

};
