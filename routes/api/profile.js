const express = require('express');
const request = require('request');
const config = require('config'); // Added config import
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');
const { check, validationResult } = require('express-validator');

// @route GET api/profile/me
// @desc Get current user profile
// @access Private (requires authentication)
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error ');
  }
});

// @route POST api/profile
// @desc Create or update profile
// @access Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills are required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create a constant for the request body
    const reqBody = req.body;

    // Initialize the profileFields object
    const profileFields = {};
    profileFields.user = req.user.id;

    // Check if request data exists and populate profileFields accordingly
    if (reqBody.company) profileFields.company = reqBody.company;
    if (reqBody.website) profileFields.website = reqBody.website;
    if (reqBody.location) profileFields.location = reqBody.location;
    if (reqBody.bio) profileFields.bio = reqBody.bio;
    if (reqBody.status) profileFields.status = reqBody.status;
    if (reqBody.githubusername)
      profileFields.githubusername = reqBody.githubusername;
    if (reqBody.skills) {
      profileFields.skills = reqBody.skills
        .split(',')
        .map((skill) => skill.trim());
    }

    profileFields.social = {};
    if (reqBody.youtube) profileFields.social.youtube = reqBody.youtube;
    if (reqBody.twitter) profileFields.social.twitter = reqBody.twitter;
    if (reqBody.facebook) profileFields.social.facebook = reqBody.facebook;
    if (reqBody.linkedin) profileFields.social.linkedin = reqBody.linkedin;
    if (reqBody.instagram) profileFields.social.instagram = reqBody.instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Profile exists, so update it
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      // Profile doesn't exist, so create a new one
      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

// @route Get api/profile
// @desc Get all profiles
// @access Public
router.get('', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});
// @route Get api/profile/user/user_id
// @desc Get all by user id
// @access Public
router.get('/User/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId')
      return res.status(400).json({ msg: 'Profile not found' });
    return res.status(500).send('Server Error');
  }
});

// Delete  Get api/profile
// @desc delete post user profile
// @access Private
router.delete('/', auth, async (req, res) => {
  try {
    //post delete
    await Post.deleteMany({ user: req.user.id });
    // Remove user's profile (if applicable)
    await Profile.findOneAndRemove({ user: req.user.id });

    // Delete the user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// PUT api/profile/experience
// @desc Add profile experience
// @access Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      // Find the user's profile by user ID
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(400).json({ msg: 'Profile not found' });
      }

      // Add the new experience to the profile's experience array
      profile.experience.unshift(newExp);

      // Save the updated profile
      await profile.save();

      // Return the updated profile as a response
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);
// Delete api/profile/experience
// @desc delete exp from profile
// @access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

//education

// PUT api/profile/education
// @desc Add profile education
// @access Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'school is required').not().isEmpty(),
      check('degree', 'degree is required').not().isEmpty(),
      check('fieldofstudy', 'field of study is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      // Find the user's profile by user ID
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(400).json({ msg: 'Profile not found' });
      }

      // Add the new experience to the profile's experience array
      profile.education.unshift(newEdu);

      // Save the updated profile
      await profile.save();

      // Return the updated profile as a response
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);
// Delete api/profile/education
// @desc delete education from profile
// @access Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get the index of the education entry to remove
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    // Use splice to remove the education entry
    if (removeIndex !== -1) {
      profile.education.splice(removeIndex, 1);
    } else {
      return res.status(404).json({ msg: 'Education entry not found' });
    }

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route Get api/profile/github/:username
// @desc Get user repost
// @access Public
router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }, // Use "headers" instead of "header"
    };

    request(options, (error, response, body) => {
      if (error) console.error(err.message);

      if (response.statusCode != 200) {
        return res.status(404).json({ msg: 'No Github profile found ' });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId')
      return res.status(400).json({ msg: 'Profile not found' });
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
