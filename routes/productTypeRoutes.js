const express = require('express');
const router = express.Router();
const {isAdmin, isAuthorization} = require('../middlewares/authMiddleware')
const {uploadFields} = require('../middlewares/fileMiddleware')
const controller = require('../controllers/productTypeController')

router.get('/', controller.getAll)
router.get('/admin', isAuthorization, isAdmin, controller.getAll)
router.post('/admin', isAuthorization, isAdmin, uploadFields([{
  name: 'image',
  maxCount: 1,
}]), controller.createOne)
router.get('/admin/:id', isAuthorization, isAdmin, controller.getOne)
router.put('/admin/:id', isAuthorization, isAdmin, uploadFields({
  name: 'image',
  maxCount: 1,
}), controller.updateOne)
router.delete('/admin/:id', isAuthorization, isAdmin, controller.deleteOne)
router.get('/:id', controller.getOne)
router.get('/:id/products', controller.getProductByType)

module.exports = router