const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getCategories);

// slug pehle
router.get('/slug/:slug', categoryController.getCategoryBySlug);

// id baad me
router.get('/:id', categoryController.getCategoryById);

module.exports = router;
