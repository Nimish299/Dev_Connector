const jwt = require('jsonwebtoken');
const config = require('config'); // Added config import

module.exports = function (req, res, next) {
  //get tooken here
  const token = req.header('x-auth-tokken');

  // check if not token
  if (!token) {
    return res.status(401).json({ msg: 'no tokken ,authorization denied' });
  }
  // verify tokken

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'tokken is not valid ' });
  }
};
