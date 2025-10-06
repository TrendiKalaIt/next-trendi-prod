"use client";
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from "next/navigation";

import {
  fetchCart,
  removeFromCart,
  updateQuantity,
} from '../../store/cartSlice';
import {
  setOrderDetails,
  clearOrderDetails,
  setCartFromCheckout,
} from '../../store/checkoutSlice';

function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { items: products, status, error } = useSelector(state => state.cart);
  const [shippingOption, setShippingOption] = useState('free');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCart());
    }
  }, [dispatch, status]);

  const changeQuantity = async (id, diff) => {
    const product = products.find(p => p._id === id || p.id === id);
    if (!product) return;

    const newQty = product.quantity + diff;
    if (newQty < 1) {
      toast('Quantity cannot be less than 1');
      return;
    }

    try {
      await dispatch(updateQuantity({ id, quantity: newQty })).unwrap();
      toast.success(
        `${diff > 0 ? 'Increased' : 'Decreased'} quantity of "${product.productName || product.name}"`
      );
    } catch (err) {
      toast.error(`Failed to update quantity: ${err}`);
    }
  };

  const handleRemove = async (id) => {
    const product = products.find(p => p._id === id || p.id === id);
    if (!product) return;
    try {
      await dispatch(removeFromCart(id)).unwrap();
      toast.success(`Removed "${product.productName || product.name}" from cart`);
    } catch (err) {
      toast.error(`Failed to remove item: ${err}`);
    }
  };

  const subtotal = products.reduce((sum, p) => sum + p.discountPrice * p.quantity, 0);

  const DELIVERY_CHARGE = 100; // Fixed delivery charge in rupees
  const deliveryCharge = DELIVERY_CHARGE;
  const shippingCost = deliveryCharge;
  const total = subtotal + shippingCost;

  const ShippingRadio = ({ value, label, displayPrice }) => (
    <label
      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200
        ${value === 'deliveryCharge' ? 'border-green-600 bg-green-100' : 'border-gray-200'}`}
    >
      <div className="flex items-center">
        <input
          type="radio"
          name="shipping"
          value={value}
          checked={value === 'deliveryCharge'}
          onChange={() => {}}
          className="form-radio accent-green-600 h-5 w-5"
        />
        <span className="ml-3 text-gray-700 text-lg">{label}</span>
      </div>
      <span className="font-medium text-gray-700 text-lg">{displayPrice}</span>
    </label>
  );

  if (status === 'loading') {
    return <p className="text-center mt-8 text-gray-500 text-lg">Loading cart...</p>;
  }

  if (status === 'failed') {
    return <p className="text-center mt-8 text-red-500 text-lg">Error: {error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 md:mt-12 ">
      <div className="flex justify-center items-center mb-12 space-x-8 ">
        {['Shopping cart', 'Checkout details', 'Order complete'].map((step, i) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center font-bold
              ${i === 0 ? 'bg-green-700 text-white' : 'border-2 border-gray-400 text-gray-400'} text-xl`}
            >
              {i + 1}
            </div>
            <span
              className={`mt-2 ${i === 0 ? ' text-green-700  font-medium border-b-2 border-green-700 pb-1 ' : 'text-gray-400'
                } font-home lg:text-3xl`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          {products.length === 0 ? (
            <p className="font-home text-gray-500 text-center text-3xl">Your cart is empty.</p>
          ) : (
            <>
              <div className=" hidden md:grid grid-cols-4 gap-4 pb-4 border-b border-gray-200 font-medium text-gray-500 text-lg">
                <div className="font-heading col-span-2">Product</div>
                <div className='font-heading'>Quantity</div>
                <div className='font-heading'>Price</div>
              </div>

              {products.map(product => (
                <div
                  key={product._id || product.id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 py-6 border-b border-gray-100"
                >
                  <div className="md:col-span-2 flex items-start sm:items-center gap-4">
                    <img
                      src={
                        product.image
                          ? product.image
                          : product.thumbnail && product.thumbnail.trim() !== ''
                            ? product.thumbnail
                            : product.media && product.media.length > 0
                              ? product.media[0].url
                              : 'https://placehold.co/100x100'
                      }
                      alt={product.productName || product.name}
                      className="w-24 h-24 object-cover rounded-lg shrink-0"
                    />

                    <div>
                      <h3 className="font-heading font-semibold text-green-600 text-lg">{product.productName || product.name}</h3>
                      <p className="font-body text-base text-gray-500">Color: {product.color || 'N/A'}</p>
                      <p className="font-body text-base text-gray-500">Size: {product.size || 'N/A'}</p>
                      <button
                        onClick={() => handleRemove(product._id || product.id)}
                        className="text-red-500 text-base mt-2 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center sm:justify-start">
                    <button
                      onClick={() => changeQuantity(product._id || product.id, -1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 border rounded-l-md text-lg"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border-y text-lg">{product.quantity}</span>
                    <button
                      onClick={() => changeQuantity(product._id || product.id, 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 border rounded-r-md text-lg"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex flex-col justify-center gap-1">
                    <div className="font-semibold flex text-gray-800 text-base md:text-lg">
                      ₹{(product.quantity * product.discountPrice).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="w-full lg:w-96 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="font-heading text-2xl font-semibold text-gray-800 mb-4">Cart summary</h2>
          <div className="space-y-4"></div>

          <div className="border-t border-gray-200 mt-6 pt-4 space-y-3">
            <div className="font-home flex justify-between text-gray-700 text-lg">
              <span>Subtotal</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            {subtotal > 0 && (
              <div className="font-body flex justify-between text-gray-700 text-sm">
                <span>Delivery Charge</span>
                <span className="font-medium">₹{deliveryCharge.toFixed(2)}</span>
              </div>
            )}
            <div className="font-home flex justify-between text-xl text-gray-800">
              <span>Total</span>
              <span>
                ₹{subtotal > 0 ? total.toFixed(2) : 0}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (products.length === 0) {
                toast('Your cart is empty. Please add items before checking out.');
                return;
              }
              dispatch(clearOrderDetails());
              dispatch(setCartFromCheckout(products));
              toast.success('Proceeding to checkout...');
              setTimeout(() => router.push('/checkout'), 1000);
            }}
            className=" font-heading w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mt-6 transition-colors duration-200 text-lg"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
