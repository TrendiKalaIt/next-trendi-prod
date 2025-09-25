const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// CRUD routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);


module.exports = router;
