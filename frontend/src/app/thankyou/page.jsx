"use client";
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

import { clearOrder, selectPlacedOrder } from '../../store/orderSlice'; 

const Thankyou = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const orderDetails = useSelector(selectPlacedOrder);

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-base font-semibold text-gray-700">Loading your order details...</p>
      </div>
    );
  }

  // Calculates subtotal of items
  const calculateSubtotal = (items) =>
    items?.reduce((acc, item) => acc + item.discountPrice * item.quantity, 0) || 0;

  // Calculate subtotal as number
  const subtotal = calculateSubtotal(orderDetails?.items);

  // Calculate discount dynamically
  const discountAmount =
    subtotal + (orderDetails.shippingCost || 0) - (orderDetails.totalAmount || 0);

  // Handles the "Back to Shopping" button click
  const handleBackToShopping = () => {
    dispatch(clearOrder());
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-inter">
      <div className="w-full max-w-4xl bg-white shadow-xl p-4 sm:p-6 md:p-4">
        <div className="bg-gradient-to-r rounded-xl from-[#D4F387] to-[#A8E6CF] text-green-900 p-2 sm:p-6 flex flex-col items-center text-center mb-6 shadow-lg">
          <div className="flex lg:flex-row flex-col items-center mb-3">
            <h2 className="font-heading text-lg sm:text-2xl lg:text-3xl font-bold lg:font-extrabold mr-2 leading-tight">
              {orderDetails?.shippingInfo?.fullName}, Thank You for Your Order!
            </h2>
            <CheckCircle className="lg:w-8 lg:h-8 h-6 w-8 mt-1 text-green-700 animate-bounce" />
          </div>
          <p className="font-body text-gray-700 text-sm sm:text-base max-w-prose">
            We appreciate your order! It's now being packed, and you'll receive tracking information via email shortly at{' '}
            <span className="font-heading font-semibold">{orderDetails?.shippingInfo?.emailAddress}</span>.
          </p>
        </div>
        
        {/* Order Details Table */}
        <div className="p-3">
          <h3 className="font-heading text-lg sm:text-xl font-bold text-gray-800 text-center">Order Summary</h3>
          <div className="flex justify-between border-b border-gray-300 pb-2 mb-3">
            <span className="font-home font-semibold text-gray-700 text-base sm:text-lg">Item</span>
            <span className="font-home font-semibold text-gray-700 text-base sm:text-lg">Total</span>
          </div>
          {orderDetails?.items?.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-14 h-16 rounded mr-3 object-cover shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/60x60/cccccc/333333?text=N/A';
                  }}
                />
                <div>
                  <p className="font-home text-gray-800 font-bold text-base sm:text-lg">{item.productName}</p>
                  <p className="font-body text-gray-500 font-semibold text-sm">QTY: {item.quantity}</p>
                  <p className="font-body text-gray-500 font-semibold text-sm">
                    Color: {item.color} | Size: {item.size}
                  </p>
                </div>
              </div>
              <span className="text-gray-800 font-medium text-sm sm:text-base">
                ₹{(item.discountPrice * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        
        {/* Delivery and Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-2">
          {/* Delivery Address */}
          <div>
            <p className="font-heading text-gray-700 font-bold mb-2 text-base sm:text-lg">Delivery Address</p>
            <p className="text-gray-800 text-sm sm:text-base">
              <span className="font-body font-semibold">{orderDetails?.shippingInfo?.fullName}</span>
              <br />
              {orderDetails?.shippingInfo?.streetAddress}, {orderDetails?.shippingInfo?.apartment}
              <br />
              {orderDetails?.shippingInfo?.townCity}
              <br />
              Phone: {orderDetails?.shippingInfo?.phoneNumber}
            </p>
          </div>
          {/* Subtotals and Total */}
          <div className="space-y-2 text-right">
            <div className="flex justify-between text-gray-700 text-sm sm:text-base">
              <span className="font-body">Subtotal:</span>
              <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>
            {/* Discount block */}
            {discountAmount > 0 && (
              <div className="flex justify-between text-red-600 text-sm sm:text-base">
                <span className="font-body">Discount:</span>
                <span className="font-semibold">- ₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-700 text-sm sm:text-base">
              <span className="font-body">Shipping:</span>
              <span className="font-semibold">₹{orderDetails.shippingCost?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900 border-t border-gray-200 pt-2">
              <span className="font-body">Total:</span>
              <span>₹{orderDetails.totalAmount?.toFixed(2)}</span>
            </div>
            {/* Payment Method */}
            <div className="text-left">
              <p className="font-body text-gray-700 font-bold my-1 text-base sm:text-lg">
                Payment Method :{' '}
                <span className="font-body font-normal ">
                  {orderDetails.paymentMethod === 'cashOnDelivery' ? 'Cash on Delivery' : 'Bank Transfer'}
                </span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Back to Shopping Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleBackToShopping}
            className="font-heading bg-green-600 text-white py-2 px-6 rounded-full font-semibold text-base shadow-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
          >
            Back to Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Thankyou;
