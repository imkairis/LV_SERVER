const express = require('express')
const router = express.Router()
const controller = require('../controllers/productController')
const {isAdmin, isAuthorization} = require('../middlewares/authMiddleware')
const {uploadFields} = require('../middlewares/fileMiddleware')

router.get('/', controller.getAll)
router.get('/admin', isAuthorization, isAdmin, controller.getAll)
router.post('/admin', isAuthorization, isAdmin, uploadFields([
  {
    name: 'images',
    maxCount: 10
  }, 
]), controller.createProduct)
router.get('/admin/:id', isAuthorization, isAdmin, controller.getOne)
router.put('/admin/:id', isAuthorization, isAdmin,uploadFields([
  {
    name: 'images',
    maxCount: 10
  },
]), controller.updateProduct)
router.delete('/admin/:id', isAuthorization, isAdmin, controller.deleteOne)
router.delete('/admin/:id/images/:image', isAuthorization, isAdmin, controller.deleteImage)
router.get('/:id', controller.getOne)

module.exports = router