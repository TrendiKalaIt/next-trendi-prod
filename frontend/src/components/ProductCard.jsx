"use client";

import React, { useState } from "react";
import { Heart, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToCart } from "../store/cartSlice";
import { addToWishlist, removeFromWishlist } from "../store/wishlistSlice";
import { setOrderDetails } from "../store/checkoutSlice";
import { Dialog } from "@headlessui/react";

const ProductCard = ({ product = {} }) => {
  const {
    media = [],
    category = "Category",
    productName = "Product Name",
    description = "Product description",
    colors = [],
    sizes = [],
    _id,
  } = product;

  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const wishlist = useSelector((state) => state.wishlist.items);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("cart");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const availableSizes = sizes.filter((s) => s.stock > 0);
  const cheapestSize = availableSizes.length
    ? availableSizes.reduce((min, s) => {
      const currentPrice = s.discountPrice || s.price;
      const minPrice = min.discountPrice || min.price;
      return currentPrice < minPrice ? s : min;
    })
    : null;

  const productPrice = cheapestSize ? cheapestSize.price : 0;
  const productDiscountPrice = cheapestSize
    ? cheapestSize.discountPrice || cheapestSize.price
    : 0;
  const productStock = cheapestSize ? cheapestSize.stock : 0;
  const isOutOfStock = (Math.floor(Number(productStock)) || 0) <= 0;

  const handleNavigate = () => {
    if (product.slug && category?.slug) {
      router.push(`/${category.slug}/${product.slug}`);
    }
  };



  // const handleAddToCartClick = () => {
  //   if (isOutOfStock) {
  //     toast("Product is out of stock, please add it to wishlist");
  //     return;
  //   }
  //   setModalType("cart");
  //   setIsModalOpen(true);
  // };

  // const handleBuyNowClick = () => {
  //   if (isOutOfStock) {
  //     toast.error("Product is out of stock");
  //     return;
  //   }
  //   setModalType("buy");
  //   setIsModalOpen(true);
  // };

  // When opening modal
  const handleAddToCartClick = (e) => {
    e.stopPropagation(); // <-- stop bubbling to card click
    if (isOutOfStock) {
      toast("Product is out of stock, please add it to wishlist");
      return;
    }
    setModalType("cart");
    setIsModalOpen(true);
  };

  const handleBuyNowClick = (e) => {
    e.stopPropagation(); // <-- stop bubbling to card click
    if (isOutOfStock) {
      toast.error("Product is out of stock");
      return;
    }
    setModalType("buy");
    setIsModalOpen(true);
  };

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select size and color");
      return;
    }

    const selectedSizeObj = sizes.find((s) => s.size === selectedSize);
    if (!selectedSizeObj) {
      toast.error("Invalid size selected");
      return;
    }

    if (quantity > selectedSizeObj.stock) {
      toast.error(`Sorry, only ${selectedSizeObj.stock} items available.`);
      return;
    }

    const cartItem = {
      product: _id,
      productName,
      price: selectedSizeObj.price,
      discountPrice: selectedSizeObj.discountPrice || selectedSizeObj.price,
      color: selectedColor,
      size: selectedSize,
      quantity,
      image: media?.[0]?.url || "",
    };

    try {
      await dispatch(addToCart([cartItem])).unwrap();
      toast.success("Added to cart");
      setIsModalOpen(false);
      setSelectedColor("");
      setSelectedSize("");
      setQuantity(1);
    } catch (error) {
      toast.error("Please login first to continue.");
    }
  };

  const handleCheckout = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select size and color before checkout");
      return;
    }

    const selectedSizeObj = sizes.find((s) => s.size === selectedSize);
    if (!selectedSizeObj) {
      toast.error("Invalid size selected");
      return;
    }

    if (quantity > selectedSizeObj.stock) {
      toast.error(`Sorry, only ${selectedSizeObj.stock} items available.`);
      return;
    }

    const productToBuy = {
      product: _id,
      productName,
      price: selectedSizeObj.price,
      discountPrice: selectedSizeObj.discountPrice || selectedSizeObj.price,
      color: selectedColor,
      size: selectedSize,
      quantity,
      image: media?.[0]?.url || "",
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "checkoutState",
        JSON.stringify({
          orderDetails: productToBuy,
          cartFromCheckout: [],
        })
      );
    }

    setIsModalOpen(false);

    if (!user) {
      router.push("/create-account?redirect=/checkout");
    }

    dispatch(setOrderDetails(productToBuy));
    router.push("/checkout");
  };

  const isWishlisted = wishlist.some((item) => item._id === _id);
  const toggleWishlist = async (e) => {
    e.stopPropagation();
    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist(_id)).unwrap();
        toast.success("Removed from Wishlist!");
      } else {
        await dispatch(addToWishlist(product)).unwrap();
        toast.success("Added to Wishlist");
      }
    } catch (error) {
      toast.error(error || "Wishlist update failed");
    }
  };

  const getSelectedSizeStock = () => {
    const sizeObj = sizes.find((s) => s.size === selectedSize);
    return sizeObj ? sizeObj.stock : 0;
  };

  return (
    <>
      <div
        className="relative w-full max-w-[150px] sm:max-w-[160px] md:max-w-[200px] mx-auto bg-white border rounded-2xl overflow-hidden
             flex flex-col transition-transform duration-300 ease-in-out hover:shadow-md hover:scale-105"
      >
        {/* Image */}
        <div
          className="relative w-full h-28 sm:h-32 md:h-36 overflow-hidden rounded-t-2xl cursor-pointer"
          onClick={handleNavigate}
        >
          <img
            src={
              media?.[0]?.url ||
              "https://placehold.co/150x150/FFD368/333?text=Product"
            }
            alt={productName}
            className="w-full h-full object-contain object-top transition-transform duration-300 ease-in-out hover:scale-110"
            loading="lazy"
          />
          {user && (
            <button
              className="absolute top-2 right-2 p-1 rounded-full text-gray-700 hover:text-red-500 hover:scale-110"
              onClick={toggleWishlist}
            >
              <Heart
                size={20}
                strokeWidth={1.5}
                color={isWishlisted ? "#22c55e" : "gray"}
                fill={isWishlisted ? "#22c55e" : "white"}
              />
            </button>
          )}
          {isOutOfStock && (
            <div className="absolute top-1 left-2 bg-red-400 text-white text-xs font-bold px-2 py-0.5 rounded-xl">
              Out of Stock
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-2 flex flex-col justify-between h-28 sm:h-32 md:h-34">
          <div className="overflow-hidden">
            <p className="text-[14px] text-gray-400 uppercase truncate">
              {category?.name}
            </p>
            <h3
              onClick={handleNavigate}
              className="text-[16px] font-bold text-gray-800 truncate cursor-pointer hover:underline"
            >
              {productName}
            </h3>
            <p className="text-[14px] text-gray-500 truncate">{description}</p>

            <div className="flex gap-1">
              <p className="text-sm text-green-600">₹{productDiscountPrice}</p>
              {productDiscountPrice !== productPrice && (
                <p className="text-sm text-gray-400 line-through">
                  ₹{productPrice}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-1 pt-1">
            <button
              onClick={handleAddToCartClick}
              disabled={isOutOfStock}
              className={`flex-1 text-[14px] font-bold rounded-full text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-300 disabled:text-gray-500`}
            >
              {isOutOfStock ? "Out of Stock" : "Add"}
            </button>

            <button
              onClick={handleBuyNowClick}
              disabled={isOutOfStock}
              className={`flex-1 text-[14px] font-bold rounded-full text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500`}
            >
              Buy
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-white  shadow-xl p-4 w-full max-w-sm space-y-3">
            <Dialog.Title className="text-2xl font-bold text-green-700">
              Select Size & Color
            </Dialog.Title>

            {/* Colors */}
            <div>
              <h4 className="text-md text-gray-600 mb-1">Colors:</h4>
              <div className="flex gap-2">
                {colors?.map((color) => (
                  <button
                    key={color.name}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedColor === color.name
                      ? "border-green-600 scale-110"
                      : "border-gray-300"
                      }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color.name)}
                  >
                    {selectedColor === color.name && (
                      <Check size={12} color="white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="flex flex-wrap gap-2">
              <h4 className="text-md text-gray-600 mb-1">Sizes:</h4>

              {sizes?.map((size) => (
                <button
                  key={size.size}
                  onClick={() => setSelectedSize(size.size)}
                  disabled={size.stock <= 0}
                  className={`px-2 py-1 text-md p-10  border ${selectedSize === size.size
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                    } ${size.stock <= 0 ? "text-gray-400 cursor-not-allowed" : ""
                    }`}
                >
                  {size.size}
                </button>
              ))}

            </div>

            {/* Quantity */}
            <div className="flex items-center gap-2">
              <span className="text-md text-gray-600">Qty:</span>
              <div className="flex items-center border rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 text-lg"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 text-lg"
                  disabled={!selectedSize || quantity >= getSelectedSizeStock()}
                >
                  +
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                className="px-3 py-1 text-sm text-gray-600 border rounded-full"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              {modalType === "cart" ? (
                <button
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleAddToCart}
                  disabled={
                    !selectedColor ||
                    !selectedSize ||
                    quantity > getSelectedSizeStock() ||
                    getSelectedSizeStock() === 0
                  }
                >
                  Add to Cart
                </button>
              ) : (
                <button
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleCheckout}
                  disabled={
                    !selectedColor ||
                    !selectedSize ||
                    quantity > getSelectedSizeStock() ||
                    getSelectedSizeStock() === 0
                  }
                >
                  Checkout
                </button>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default ProductCard;
