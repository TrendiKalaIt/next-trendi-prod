"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { placeOrder, setOrderDetails } from "../../store/orderSlice";
import { clearCart } from "../../store/cartSlice";
import { clearOrderDetails, clearCartFromCheckout } from "../../store/checkoutSlice";
import { SquareX } from "lucide-react";
import AddressForm from "../../components/AddressForm";
import { IoWalletOutline } from "react-icons/io5";

// Load Razorpay script (client only)
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const AddressSection = ({
  token,
  savedAddresses,
  setSavedAddresses,
  selectedAddress,
  setSelectedAddress,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/addresses/my`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSavedAddresses(res.data.addresses || []);
      } catch {
        toast.error("Failed to fetch saved addresses.");
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, [token, setSavedAddresses]);

  const handleDelete = async (addressId) => {
    if (typeof window !== "undefined") {
      if (!window.confirm("Are you sure you want to delete this address?")) return;
    }
    try {
      setLoading(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/addresses/${addressId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Address deleted successfully");
      const updatedAddresses = savedAddresses.filter(
        (addr) => addr._id !== addressId
      );
      setSavedAddresses(updatedAddresses);
      if (selectedAddress?._id === addressId) {
        setSelectedAddress(null);
      }
    } catch (err) {
      toast.error("Failed to delete address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className=" font-heading text-2xl text-green-600 font-semibold mb-4">Delivery Address</h2>
      {loading ? (
        <p>Loading addresses...</p>
      ) : (
        <>
          <ul className="space-y-2 font-body">
            {savedAddresses.map(
              (addr) =>
                addr && (
                  <li
                    key={addr._id}
                    className={`p-3  border rounded-md cursor-pointer flex justify-between items-start ${
                      selectedAddress && selectedAddress._id === addr._id
                        ? "border-green-600 bg-green-50"
                        : "border-gray-300"
                    }`}
                    onClick={() => setSelectedAddress(addr)}
                  >
                    <div>
                      <div className="font-semibold font-body">{addr.fullName}</div>
                      <div className="font-body">
                        {addr.streetAddress}
                        {addr.apartment ? `, ${addr.apartment}` : ""},{" "}
                        {addr.townCity},{addr.zipcode}
                      </div>
                      <div className="font-body">
                        {addr.phoneNumber} | {addr.emailAddress}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(addr._id);
                      }}
                      className="text-red-500 hover:text-red-700 ml-4 order rounded px-2"
                    >
                      <SquareX />
                    </button>
                  </li>
                )
            )}
          </ul>
          <button
            className="mt-4 font-home text-green-600 hover:underline"
            onClick={() => setShowForm((s) => !s)}
            type="button"
          >
            {showForm ? "Cancel" : "+ Add New Address"}
          </button>
          {showForm && (
            <AddressForm
              token={token}
              setShowForm={setShowForm}
              setSavedAddresses={setSavedAddresses}
              setSelectedAddress={setSelectedAddress}
            />
          )}
        </>
      )}
    </div>
  );
};

const CheckoutSection = ({
  cart,
  subtotal,
  shipping,
  total,
  paymentMethod,
  setPaymentMethod,
  loadingSubmit,
  handlePlaceOrder,
  selectedAddress,
  discountAmount,
}) => (
  <div>
    <h2 className=" font-heading text-2xl text-green-600 font-semibold mb-4">
      Order Summary
    </h2>
    <div className="space-y-6">
      {cart.length === 0 ? (
        <p className="font-body text-gray-500 text-center py-4">
          No items to display.
        </p>
      ) : (
        cart.map((item, index) => (
          <div
            key={item._id || item.id || index}
            className="flex items-center justify-between py-2 border-b border-gray-200"
          >
            <div className="flex items-center">
              <img
                src={item.image || "https://placehold.co/40x40"}
                alt={item.productName}
                className="w-10 h-10 rounded-full mr-4"
              />
              <span className="font-home text-gray-800">
                {item.productName}
              </span>
            </div>
            <span className="text-gray-800 font-medium font-body">
              ₹{(item.quantity || 1) * item.discountPrice}
            </span>
          </div>
        ))
      )}
      {discountAmount > 0 && (
        <div className="flex justify-between text-red-600 font-semibold font-body pt-2">
          <span>Discount</span>
          <span>- ₹{discountAmount.toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between text-gray-700 pt-4">
        <span className="font-body">Subtotal</span>
        <span className="font-semibold font-body">
          ₹{(subtotal - discountAmount).toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span className="font-body">Delivery Charge</span>
        <span className="text-sm text-green-600 font-body">
          ₹{shipping.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between text-lg font-bold text-gray-900 border-t-2 border-gray-200 pt-4">
        <span className="font-home">Total:</span>
        <span className="font-body">₹{total.toFixed(2)}</span>
      </div>
    </div>

    <div className="mt-8 space-y-4">
      <h3 className="font-home text-lg font-semibold text-gray-800 mb-4">
        Payment Method
      </h3>
      {[
        { id: "bank", label: "Bank / UPI / Wallets", icons: [IoWalletOutline] },
        { id: "cashOnDelivery", label: "Cash on Delivery" },
      ].map(({ id, label, icons }) => (
        <div
          key={id}
          className={`flex items-center p-4 rounded-lg border cursor-pointer transition duration-200 ${
            paymentMethod === id
              ? "border-green-500 bg-green-50"
              : "border-gray-300"
          }`}
          onClick={() => setPaymentMethod(id)}
        >
          <input
            type="radio"
            id={id}
            name="paymentMethod"
            value={id}
            checked={paymentMethod === id}
            onChange={() => setPaymentMethod(id)}
          />
          <label
            htmlFor={id}
            className="ml-3 text-gray-700 flex items-center flex-grow"
          >
            {label}
            {icons && (
              <div className="ml-auto flex space-x-2">
                {icons.map((Icon, i) => (
                  <Icon key={i} size={20} className="text-green-600" />
                ))}
              </div>
            )}
          </label>
        </div>
      ))}
    </div>

    <button
      onClick={handlePlaceOrder}
      disabled={loadingSubmit || !selectedAddress}
      className={` font-home mt-8 w-full bg-[#9caf88e0] text-white py-2 rounded-lg font-semibold text-lg shadow-md transition duration-300 ease-in-out ${
        loadingSubmit || !selectedAddress
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-[#9CAF88]"
      }`}
    >
      {loadingSubmit ? "Placing Order..." : "Place Order"}
    </button>
    {!selectedAddress && (
      <p className="text-red-500 mt-2 font-body">
        Please select a delivery address to continue.
      </p>
    )}
  </div>
);

const CheckoutDetails = () => {
  const orderDetails = useSelector((state) => state.checkout.orderDetails);
  const cartFromCheckout = useSelector(
    (state) => state.checkout.cartFromCheckout || []
  );
  const tokenFromStore = useSelector((state) => state.auth.token);
  const tokenFromStorage = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const token = tokenFromStore || (tokenFromStorage && tokenFromStorage !== "null" ? tokenFromStorage : null);

  const dispatch = useDispatch();
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");

  useEffect(() => {
    if (!token) {
      router.push("/create-account?redirect=/checkout");
    } else {
      setCheckingAuth(false);
    }
    // eslint-disable-next-line
  }, [token]);

  if (checkingAuth) {
    return null;
  }

  const cart = orderDetails ? [orderDetails] : cartFromCheckout;

  const subtotal = cart.reduce(
    (sum, p) => sum + (p.quantity || 1) * p.discountPrice,
    0
  );

  const discountAmount = (() => {
    if (!couponData) return 0;
    if (couponData.discount_type === "percentage") {
      return (subtotal * couponData.discount_value) / 100;
    } else if (couponData.discount_type === "flat") {
      return couponData.discount_value;
    }
    return 0;
  })();

  const DELIVERY_CHARGE = 100;
  const shipping = DELIVERY_CHARGE;
  const total = Math.max(0, subtotal - discountAmount) + shipping;
  const finalSelectedAddress = selectedAddress;

  const handlePlaceOrder = async () => {
    if (!finalSelectedAddress) {
      toast.error("Please provide a delivery address.");
      return;
    }

    if (paymentMethod === "bank") {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error(
          "Failed to load Razorpay SDK. Please check your connection."
        );
        return;
      }

      setLoadingSubmit(true);

      try {
        const orderPayload = {
          shippingInfo: finalSelectedAddress,
          paymentMethod,
          items: cart,
          shippingCost: shipping,
          totalAmount: total,
          coupon_code: couponData ? couponCode.trim().toUpperCase() : null,
        };
        const amountInPaisa = Math.round(total * 100);
        const { data: razorpayOrder } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-order`,
          { amount: amountInPaisa },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!razorpayOrder?.id) {
          toast.error("Failed to initiate payment. Please try again.");
          setLoadingSubmit(false);
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "TrendiKala",
          description: "Order Payment",
          order_id: razorpayOrder.id,
          handler: async function (response) {
            try {
              const paymentResult = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/payment/verify-payment`,
                {
                  razorpay_order_id: razorpayOrder.id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderPayload,
                },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (paymentResult.data.success) {
                toast.success("Payment successful and order placed!");
                dispatch(setOrderDetails(paymentResult.data.order));
                dispatch(clearCart());
                dispatch(clearCartFromCheckout());
                router.push("/thankyou");
              } else {
                toast.error("Payment verification failed.");
              }
            } catch (err) {
              toast.error("Payment failed verification.");
            }
            setLoadingSubmit(false);
          },
          modal: {
            ondismiss: function () {
              toast.error("Payment cancelled.");
              setLoadingSubmit(false);
            },
          },
          theme: { color: "#9CAF88" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        toast.error("Payment failed. Please try again.");
        setLoadingSubmit(false);
      }
    } else {
      if (!finalSelectedAddress) {
        toast.error("Please provide a delivery address.");
        return;
      }

      const orderPayload = {
        shippingInfo: finalSelectedAddress,
        paymentMethod,
        items: cart,
        shippingCost: shipping,
        totalAmount: total,
        coupon_code: couponData ? couponCode.trim().toUpperCase() : null,
      };

      setLoadingSubmit(true);
      try {
        const result = await dispatch(placeOrder({ orderPayload, token }));

        if (placeOrder.fulfilled.match(result)) {
          toast.success("Order placed successfully!");
          if (orderDetails) {
            dispatch(clearOrderDetails());
          } else {
            dispatch(clearCart());
            dispatch(clearCartFromCheckout());
          }
          router.push("/thankyou");
        } else {
          toast.error(result.payload || "Order failed");
        }
      } catch (err) {
        toast.error("Something went wrong during order submission.");
      } finally {
        setLoadingSubmit(false);
      }
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage("Please enter a coupon code.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/coupons/apply`,
        { coupon_code: couponCode.trim().toUpperCase() },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setCouponData(response.data.coupon);
        setCouponMessage("Coupon applied successfully!");
        toast.success("Coupon applied");
      } else {
        setCouponMessage(response.data.message);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Invalid coupon or server error.";
      setCouponMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex items-center justify-center lg:mx-28">
      <div className="w-full bg-white p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <AddressSection
            token={token}
            savedAddresses={savedAddresses}
            setSavedAddresses={setSavedAddresses}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
          />
        </div>
        <div className="flex-1 lg:pl-12 ">
          <div className="py-6">
            <h2 className="text-xl font-semibold font-heading mb-2 text-green-600">
              Apply Coupon
            </h2>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="border border-gray-300 rounded px-4 py-2 w-full"
                disabled={!!couponData}
              />
              {!couponData && (
                <button
                  onClick={handleApplyCoupon}
                  className="bg-green-600 text-white px-4 py-2 rounded font-home hover:bg-green-700"
                >
                  Apply
                </button>
              )}
              {couponData && (
                <button
                  onClick={() => {
                    setCouponData(null);
                    setCouponCode("");
                    setCouponMessage("");
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded font-home hover:bg-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          <CheckoutSection
            cart={cart}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            loadingSubmit={loadingSubmit}
            handlePlaceOrder={handlePlaceOrder}
            selectedAddress={finalSelectedAddress}
            discountAmount={discountAmount}
          />
        </div>
      </div>
    </div>
  );
};
export default CheckoutDetails;
