"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import ProductCard from "@/components/ProductCard";
import Spinner from "@/components/Spinner";

const CategoryPage = () => {
  const { category } = useParams(); // slug from URL
  const router = useRouter();

  const [categoryData, setCategoryData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch category data
        const res = await axios.get(`${API_URL}/api/categories/slug/${category}`);
        const catData = res.data.data;
        setCategoryData(catData);

        // 2️⃣ Use catData.slug (not categoryData.slug)
        const prodRes = await axios.get(`${API_URL}/api/products?category=${catData.slug}`);
        setProducts(prodRes.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load category data");
      } finally {
        setLoading(false);
      }
    };

    if (category) fetchData();
  }, [category, API_URL]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;
  if (!categoryData) return <p className="text-center mt-10">Category not found</p>;

  return (

    <div className="px-6 lg:px-12 py-8 lg:mt-16">
      {/* Category Poster / Hero Section */}
      {(categoryData.image || categoryData.icon) && (
        <div
          className="w-full h-60 md:h-96 bg-contain bg-center rounded-lg mb-8"
          style={{ backgroundImage: `url(${categoryData.image || categoryData.icon})` }}
        >
          <div className="w-full h-full bg-black/30 flex items-center justify-center rounded-lg">
            <h1 className="text-white font-heading text-3xl md:text-5xl font-bold">{categoryData.name}</h1>
          </div>
        </div>
      )}

      {/* Products Section Header */}
      {products.length > 0 && (
        <h2 className="font-home text-2xl font-bold text-[#9CAF88] uppercase mb-6">
          Explore products in <span className="underline "> {categoryData.name}</span>
        </h2>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 space-y-6">
          {/* <img
            src="/coming-soon.png" // Add a proper coming soon image in /public
            alt="Coming Soon"
            className="w-40 sm:w-60 md:w-72"
          /> */}
          <h2 className="font-heading text-4xl font-bold text-[#9CAF88] uppercase text-center ">
            Coming Soon!
          </h2>
          <p className="text-gray-500 text-center max-w-md">
            Products in this category are being prepared. Stay tuned for exciting arrivals!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((prod) => (
            <div
              key={prod._id}
              onClick={() => router.push(`/${categoryData.slug}/${prod.slug}`)}
              className="cursor-pointer"
            >
              <ProductCard product={prod} />
            </div>
          ))}
        </div>
      )}
    </div>

  );
};

export default CategoryPage;
