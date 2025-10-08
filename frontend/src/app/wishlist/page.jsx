"use client"; // Needed because we use hooks and Redux

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchWishlist } from "@/store/wishlistSlice";
import ProductCard from "@/components/ProductCard";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const wishlist = useSelector((state) => state.wishlist.items);
  const loading = useSelector((state) => state.wishlist.loading);
  const error = useSelector((state) => state.wishlist.error);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Next.js navigation
    } else {
      dispatch(fetchWishlist());
    }
  }, [dispatch, router]);

  return (
    <div className="p-3 md:p-8 md:mt-10">
      <h1 className="text-3xl font-semibold text-green-700 mb-4 text-center font-heading">
        Your Wishlist
      </h1>
      <div className="border w-[150px] m-auto mb-8"></div>

      {loading && <p className="text-center text-gray-600 font-home">Loading your wishlist...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && wishlist.length === 0 && (
        <p className="text-center font-home text-gray-600">Your wishlist is empty.</p>
      )}

      {!loading && !error && wishlist.length > 0 && (
        <div className="">
          <h2 className="font-home text-lg font-bold text-[#9CAF88] uppercase mb-6">Your Favorite Picks</h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
