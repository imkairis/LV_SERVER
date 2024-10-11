const Post = require('../models/Post');
const { deleteFile } = require('../utils/deleteFile');

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({ data: posts });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
}

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json({ data: post });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
}

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const media = req.files?.media ? req.files.media.map(file => file.filename) : [];

    const post = new Post({
      title,
      content,
      media,
    });

    await post.save();
    res.status(201).json({ data: post });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
}

exports.updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const media = req.files?.media ? req.files.media.map(file => file.filename) : [];

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.title = title || post.title;
    post.content = content || post.content;
    if (media.length) post.media = [...post.media, ...media];

    await post.save();
    res.status(200).json({ data: post });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
}

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.media.forEach(file => deleteFile(file, res));
    
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
}

exports.addReaction = async (req, res) => {
  try {
    const { type } = req.body;
    const post = await MultimediaPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const reaction = { type, user: req.user.id };
    post.reactions.push(reaction);

    await post.save();
    res.status(201).json({ data: post });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await MultimediaPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = { content, user: req.user.id };
    post.comments.push(comment);

    await post.save();
    res.status(201).json({ data: post });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteReaction = async (req, res) => {
  try {
    const post = await MultimediaPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.reactions = post.reactions.filter(
      reaction => reaction._id.toString() !== req.params.reactionId
    );

    await post.save();
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const post = await MultimediaPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments = post.comments.filter(
      comment => comment._id.toString() !== req.params.commentId
    );

    await post.save();
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};