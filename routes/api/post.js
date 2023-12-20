const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Post = require('../../models/Post'); // You need to import the Post model
const Profile = require('../../models/Profile');

// @route POST api/posts (plural "posts" instead of "post")
// @desc Create a post
// @access Private
router.post(
  '/',
  [
    auth,
    check('text', 'Text is required').not().isEmpty(), // Corrected the validation message
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);
// @route get  api/post
// @desc Create all post
// @access Private

router.get('/', auth, async (req, res) => {
  // Close the string for the route path
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts); // Removed the extra parentheses around "posts"
  } catch (err) {
    console.error(err.message);

    return res.status(500).send('Server Error');
  }
});
// @route get  api/post/:id
// @desc Create all post
// @access Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // Corrected the variable name and removed the extra single quote

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' }); // Updated the status code to 404 and the error message
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' }); // Updated the status code to 404 and the error message
    }
    return res.status(500).send('Server Error');
  }
});

// @route delete  api/post/:id
// @desc delete a post
// @access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the user is authorized to delete the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Post.deleteOne({ _id: req.params.id }); // Use deleteOne to remove the post

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    return res.status(500).send('Server Error');
  }
});

// @route put api/post/like/:id
// @desc like a post
// @access Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post is already liked by the user
    const userLiked = post.likes.some(
      (like) => like.user.toString() === req.user.id
    );
    if (userLiked) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});
// @route put api/post/like/:id
// @desc like a post
// @access Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post is already liked by the user
    const userLiked = post.likes.some(
      (like) => like.user.toString() === req.user.id
    );
    if (!userLiked) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    // Remove the like
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    if (removeIndex !== -1) {
      post.likes.splice(removeIndex, 1); // Use splice to remove the like
      await post.save();
      res.json(post.likes);
    } else {
      return res.status(400).json({ msg: 'Like not found' });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route POST api/post/comment/:id
// @desc Comment on a post
// @access Private
router.post(
  '/comment/:id', // Use req.params.id to specify the post you want to comment on
  [auth, check('text', 'Text is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id); // Use req.params.id

      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);
// @route POST api/post/comment/:id/:comment_id
// @desc delete  Comment on a post
// @access Private

// @route DELETE api/post/comment/:id/:comment_id
// @desc Delete a comment on a post
// @access Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // Find the post by ID

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Find the comment within the post's comments array
    const comment = post.comments.find(
      (comment) => comment._id.toString() === req.params.comment_id
    );
    ``;

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Check if the user trying to delete the comment is the one who created it
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Remove the comment from the post's comments array
    const removedIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === req.params.comment_id
    );
    post.comments.splice(removedIndex, 1);

    await post.save();

    res.json({ msg: 'Comment removed' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
