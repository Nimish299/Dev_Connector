const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Added jwt import
const config = require('config'); // Added config import

const { check, validationResult } = require('express-validator');

// Bring in the User model
const User = require('../../models/User');

// @route POST api/users
// @desc Register user
// @access Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      // Validate input and check for errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      // Check if the user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // Generate Gravatar URL
      const avatar = gravatar.url(email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm', // Default image (if no Gravatar is associated with the email)
      });

      // Hash the password and create a new user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        name,
        email,
        avatar,
        password: hashedPassword,
      });

      // Save the user to the database
      await user.save();

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
      console.error(errOR.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
