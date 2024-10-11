const express = require('express')
const router = express.Router()
const controller = require('../controllers/accountController')
const {isAdmin, isAuthorization} = require('../middlewares/authMiddleware')

router.get('/', isAuthorization, isAdmin, controller.getAllCustomer)
router.get('/admin', isAuthorization, isAdmin, controller.getAllAdmin)
router.post('/admin', isAuthorization, isAdmin, controller.createOne)
router.get('/admin/:id', isAuthorization, isAdmin, controller.getOne)
router.put('/admin/:id', isAuthorization, isAdmin, controller.updateOne)
router.delete('/admin/:id', isAuthorization, isAdmin, controller.deleteOne)
router.get('/:id', isAuthorization, isAdmin, controller.getOne)
router.put('/:id', isAuthorization, isAdmin, controller.updateOne)
router.delete('/:id', isAuthorization, isAdmin, controller.deleteOne)


module.exports = router