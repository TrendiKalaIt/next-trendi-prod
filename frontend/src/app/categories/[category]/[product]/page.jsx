"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";

const ProductPage = () => {
  const { category, product } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_URL}/api/products/${product}`);
        setProductData(res.data?.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch product data");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [product, API_URL]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!productData) return <p className="text-gray-500 text-center mt-10">Product not found</p>;

  return (
    <div className="bg-white md:mt-[52px] px-6 lg:px-12 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={productData.image}
            alt={productData.name}
            className="w-full max-w-md rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col justify-start">
          <h1 className="font-heading text-4xl font-extrabold text-gray-900 mb-4">
            {productData.name}
          </h1>
          <p className="text-gray-700 text-lg mb-4">{productData.description}</p>
          <p className="text-2xl font-bold text-gray-900 mb-6">₹{productData.price}</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-md">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
