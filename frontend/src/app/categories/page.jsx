"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
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
    <div className="bg-white md:mt-[52px]">



      {/* Container for the two sections */}
      <div className="relative w-full h-5/6   overflow-hidden flex flex-col md:flex-row">

        {/* Left Section - uses a CSS clip-path to create the diagonal shape */}
        <div
          className="flex-1 h-[400px] p-8 flex items-center justify-center relative bg-green-100"
          style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}
        >
          <div className="space-y-6 relative pr-6 md:pr-10  ">
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Explore Our Categories
            </h1>
            {/* <h2 className="font-home text-2xl md:text-3xl font-semibold text-amber-600">
              Flat 50% Off
            </h2> */}
            <p className="font-home text-gray-600 text-lg max-w-md">
              Discover styles that match your vibe! Browse our collections and find your perfect fit.
            </p>
            <button className="font-heading bg-blue-100 text-white px-6 py-3 rounded-lg hover:bg-blue-200 transition font-medium shadow-md">
              Shop Now →
            </button>


          </div>

        </div>

        {/* Right Section - also uses a CSS clip-path for the diagonal shape. 
        It overlaps the left section to create the seamless look. */}
        <div
          className="flex-1 p-8 flex items-center justify-center relative -ml-16 md:-ml-32 lg:-ml-48    bg-cover  "
          style={{
            clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)',
            backgroundImage: "url('/madubala.webp')",
          }}
        >
        </div>
      </div>



      {/* Categories Section */}
      <div className=" font-home flex justify-between items-center px-6 lg:px-12 py-6">
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
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 px-6 lg:px-12 mb-10">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => router.push(`/categories/${cat._id}`)}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center border rounded-full bg-gray-100 hover:bg-gray-200 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                {cat.icon ? (
                  <img
                    src={cat.icon}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-sm text-gray-500">{cat.name}</span>
                )}
              </div>
              <p className="font-home font- mt-2 text-gray-700 text-base font-medium">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* New Arrivals / Products Section */}
      <div className="font-home flex justify-between items-center px-6 lg:px-12 py-6">
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 px-6 lg:px-12 mb-12">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
