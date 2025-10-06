"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import ProductCard from "@/components/ProductCard";
import Spinner from "@/components/Spinner";

const CategoryProductsPage = () => {
  const { categoryName } = useParams(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Fetch all categories
        const categoryRes = await axios.get(`${API_URL}/api/categories`);
        const categories = categoryRes.data?.data || [];

        // Step 2: Match category by name
        const matchedCategory = categories.find((cat) =>
          cat.name.toLowerCase().replace(/\s+/g, "-") === categoryName
        );

        if (!matchedCategory) {
          setError("Category not found");
          setLoading(false);
          return;
        }

        // Step 3: Fetch products by category ID
        const productRes = await axios.get(
          `${API_URL}/api/products?category=${matchedCategory._id}`
        );

        setProducts(productRes.data?.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchCategoryProducts();
    }
  }, [categoryName, API_URL]);

  return (
    <div className="bg-white px-6 lg:px-12 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 capitalize">
        {categoryName.replace(/-/g, " ")}
      </h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-xl font-bold text-center">
          No products found in this category
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProductsPage;
