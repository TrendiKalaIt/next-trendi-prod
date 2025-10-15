"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async () => {
    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      toast.success(res.data.message || "Reset link sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col items-center pt-8 px-4 p-10 mb-2 md:mt-14">
      <div className="bg-white text-gray-500 max-w-96 mx-4 md:p-6 p-4 text-left text-sm rounded shadow-[0px_0px_10px_0px] shadow-black/10">
        <h2 className="text-2xl font-semibold mb-6 text-center text-[#93A87E]">Forget Password?</h2>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="w-full border mt-1 border-gray-500/30 outline-none rounded py-2.5 px-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <button
          type="button"
          className="w-full my-3 bg-[#93A87E] active:scale-95 transition py-2.5 rounded text-white"
          onClick={handleSendEmail}
          disabled={!email || loading}
        >
          {loading ? "Sending..." : "Send Email"}
        </button>

        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <Link href="/create-account" className="text-[#35894E] hover:underline">
            Signup Now
          </Link>
        </p>
      </div>
    </div>
  );
}
