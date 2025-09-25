"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ProductCard from "@/components/ProductCard";
import Spinner from "@/components/Spinner";

const CategoriesPage = () => {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch Categories
        const catRes = await axios.get(`${API_URL}/api/categories`);
        setCategories(catRes.data?.data || []);

        // Fetch Products
        const prodRes = await axios.get(`${API_URL}/api/products`);
        setProducts(prodRes.data?.data || []);

      } catch (err) {
        console.error(err);
        setError("Failed to fetch data from server");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  return (
    <div className="bg-white">
      {/* 🔥 Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center px-6 lg:px-12 py-12 pt-[80px] gap-10 bg-gray-50">
        {/* Left Text */}
        <div className="space-y-6 relative pr-6 md:pr-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Summer Sale is Here 🎉
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-amber-600">
            Flat 50% Off
          </h2>
          <p className="text-gray-600 text-lg max-w-md">
            Upgrade your wardrobe with our exclusive summer collection. Limited time offer, don’t miss out!
          </p>
          <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-medium shadow-md">
            Shop Now →
          </button>

          {/* Vertical Divider */}
          <div className="hidden md:block absolute top-0 right-0 h-full w-0.5 bg-gray-300"></div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center md:justify-end w-full">
          <img
            src="/Trendikala-category.webp"
            alt="Summer Sale Banner"
            className="rounded-xl shadow-lg w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Categories Section */}
      <div className="flex justify-between items-center px-6 lg:px-12 py-6">
        <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
        <button className="text-gray-600 hover:text-black">View all</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : error ? (
        <p className="text-red-600 px-6">{error}</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 px-6 lg:px-12 mb-10">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => router.push(`/categories/${cat._id}`)}
            >
              <div className="w-20 h-20 flex items-center justify-center border rounded-full bg-gray-100 hover:bg-gray-200 transition">
                {cat.icon ? (
                  <img
                    src={cat.icon}
                    alt={cat.name}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <span className="text-sm text-gray-500">{cat.name}</span>
                )}
              </div>
              <p className="mt-2 text-gray-700 text-sm font-medium">{cat.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* New Arrivals / Products Section */}
      <div className="flex justify-between items-center px-6 lg:px-12 py-6">
        <h2 className="text-2xl font-bold text-gray-800">New Arrivals</h2>
        <button className="text-gray-600 hover:text-black">View all</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : error ? (
        <p className="text-red-600 px-6">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-xl font-body font-bold text-center">
          No products found
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 px-6 lg:px-12 mb-12">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
