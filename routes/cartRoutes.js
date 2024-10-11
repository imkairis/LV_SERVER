const express = require('express')
const router = express.Router()
const {isAuthorization} = require('../middlewares/authMiddleware')
const controller = require('../controllers/cartController')

router.get('/', isAuthorization, controller.getAll)
router.post('/', isAuthorization, controller.addNewProduct)
router.put('/', isAuthorization, controller.updateCart)
router.delete('/', isAuthorization, controller.deleteItemFromCart)
router.delete('/all', isAuthorization, controller.clearCart)

module.exports = router