var serviceAccount = require("./socialapp-92e75-firebase-adminsdk-jso6r-c239fb3824.json");

let admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

module.exports=admin;