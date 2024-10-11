const express = require('express');
const router = express.Router();
const { register, login, updateUser, deleteUser, forgotPassword, resetPassword, deletePhoto, getInfo,googleCallback } = require('../controllers/authController');
const { uploadFields } = require('../middlewares/fileMiddleware');
const {isAuthorization, isAdmin} = require('../middlewares/authMiddleware');
const passport = require('passport');


router.put('/', isAuthorization, uploadFields(
  [
    {
      name: 'avatar',
      maxCount: 1,
    }, 
    {
      name: 'photos',
      maxCount: 10
    }
  ]
), updateUser);
router.delete('/', isAuthorization, deleteUser);
router.get('/', isAuthorization, getInfo)
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.delete('/photos/:photo', isAuthorization, deletePhoto);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }),googleCallback );

module.exports = router;
