"use client";  // <-- Add this at the very top

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

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_URL}/api/categories/slug/${category}`);
        setCategoryData(res.data.data);

        const prodRes = await axios.get(`${API_URL}/api/products?category=${res.data.data._id}`);
        setProducts(prodRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (category) fetchData();
  }, [category, API_URL]);

  return (
    <div className="px-6 lg:px-12 py-8">
      {loading ? <Spinner /> : (
        <>
          <h1 className="text-3xl font-bold mb-6">{categoryData?.name || category}</h1>
          {products.length === 0 ? (
            <p className="text-gray-500 text-lg">No products found</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {products.map(prod => (
                <div
                  key={prod._id}
                  onClick={() => router.push(`/categories/${category}/${prod.slug}`)}
                  className="cursor-pointer"
                >
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryPage;
