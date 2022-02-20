const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user_controller')

router.get('/', UserController.index)
router.post('/', UserController.store)
router.put('/:id', UserController.update)
router.delete('/:id', UserController.delete)
router.put('/admin/:id', UserController.admin)


module.exports = router
