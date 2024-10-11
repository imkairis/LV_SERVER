const express = require('express');
const router = express.Router();
const { createOrUpdate, deleteImage } = require('../controllers/configController');
const { uploadFields } = require('../middlewares/fileMiddleware');
const { isAuthorization, isAdmin } = require('../middlewares/authMiddleware');

router.put('/', 
  isAuthorization, 
  isAdmin,
  uploadFields(
    [
      {
        name: 'images',
        maxCount: 10,
      }, 
      {
        name: 'logo',
        maxCount: 1
      },
      {
        name: 'poster',
        maxCount: 1,
      }
    ]
  ),
  createOrUpdate
);

router.delete('/photos', isAuthorization, isAdmin, deleteImage)

module.exports = router;
