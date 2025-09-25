const express = require('express');
const upload = require('../middleware/multer');
const productController = require('../controllers/productController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// ========================== Get All Products ==========================
router.get('/', productController.getAllProducts);

// ========================== Search Products ==========================
router.get('/search', productController.searchProducts);

// ========================== Get Product by Slug (SEO Friendly) ==========================
router.get('/slug/:slug', productController.getProductBySlug);

// ========================== Optional: Redirect from ID to Slug ==========================
router.get('/:id', async (req, res) => {
  const Product = require('../models/Product');
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // 301 permanent redirect to SEO-friendly slug URL
    return res.redirect(301, `/products/slug/${product.slug}`);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// ========================== Add Product Review ==========================
router.post('/:id/reviews', protect, productController.addProductReview);


module.exports = router;
