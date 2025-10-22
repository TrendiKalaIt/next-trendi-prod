"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { showLoader, hideLoader } from "@/store/loaderSlice";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import Spinner from "../components/Spinner";
import dynamic from "next/dynamic";

// Lazy load components (Next.js way)
const HeroSection = dynamic(() => import("../components/HeroSection"), {
  loading: () => <Spinner />,
});
const NewArrivals = dynamic(() => import("../components/NewArrivals"), {
  loading: () => <Spinner />,
});
const Outfit = dynamic(() => import("../components/Outfit"), {
  loading: () => <Spinner />,
});
const PosterComponent = dynamic(() => import("../components/PosterComponent"), {
  loading: () => <Spinner />,
});
const ProductCard = dynamic(() => import("../components/ProductCard"), {
  loading: () => <Spinner />,
});

export default function Home() {
  const loading = useSelector((state) => state.loader.loading);
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  // Sequential load flags
  const [showHero, setShowHero] = useState(false);
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [showOutfit, setShowOutfit] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);

  useEffect(() => {

    const fetchProducts = async () => {
      try {
        dispatch(showLoader());
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products`
        );
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        setProducts(data);
        dispatch(hideLoader());
      } catch (err) {
        setError("Failed to load products");
        dispatch(hideLoader());
      }
    };
    fetchProducts();

    // Sequential animation (only once per session)
    const hasLoadedSequentially = sessionStorage.getItem("homeSequentialLoaded");
    if (!hasLoadedSequentially) {
      const timers = [];
      timers.push(setTimeout(() => setShowHero(true), 0));
      timers.push(setTimeout(() => setShowNewArrivals(true), 500));
      timers.push(setTimeout(() => setShowOutfit(true), 700));
      timers.push(setTimeout(() => setShowPoster(true), 900));
      timers.push(setTimeout(() => setShowFeatured(true), 1200));

      sessionStorage.setItem("homeSequentialLoaded", "true");
      return () => timers.forEach((t) => clearTimeout(t));
    } else {
      setShowHero(true);
      setShowNewArrivals(true);
      setShowOutfit(true);
      setShowPoster(true);
      setShowFeatured(true);
    }
  }, [dispatch]);

  return (
    <>
      {/* Hero Section */}
      {showHero ? <HeroSection /> : <Spinner />}

      {/* New Arrivals */}
      {showNewArrivals ? <NewArrivals /> : showHero && <Spinner />}

      {/* Outfit Section */}
      {showOutfit ? <Outfit /> : showNewArrivals && <Spinner />}

      {/* Poster Section */}
      {showPoster ? <PosterComponent /> : showOutfit && <Spinner />}

      {/* Featured Products */}
      {showFeatured ? (
        <div className="px-4 py-2 mb-3">
          <h2 className=" font-home text-lg font-bold text-[#9CAF88] uppercase mb-6">
            Featured Products
          </h2>

          {error && <p className="text-red-600">{error}</p>}

          {!error && (
            <>
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {products.slice(0, 4).map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        showPoster && <Spinner />
      )}
    </>
  );
}
