'use client'; // This page uses client-side state and hooks

import React, { useState, useRef } from 'react';
import ProductCard from '../../components/ProductCard';
import { products as allProducts } from '@/data/products';
import { categories as allCategories } from '@/data/categories';

const Products = () => {
  const productSectionRef = useRef(null);
  const [products, setProducts] = useState(allProducts);
  const [categories] = useState(allCategories);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);

  const categoryHasProducts = selectedCategory
    ? products.some((p) => p.category === selectedCategory)
    : true;

  const handleSeeMore = () => setVisibleCount((prev) => prev + 8);

  // Filter products when category or subcategory changes
  const filterProducts = (categoryId, subcategoryId = '') => {
    let filtered = allProducts;

    if (categoryId) {
      filtered = filtered.filter((p) => p.category === categoryId);
    }

    if (subcategoryId) {
      filtered = filtered.filter((p) => p.subcategory === subcategoryId);
    }

    setProducts(filtered);

    setTimeout(() => {
      if (productSectionRef.current) {
        productSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden mb-6">
        <img
          src="/Trendikala-category.webp"
          alt="Main Banner"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 p-4 gap-4 sm:gap-2 mb-6">
        {categories.map((cat) => {
          const hasImage = cat.icon && typeof cat.icon === 'string';
          const isComingSoon =
            !categoryHasProducts && selectedCategory === cat._id;

          return (
            <div
              key={cat._id}
              className="cursor-pointer overflow-hidden transition relative"
              onClick={() => {
                setSelectedCategory(cat._id);
                setSelectedSubcategory('');
                filterProducts(cat._id);
              }}
            >
              <div className="w-full aspect-square overflow-hidden py-1 relative">
                {hasImage ? (
                  <img
                    src={cat.icon}
                    alt={cat.name}
                    className={`w-full h-full object-cover rounded-lg transform hover:-translate-y-1 ${
                      isComingSoon ? 'opacity-100 bg-black1/2' : ''
                    }`}
                    loading="lazy"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-500 font-medium text-center px-2">
                    {isComingSoon ? 'Coming Soon' : cat.name}
                  </div>
                )}

                {isComingSoon && (
                  <div className="font-body absolute md:px-10 px-4 md:left-[-55px] left-[-28px] top-4 transform -rotate-45 bg-red-600 text-white font-bold text-sm ribbon-label w-full">
                    Coming Soon
                  </div>
                )}
              </div>
              <div className="font-home p-2 sm:p-3 text-center text-gray-500 text-sm sm:text-base font-medium">
                {cat.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Products Section */}
      <section className="p-8" ref={productSectionRef}>
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-home underline decoration-[#9CAF88] text-xl sm:text-2xl font-semibold text-[#9CAF88] py-2">
            {selectedCategory
              ? categories.find((cat) => cat._id === selectedCategory)?.name ||
                'Filtered Products'
              : 'All Products'}
          </h1>

          {(selectedCategory || selectedSubcategory) && (
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedSubcategory('');
                filterProducts(''); 
              }}
              className="font-body text-white text-sm bg-gray-400 px-4 py-2 rounded hover:bg-gray-500"
            >
              View All Products
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <p className="text-gray-500 text-xl font-body font-bold">Coming soon</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-14">
              {products.slice(0, visibleCount).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {visibleCount < products.length && (
              <div className="text-center my-8">
                <button
                  onClick={handleSeeMore}
                  className="bg-[#93A87E] font-home text-white px-8 py-2 rounded-full hover:bg-[#93a87ea4] transition"
                >
                  See More
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Products;
