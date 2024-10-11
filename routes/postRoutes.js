const express = require('express');
const router = express.Router();
const controller = require('../controllers/postController');
const { isAuthorization, isAdmin } = require('../middlewares/authMiddleware');
const {uploadFields} = require('../middlewares/fileMiddleware'); 

router.get('/', isAuthorization, controller.getAllPosts);
router.get('/admin', isAuthorization, isAdmin, controller.getAllPosts);
router.post('/admin', isAuthorization, isAdmin, uploadFields([
  {
    name: 'media',
    maxCount: 10
  }
]), controller.createPost);
router.put('/admin/:id', isAuthorization, isAdmin, uploadFields([
  {
    name: 'media',
    maxCount: 10
  }
]), controller.updatePost);
router.delete('/admin/:id', isAuthorization, isAdmin, controller.deletePost);
router.get('/admin/:id', isAuthorization, isAdmin, controller.getPostById);
router.get('/:id', isAuthorization, controller.getPostById);

router.post('/:id/reactions', isAuthorization, controller.addReaction);
router.delete('/:id/reactions/:reactionId', isAuthorization, isAdmin, controller.deleteReaction);

router.post('/:id/comments', isAuthorization, controller.addComment);
router.delete('/:id/comments/:commentId', isAuthorization, isAdmin, controller.deleteComment);

module.exports = router;
