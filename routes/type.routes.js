const express = require('express')
const router = express.Router()
const TypeController = require('../controllers/type_controller')

router.get('/', TypeController.index)
router.get('/get_active', TypeController.getActive)
router.post('/', TypeController.store)
router.put('/:id', TypeController.update)
router.put('/active/:id', TypeController.updateActive)
router.delete('/:id', TypeController.delete)


module.exports = router
