"use client"; // required because this page has useState, useEffect, Redux, and interactivity

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation"; // replaces useNavigate
import { addToCart } from "@/utility/cartSlice";
import { setOrderDetails } from "@/utility/checkoutSlice";
import { setReviews } from "@/utility/reviewSlice";
import toast from "react-hot-toast";
import { Star, Check, X, ChevronLeft, ChevronRight } from "lucide-react";

import TabsNavigation from "@/components/productDetails/ProductTabsNavigation";
import ProductDetails from "@/components/productDetails/ProductDetails";
import ProductReviews from "@/components/productDetails/ProductReviews";
import ProductReviewForm from "@/components/productDetails/ProductReviewForm";
import SizeChartModel from "@/components/productDetails/SizeChartModel.jsx";

const ProductDetailPage = ({ params }) => {
  const { slug } = params; // dynamic route: /product/[slug]
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [thumbnail, setThumbnail] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedStock, setSelectedStock] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isOpen, setIsOpen] = useState(false);
  const [animateThumbnail, setAnimateThumbnail] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);

  const reviews = useSelector((state) => state.review.reviews);

  const { description = "No description available" } = product || {};

  // Fetch product by slug
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/slug/${slug}`
        );
        const data = res.data?.data;

        if (!data) throw new Error("Product not found");

        setProduct(data);

        // Select first media and color
        const firstMedia = data.media?.[0] || null;
        setThumbnail(firstMedia);
        setSelectedColor(data.colors?.[0]?.name || "");

        // Select first available size automatically
        const firstAvailableSize = data.sizes?.find((s) => s.stock > 0);
        if (firstAvailableSize) {
          setSelectedSize(firstAvailableSize.size);
          setSelectedPrice(
            firstAvailableSize.discountPrice || firstAvailableSize.price
          );
          setSelectedStock(firstAvailableSize.stock);
        }
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleSizeSelect = (sizeObj) => {
    if (sizeObj.stock <= 0) return;
    setAnimateThumbnail(true);
    setSelectedSize(sizeObj.size);
    setSelectedPrice(sizeObj.discountPrice || sizeObj.price);
    setSelectedStock(sizeObj.stock);
    setQuantity(1);
    setTimeout(() => setAnimateThumbnail(false), 300);
  };

  const handleQuantity = (type) => {
    setQuantity((prev) =>
      type === "increase"
        ? Math.min(prev + 1, selectedStock)
        : Math.max(1, prev - 1)
    );
  };

  const handleAddToCart = () => {
    if (!product) return toast.error("Product not found");
    if (selectedStock <= 0) return toast.error("Selected size is out of stock");

    const currentSizeObj = product.sizes?.find((s) => s.size === selectedSize);
    if (!currentSizeObj) return toast.error("Invalid size selected");

    const cartItem = {
      product: product._id,
      quantity,
      color: selectedColor,
      size: selectedSize,
      discountPrice: currentSizeObj.discountPrice || currentSizeObj.price,
      productName: product.productName,
      image: thumbnail?.url || product.media?.[0]?.url || "",
    };

    dispatch(addToCart([cartItem]))
      .unwrap()
      .then(() => toast.success("Item added to cart!"))
      .catch(() => toast.error("Please login first"));
  };

  const handleBuyNow = () => {
    if (!product) return toast.error("Product not found");
    if (selectedStock <= 0) return toast.error("Selected size is out of stock");

    const currentSizeObj = product.sizes?.find((s) => s.size === selectedSize);
    if (!currentSizeObj) return toast.error("Invalid size selected");
    if (quantity > currentSizeObj.stock)
      return toast.error(`Only ${currentSizeObj.stock} items available`);

    const productToBuy = {
      product: product._id,
      productName: product.productName,
      price: currentSizeObj.price,
      discountPrice: currentSizeObj.discountPrice || currentSizeObj.price,
      color: selectedColor,
      size: selectedSize,
      quantity,
      image: thumbnail?.url || product.media?.[0]?.url || "",
    };

    localStorage.setItem(
      "checkoutState",
      JSON.stringify({ orderDetails: productToBuy, cartFromCheckout: [] })
    );

    if (!user) {
      router.push("/create-account?redirect=/checkout");
      return;
    }

    dispatch(setOrderDetails(productToBuy));
    router.push("/checkout");
  };

  const handleSizeChartClick = () => setIsSizeModalOpen(true);

  const getAvgRating = (reviews) => {
    if (!reviews?.length) return 0;
    return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  };

  useEffect(() => {
    if (product?.reviews) dispatch(setReviews(product.reviews));
  }, [product, dispatch]);

  if (loading) return <div className="text-center mt-10">Loading product...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!product) return <div className="text-center text-red-500 mt-10">Product not found.</div>;

  const avgRating = getAvgRating(product.reviews);
  const currentSizeObj = product.sizes?.find((s) => s.size === selectedSize) || {};
  const discountPercent = currentSizeObj.discountPrice
    ? Math.round(((currentSizeObj.price - currentSizeObj.discountPrice) / currentSizeObj.price) * 100)
    : 0;

  return (
    <>
      <div className="bg-white flex flex-col lg:flex-row gap-8 p-4 lg:px-16 w-full mt-8">
        {/* Left Side: Media Thumbnails */}
        <div className="flex flex-col lg:flex-row w-full lg:w-5/12 gap-4 lg:items-start h-full">
          <div className="w-full lg:w-4/12 overflow-x-auto lg:overflow-y-auto pr-2 order-2 lg:order-1 lg:h-[430px]">
            <div className="flex gap-4 lg:flex-col">
              {product.media?.map((media, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setThumbnail(media);
                    setCurrentIndex(i); 
                  }}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition ${thumbnail?.url === media.url
                    ? "border-green-700"
                    : "border-gray-300"
                    }`}
                >
                  {media.type === "image" ? (
                    <img
                      src={media.url}
                      alt={`Thumb ${i}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={media.url}
                      muted
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div
            className="w-full lg:w-6/6 md:h-[350px] lg:h-full rounded-lg overflow-hidden border border-green-700/50 order-1 lg:order-2"
            onClick={() => setIsOpen(true)}
          >
            <AnimatePresence mode="wait">
              {thumbnail && (
                <motion.div
                  key={thumbnail.url + selectedSize}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full"
                >
                  {thumbnail.type === "image" ? (
                    <img
                      src={thumbnail.url}
                      alt={product.productName}
                      className="w-full h-full md:object-contain object-fill object-top"
                    />
                  ) : (
                    <video
                      src={thumbnail.url}
                      controls
                      className="w-full h-full object-cover object-top"
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Product Info */}
        <div className="w-full lg:w-2/6 space-y-2">
          <h1 className=" font-heading text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7A9D54] via-[#F472B6] to-[#3ABAB4]">
            {product.productName}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                fill={i < Math.round(avgRating) ? "#FFC107" : "#ffffff"}
                stroke={i < Math.round(avgRating) ? "#FFC107" : "#A0A0A0"}
              />
            ))}
            <span className="text-gray-600 font-semibold">{avgRating}/5</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4">
            <span className="text-lg font-semibold text-[#35894E]">
              ₹{selectedPrice}
            </span>
            {discountPercent > 0 && (
              <>
                <span className="text-gray-500 line-through">
                  ₹{currentSizeObj.price}
                </span>
                <span className="text-sm bg-[#93A87E4B] px-2 py-0.5 rounded-full text-black">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* description */}
          <p className=" font-body text-sm text-[#00000098] ">{description}</p>

          {/* Colors */}
          <div>
            <h3 className="font-body text-[#35894E] mb-2">Select Colors</h3>
            <div className="flex gap-3">
              {product.colors?.map((color) => (
                <div key={color.name} className="relative group">
                  <button
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition 
            ${selectedColor === color.name
                        ? "border-green-700 scale-110"
                        : "border-gray-300"
                      }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {selectedColor === color.name && (
                      <Check size={18} color="white" />
                    )}
                  </button>

                  {/* Tooltip */}
                  <div
                    className="absolute left-1/2 -top-10 transform -translate-x-1/2 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
                    style={{ backgroundColor: color.hex }}
                  >
                    <span className="text-outline">{color.name}</span>

                    <div
                      className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45"
                      style={{ backgroundColor: color.hex }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="font-body text-[#35894E] mb-2">Choose Size</h3>

            <div className="overflow-x-auto sm:overflow-visible">
              <button
                onClick={handleSizeChartClick}
                className=" py-1 mb-2 text-sm font-semibold px-3  rounded-3xl lg:px-4 lg:py-2 lg:rounded-none border   text-[#93A87E]  hover:bg-indigo-50 transition-colors duration-300"
              >
                Size Chart
              </button>
              <div className="flex gap-3 whitespace-nowrap sm:flex-wrap">
                {product.sizes?.map((sizeObj) => (
                  <div
                    key={sizeObj.size}
                    className="relative inline-block group"
                  >
                    <button
                      onClick={() => handleSizeSelect(sizeObj)}
                      disabled={sizeObj.stock <= 0}
                      className={` font-heading relative px-3 rounded-3xl lg:px-4 lg:py-2 lg:rounded-none border text-[12px] font-medium transition
    ${selectedSize === sizeObj.size
                          ? "bg-[#93A87E] text-white border-[#93A87E]"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                        }
    ${sizeObj.stock <= 0 ? "text-gray-400 cursor-not-allowed" : ""}`}
                    >
                      {sizeObj.size}
                      {/* The conditional div for the diagonal line */}
                      {sizeObj.stock <= 0 && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center">
                          <div className="lg:w-full w-6 h-[1px] bg-red-600 transform -rotate-45"></div>
                        </div>
                      )}
                    </button>
                    {/* Tooltip */}

                    {sizeObj.stock <= 0 && (
                      <div className="absolute left-1/2 -top-10 transform -translate-x-1/2 bg-red-500 w-20 text-white text-xs rounded text-centre px-1 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                        Out of Stock
                        <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity, Add to Cart & Buy Now */}
          <div className="flex flex-col gap-3 pt-1 w-full">
            {/* Quantity Selector */}
            <div className="flex items-center p-0 border border-gray-300 rounded-full lg:w-32 justify-between self-start">
              <button
                className="px-4 text-xl text-gray-600 hover:bg-gray-100 rounded-l-full py-1"
                onClick={() => handleQuantity("decrease")}
              >
                -
              </button>
              <span className="text-lg font-medium">{quantity}</span>
              <button
                className="px-4 text-xl text-gray-600 hover:bg-gray-100 rounded-r-full py-1"
                onClick={() => handleQuantity("increase")}
              >
                +
              </button>
            </div>

            {/* Buttons Row */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={selectedStock <= 0}
                className={`flex-1 py-2 text-xl rounded-full shadow-lg 
    transition-transform duration-300 ease-in-out
    ${selectedStock <= 0
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-[#a4aeb2] text-white font-semibold shadow-md hover:scale-105 hover:brightness-90"
                  }`}
              >
                {selectedStock <= 0 ? "Out of Stock" : "Add to Cart"}
              </button>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                disabled={selectedStock <= 0}
                className={`flex-1 py-2 text-xl rounded-full shadow-lg 
    transition-transform duration-300 ease-in-out
    ${selectedStock <= 0
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-gradient-to-r from-[#35894E] to-[#80996D] text-white font-semibold shadow-md hover:scale-105 hover:brightness-90"
                  }`}
              >
                {selectedStock <= 0 ? "Out of Stock" : "Buy Now"}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Section */}
      <div className="  max-w-6xl mx-auto p-4 mt-2">
        <TabsNavigation
          tabs={[
            { id: "description", name: "Description & Details" },
            { id: "reviews", name: "Reviews" },
          ]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className="pt-6  ">
          {activeTab === "description" ? (
            <ProductDetails productData={product} />
          ) : (
            <>

              <ProductReviewForm productId={product._id} />
              <ProductReviews reviews={reviews} />


            </>
          )}
        </div>
      </div>

      {/* image/video modal with carousel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full p-4 flex flex-col items-center">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-7 lg:-top-0 right-2 lg:right-10 text-white text-3xl font-bold z-50"
            >
              <X />
            </button>

            {/* Left Navigation */}
            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === 0 ? product.media.length - 1 : prev - 1
                )
              }
              className="absolute left-2 top-1/2 transform -translate-y-1/2 md:text-white lg:text-white text-3xl z-50  h-full  "
            >
              <ChevronLeft />
            </button>

            {/* Right Navigation */}
            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === product.media.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-2 top-1/2 transform -translate-y-1/2 md:text-white lg:text-white text-3xl z-50  h-full "
            >
              <ChevronRight />
            </button>

            {/* Media Display */}
            {product.media[currentIndex]?.type === "image" ? (
              <img
                src={product.media[currentIndex].url}
                alt={`Media ${currentIndex + 1}`}
                className="w-full h-auto max-h-[90vh] rounded-lg object-contain"
              />
            ) : (
              <video
                src={product.media[currentIndex].url}
                controls
                autoPlay
                className="w-full h-auto max-h-[90vh] rounded-lg object-contain"
              />
            )}

            {/* Optional: Show index */}
            <div className="text-white mt-2">
              {currentIndex + 1} / {product.media.length}
            </div>
          </div>
        </div>
      )}

      <SizeChartModel
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
      />
    </>
  );
};

export default ProductDetailPage;