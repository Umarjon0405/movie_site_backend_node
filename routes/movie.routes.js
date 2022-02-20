const express = require('express')
const router = express.Router()
const MovieController = require('../controllers/movie_controller')
const auth = require('../middleware/auth')


router.get('/', auth, MovieController.index)
router.get('/get_active', MovieController.getActive)
router.post('/', auth, MovieController.store)
router.get('/:id', MovieController.show)
router.get('/play_video/:id', MovieController.playVideo)


module.exports = router
