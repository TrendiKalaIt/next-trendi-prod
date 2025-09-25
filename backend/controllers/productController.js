// controllers/productController.js
const Product = require('../models/Product'); // Adjust path as needed
const mongoose = require('mongoose');
const category = require('../models/Category')

// Get all products with optional filtering
exports.getAllProducts = async (req, res) => {
    try {
        const query = {};

        // Filter by category if provided (category id expected)
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Filter by brand
        if (req.query.brand) {
            query.brand = req.query.brand;
        }

        // Filter by price range
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
        }

        // Find products with category populated (only required fields)
        const products = await Product.find(query)
            .populate('category', 'name slug icon')  // Populate category name, slug, icon
            .exec();

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error.message
        });
    }
};


exports.getProductBySlug = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product',
            error: error.message
        });
    }
};



exports.addProductReview = async (req, res) => {
    try {
        const productId = req.params.id;
        const { rating, comment } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        const review = {
            user: req.user._id,       // Pass user ObjectId from protect middleware
            name: req.user.name,      // User's name
            rating,
            comment,
            verified: true,
            date: new Date().toISOString().split('T')[0], // e.g. "2025-07-03"
        };

        product.reviews.push(review);
        await product.save();

        res.status(201).json({ message: 'Review added successfully', review });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to add review', error: err.message });
    }
};


// Search products by name, category, description, brand, and tags (partial, case-insensitive match)
exports.searchProducts = async (req, res) => {
    try {
        const query = req.query.query?.trim();

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required',
            });
        }

        const products = await Product.aggregate([
            {
                $lookup: {
                    from: 'categories',            
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },     
            {
                $match: {
                    $or: [
                        { productName: { $regex: query, $options: 'i' } },
                        // { brand: { $regex: query, $options: 'i' } },
                        // { description: { $regex: query, $options: 'i' } },
                       { 'category.name': { $regex: query, $options: 'i' } }
                    ]
                }
            }
        ]);

        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });

    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search products',
            error: error.message,
        });
    }
};


