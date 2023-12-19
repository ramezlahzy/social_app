const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const app = express();

const userRoute = require('./routes/userRoute');
const whatIlearnedRoute = require('./routes/whatilearnedRoute');
const messageRoute = require('./routes/messageRoute');
const notificationRoute = require('./routes/notificationRoute');
const accessLog = require('./middleware/accessLog');
const auth = require('./middleware/auth')
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Set the file name
  },
});


app.use(multer({ storage: storage }).any());
app.use("/images", express.static(__dirname + "/uploads"));
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/user', accessLog, userRoute);
app.use('/whatIlearned', accessLog,  auth, whatIlearnedRoute);

app.use('/message', accessLog, auth, messageRoute);

app.use('/notification', accessLog, auth, notificationRoute);
app.listen(config.PORT, () => {
  console.log(`Listening at http://localhost:${config.PORT}`);
});
