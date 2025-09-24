'use client';

import React, { useState } from 'react';
import { Heart, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addToCart } from '../store/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';
import { setOrderDetails } from '../store/checkoutSlice';
import { Dialog } from '@headlessui/react';
// Optionally import Next.js Image component if your product images are optimized
// import Image from 'next/image';

const ProductCard = ({ product = {} }) => {
  const {
    media = [],
    category = 'Category',
    productName = 'Product Name',
    description = 'Product description',
    colors = [],
    sizes = [],
    _id,
  } = product;

  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const wishlist = useSelector((state) => state.wishlist.items);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('cart');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Sizes with stock > 0
  const availableSizes = sizes.filter((s) => s.stock > 0);

  // Cheapest size
  const cheapestSize = availableSizes.length
    ? availableSizes.reduce((min, s) => {
        const currentPrice = s.discountPrice || s.price;
        const minPrice = min.discountPrice || min.price;
        return currentPrice < minPrice ? s : min;
      })
    : null;

  // Dynamic price & stock
  const productPrice = cheapestSize ? cheapestSize.price : 0;
  const productDiscountPrice = cheapestSize
    ? cheapestSize.discountPrice || cheapestSize.price
    : 0;
  const productStock = cheapestSize ? cheapestSize.stock : 0;

  const isOutOfStock = (Math.floor(Number(productStock)) || 0) <= 0;

  const handleNavigate = () => {
    if (product.slug && category?.name) {
      const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
      router.push(`/women-products/${categorySlug}/${product.slug}`);
    }
  };

  const handleAddToCartClick = () => {
    if (isOutOfStock) {
      toast('Product is out of stock, please add it to wishlist');
      return;
    }
    setModalType('cart');
    setIsModalOpen(true);
  };

  const handleBuyNowClick = () => {
    if (isOutOfStock) {
      toast.error('Product is out of stock');
      return;
    }
    setModalType('buy');
    setIsModalOpen(true);
  };

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      toast.error('Please select size and color');
      return;
    }

    const selectedSizeObj = sizes.find(s => s.size === selectedSize);
    if (!selectedSizeObj) {
      toast.error('Invalid size selected');
      return;
    }

    if (quantity > selectedSizeObj.stock) {
      toast.error(`Sorry, there are only ${selectedSizeObj.stock} items of this size available.`);
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
      image: media?.[0]?.url || '',
    };

    try {
      await dispatch(addToCart([cartItem])).unwrap();
      toast.success('Added to cart');
      setIsModalOpen(false);
      setSelectedColor('');
      setSelectedSize('');
      setQuantity(1);
    } catch (error) {
      toast.error('Please login first to continue.');
    }
  };

  const handleCheckout = () => {
    if (!selectedColor || !selectedSize) {
      toast.error('Please select size and color before checkout');
      return;
    }

    const selectedSizeObj = sizes.find(s => s.size === selectedSize);
    if (!selectedSizeObj) {
      toast.error('Invalid size selected');
      return;
    }

    if (quantity > selectedSizeObj.stock) {
      toast.error(`Sorry, there are only ${selectedSizeObj.stock} items of this size available.`);
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
      image: media?.[0]?.url || '',
    };

    // You may use cookies/session/localStorage as required with Next.js
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'checkoutState',
        JSON.stringify({
          orderDetails: productToBuy,
          cartFromCheckout: [],
        })
      );
    }

    setIsModalOpen(false);

    if (!user) {
      router.push('/create-account?redirect=/checkout');
    }

    dispatch(setOrderDetails(productToBuy));
    router.push('/checkout');
  };

  // Wishlist toggle
  const isWishlisted = wishlist.some((item) => item._id === _id);
  const toggleWishlist = async (e) => {
    e.stopPropagation();
    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist(_id)).unwrap();
        toast.success('Removed from Wishlist!');
      } else {
        await dispatch(addToWishlist(product)).unwrap();
        toast.success('Added to Wishlist');
      }
    } catch (error) {
      toast.error(error || 'Wishlist update failed');
    }
  };

  const getSelectedSizeStock = () => {
    const sizeObj = sizes.find((s) => s.size === selectedSize);
    return sizeObj ? sizeObj.stock : 0;
  };

  return (
    <>
      <div
        className="relative w-full max-w-xs mx-auto bg-white border-2 rounded-3xl overflow-hidden h-96 flex flex-col
         transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105"
      >
        {/* Image */}
        <div
          className="relative w-full h-3/5 overflow-hidden rounded-t-2xl cursor-pointer"
          onClick={handleNavigate}
        >
          {/* Replace with Next.js Image for better optimization if needed */}
          <img
            src={
              media?.[0]?.url ||
              'https://placehold.co/300x320/FFD368/333?text=Product+Image'
            }
            alt={productName}
            className="w-full h-full object-contain object-top transition-transform duration-300 ease-in-out hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'https://placehold.co/300x320/FFD368/333?text=Image+Not+Found';
            }}
            loading="lazy"
          />

          {/* Wishlist Button */}
          {user && (
            <button
              className="absolute top-4 right-4 p-2 rounded-full text-gray-700 transition-colors duration-200 ease-in-out hover:text-red-500 hover:scale-110"
              onClick={toggleWishlist}
            >
              <Heart
                size={24}
                strokeWidth={1.5}
                color={isWishlisted ? '#22c55e' : 'gray'}
                fill={isWishlisted ? '#22c55e' : 'white'}
              />
            </button>
          )}

          {/* Out of Stock Label */}
          {isOutOfStock && (
            <div className="absolute top-2 left-3 bg-red-400 text-white text-xs font-bold px-2 py-1 rounded-xl">
              Out of Stock
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-gradient-to-br from-[#E6F4EA] via-[#FDF1F6] to-[#FFFFFF] h-2/5 p-3 flex flex-col justify-between  rounded-b-3xl">
          <div>
            <p className="font-home uppercase text-[12px] text-[#93a87eb7]">
              {category?.name || 'Category'}
            </p>
            <h3
              onClick={handleNavigate}
              className=" font-heading text-[24px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7A9D54] via-[#F472B6] to-[#3ABAB4] truncate cursor-pointer hover:underline"
            >
              {productName}
            </h3>
            <p className="font-body text-sm text-[#93a87eba] truncate">{description}</p>

            {/* Price */}
            <div className="flex gap-3 pt-0">
              <p className="text-md text-[#93A87E]">
                ₹{productDiscountPrice}
              </p>
              {productDiscountPrice !== productPrice && (
                <p className="text-md text-gray-500 line-through">
                  ₹{productPrice}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-0 ">
            <button
              onClick={handleAddToCartClick}
              disabled={isOutOfStock}
              className={`font-home flex-1 py-2 text-xs font-semibold rounded-full transition-all duration-200 ease-in-out hover:scale-105 ${isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>

            <button
              onClick={handleBuyNowClick}
              disabled={isOutOfStock}
              className={`font-heading flex-1 py-2 text-xs font-semibold rounded-full transition-all duration-200 ease-in-out hover:scale-105 ${isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#93A87E] text-white hover:bg-green-700'
              }`}
            >
              {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
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
          <Dialog.Panel className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
            <Dialog.Title className=" font-home text-lg font-bold text-[#35894E]">
              Select Size & Color
            </Dialog.Title>

            {/* Colors */}
            <div>
              <h4 className="font-body text-sm text-gray-600 mb-1">Colors:</h4>
              <div className="flex gap-3">
                {colors?.map((color) => (
                  <button
                    key={color.name}
                    className={`font-heading w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedColor === color.name
                      ? 'border-green-600 scale-110'
                      : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color.name)}
                  >
                    {selectedColor === color.name && (
                      <Check size={16} color="white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="flex flex-wrap gap-2">
              {sizes?.map((size) => (
                <div key={size.size} className="relative inline-block group">
                  <button
                    onClick={() => setSelectedSize(size.size)}
                    disabled={size.stock <= 0}
                    className={`font-heading px-3 rounded-3xl lg:px-4 lg:py-2 lg:rounded-none border text-sm font-medium transition
              ${selectedSize === size.size ? 'bg-[#93A87E] text-white border-[#93A87E]' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}
              ${size.stock <= 0 ? '  x text-gray-400 cursor-not-allowed' : ''}`}
                  >
                    {size.size}
                  </button>

                  {/* Tooltip */}
                  {size.stock <= 0 && (
                    <div className="font-body absolute left-1/2 -top-8 transform -translate-x-1/2 bg-red-500 w-20 text-white text-xs rounded text-centre px-1 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      Out of Stock
                      <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className=" font-body text-sm text-gray-600">Qty:</span>
              <div className="flex items-center border rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 text-lg"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-3">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 text-lg"
                  disabled={!selectedSize || quantity >= getSelectedSizeStock()}
                >
                  +
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                className=" font-heading px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-full"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>

              {modalType === 'cart' ? (
                <button
                  className=" font-heading px-4 py-2 text-sm bg-[#93A87E] text-white rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                  className="px-4 py-2 text-sm bg-[#93A87E] text-white rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed"
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
