const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User'); // Make sure the path is correct
const jwt = require('jsonwebtoken'); // Added jwt import
const config = require('config'); // Added config import
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
// @route GET api/auth
// @desc Test route
// @access Private (since it requires authentication)
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Corrected typo
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error'); // Corrected response and status code
  }
});
// @route POST api/suth
// @desc authenicateuser and get tokken
// @access Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required ').exists(),
  ],
  async (req, res) => {
    try {
      // Validate input and check for errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'invalid credentials' }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'invalid credentials' }] });
      }
      // Implement JWT token creation and return it here for user authentication
      const payload = {
        user: {
          id: user.id, // Make sure your user model has an 'id' field
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'), // Use your configuration variable
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);
module.exports = router;
