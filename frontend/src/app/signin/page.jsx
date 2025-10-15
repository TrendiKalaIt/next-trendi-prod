"use client";

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { login } from '../../store/authSlice';
import { showLoader, hideLoader } from '@/store/loaderSlice';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // ✅ local loading state
    const router = useRouter();
    const dispatch = useDispatch();

    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || '/';

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error("Enter a valid email");
            return;
        }

        if (!password.trim()) {
            toast.error("Password is required");
            return;
        }

        try {
            setLoading(true);           // ✅ start button loading
            dispatch(showLoader());

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                email,
                password,
            });

            const userData = {
                id: response.data.user.id,
                name: response.data.user.name,
                email: response.data.user.email,
                profileImage: response.data.user.profileImage || null,
                token: response.data.token,
            };

            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', response.data.token);
            dispatch(login(userData));
            toast.success('Login successful');

            router.push(redirectPath);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            console.error('Login error:', error);
        } finally {
            setLoading(false);          // ✅ stop button loading
            dispatch(hideLoader());
        }
    };

    return (
        <div className="h-full bg-gray-50 flex flex-col items-center pt-8 px-4 mb-2 mt-10">
            <div className="w-full max-w-xl bg-white p-4 md:p-10 rounded-lg shadow-sm">
                <div className='flex justify-between'>
                    <h2 className="font-heading text-2xl pt-2 font-semibold text-[#93A87E] mb-6 border-b-2 border-[#93A87E] pb-2">
                        SIGN IN
                    </h2>
                    <a href="/">
                        <img
                            src="trendikala_logo_bg.webp"
                            className="w-24 object-cover"
                            alt="Trendikala logo"
                        />
                    </a>
                </div>

                <form onSubmit={handleLogin}>
                    {/* Email */}
                    <div className="mb-4">
                        <label htmlFor="email" className="font-home block text-[#35894E] text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="font-body w-full border-2 border-[#35894e75] rounded py-2 px-3"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-6 relative">
                        <label htmlFor="password" className="font-home block text-[#35894E] text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="font-body w-full border-2 border-[#35894e75] rounded py-2 px-3 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-gray-500"
                            tabIndex={-1}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Forgot Password link */}
                    <div className="mb-2 text-right">
                        <button
                            type="button"
                            onClick={() => router.push('/forgot-password')}
                            className="font-body text-sm text-[#35894E] hover:underline"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className={`font-home w-full bg-[#93A87E] hover:bg-[#93a87eae] text-white font-bold py-2 px-6 rounded-full transition ${loading ? 'cursor-not-allowed opacity-70' : ''
                            }`}
                        disabled={loading}  // ✅ disable button while signing in
                    >
                        {loading ? 'Signing in...' : 'SIGN IN'}  {/* ✅ dynamic button text */}
                    </button>
                </form>

                {/* Signup Link */}
                <div className="mt-8 text-center">
                    <p className="font-home text-[#35894E] mb-4">Don't have an account?</p>
                    <button
                        type="button"
                        className="font-home w-full border border-[#35894E] text-[#35894E] font-bold py-2 px-6 rounded-full hover:bg-green-50 transition"
                        onClick={() => router.push(`/create-account?redirect=${encodeURIComponent(redirectPath)}`)}
                        disabled={loading}  // ✅ disable during login
                    >
                        CREATE ACCOUNT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
