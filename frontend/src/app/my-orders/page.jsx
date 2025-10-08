"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "@/store/orderSlice";
import { selectCurrentUser } from "@/store/authSlice";
import { Shirt } from "lucide-react";

const MyOrdersPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const { myOrders: orders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    if (user?.token) {
      dispatch(fetchMyOrders(user.token));
    }
  }, [dispatch, user]);

  return (
    <div className="md:p-10 p-4 space-y-6 max-w-5xl mx-auto md:mt-14">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-heading text-green-500 font-semibold mb-6">
            My Orders
          </h2>
        </div>
        <div>
          <Link href="/enquiry-us">
            <div className="font-home bg-red-400 text-white border p-1 px-2 rounded hover:shadow-lg hover:bg-red-600 cursor-pointer">
              Cancel Order
            </div>
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="font-body">Loading...</p>
      ) : orders?.length === 0 ? (
        <p className="font-body">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.orderId}
            className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-5 p-6 rounded-md border border-green-300 bg-white text-gray-800 shadow-sm"
          >
            {/* Products */}
            <div className="flex flex-col gap-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <div>
                    <p className="font-medium font-body text-green-500">
                      {item.productName}
                      {item.quantity > 1 && (
                        <span className="text-gray-400 font-body">
                          {" "}
                          x {item.quantity}
                        </span>
                      )}
                    </p>
                    <p className="text-sm font-body text-gray-500">
                      ({item.color}, {item.size})
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Info */}
            <div className="text-sm">
              <p className="font-medium mb-1 font-body text-green-500">
                {order.shippingInfo.fullName}
              </p>
              <p className="font-body">
                {order.shippingInfo.streetAddress}
                {order.shippingInfo.apartment &&
                  `, ${order.shippingInfo.apartment}`}
                , {order.shippingInfo.townCity}
              </p>
              <p>{order.shippingInfo.phoneNumber}</p>
            </div>

            {/* Total Amount */}
            <p className="font-semibold font-body text-lg text-green-500">
              ₹{order.totalAmount}
            </p>

            {/* Payment Info */}
            <div className="flex flex-col text-sm">
              <p className="font-body">
                <span className="font-medium font-body text-green-500">
                  Method:
                </span>{" "}
                {order.paymentMethod === "cashOnDelivery"
                  ? "Cash on Delivery"
                  : order.paymentMethod}
              </p>
              <p className="font-body">
                <span className="font-medium font-body text-green-500">
                  Date:
                </span>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium font-body text-green-500">
                  Status:
                </span>{" "}
                <span className="text-gray-400 font-body font-semibold">
                  {order.paymentStatus}
                </span>
              </p>
              <p>
                <span className="font-medium font-body text-green-500">
                  Delivery Status:
                </span>{" "}
                <span className="text-gray-400 font-semibold">
                  {order.orderStatus}
                </span>
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrdersPage;
