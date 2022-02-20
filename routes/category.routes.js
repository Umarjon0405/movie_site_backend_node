const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category_controller');

router.get('/', CategoryController.index);
router.post('/', CategoryController.store);
// router.update('/:id', CategoryController.update);
// router.update('/active/:id', CategoryController.updateActive);
router.delete('/:id', CategoryController.delete);