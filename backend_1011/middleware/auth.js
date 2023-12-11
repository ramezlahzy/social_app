const config = require('../config');
const db = require('../models');
const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token)
      return res.status(401).json({ message: 'Unauthorized' });

    const secretKey = config.secretKey; // Use the same secret key used for signing

    jwt.verify(token, secretKey, (err, user) => {
      if (err)
        return res.status(403).json({ message: 'Forbidden' });

      db.User.findOne({ where: { phoneNumber : user.phoneNumber } })
      .then((existOne) => {
        req.user = existOne; // Attach user data to the request object
        next(); // Continue to the protected route
      })
      .catch((error) => {
        return res.status(404).json({ message: 'User not found' });
      })

    });
}
