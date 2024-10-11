const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { isAuthorization, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', isAuthorization, feedbackController.getAllFeedbacks);
router.post('/', isAuthorization, feedbackController.createFeedback);
router.get('/book/:bookId', isAuthorization, feedbackController.getAllFeedbackByBook);

router.get('/admin', isAuthorization, isAdmin, feedbackController.getAllFeedbacksForAdmin);
router.get('/admin/:id', isAuthorization, isAdmin, feedbackController.getFeedbackById);
router.delete('/admin/:id', isAuthorization, isAdmin, feedbackController.deleteFeedback);

module.exports = router;
