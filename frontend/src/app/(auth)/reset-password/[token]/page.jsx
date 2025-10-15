"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = useParams(); // ✅ get token from URL

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!validatePassword(password)) {
      toast.error(
        "Password must have 6+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char"
      );
      return;
    }

    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await axios.post(`${API_URL}/api/auth/reset-password/${token}`, { password });
      toast.success(res.data.message || "Password reset successful!");

      router.push("/signin"); // redirect to sign in page
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col items-center pt-8 px-4 p-3  md:mt-14">
      <div className="bg-white text-gray-500 max-w-96 mx-4 md:p-6 p-4 text-left text-sm rounded shadow-[0px_0px_10px_0px] shadow-black/10">
        <h2 className="text-2xl font-semibold mb-6 text-center text-[#93A87E]">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
            New Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full border mt-1 border-gray-500/30 outline-none rounded py-2.5 px-4 mb-4"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="confirmPassword" className="block mb-1 font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="w-full border mt-1 border-gray-500/30 outline-none rounded py-2.5 px-4 mb-4"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#93A87E] hover:bg-[#93a87eae] text-white font-bold py-2.5 rounded transition active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
