'use client';

import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Clock, Send, User, MessageSquare } from 'lucide-react';
import { SiFacebook, SiInstagram, SiYoutube } from 'react-icons/si';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact`,
        formData
      );
      toast.success(res.data.message || 'Message sent successfully');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Error:', err);
      toast.error(err.response?.data?.message || 'Failed to send message');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 md:mt-10 px-4 lg:px-8 pb-2">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-4xl font-extrabold text-[#9CAF88] text-center py-8">
          Get in Touch
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white shadow-md rounded-xl ">
          {/* Contact Form */}
          <div className="p-8">
            <h2 className="font-home text-2xl font-bold text-[#9CAF88] mb-6">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                  className="font-body block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-green-500 sm:text-sm"
                />
              </div>

              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@gmail.com"
                  className="font-body block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-green-500 sm:text-sm"
                />
              </div>

              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-2 self-start">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Your message..."
                  className="font-body block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-green-500 sm:text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                className="font-home inline-flex justify-center items-center rounded-md border border-transparent bg-[#93A87E] hover:bg-[#93a87ec6] px-6 py-3 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="p-8">
            <h2 className="font-home text-2xl font-bold text-[#9CAF88] mb-6">
              Contact Information
            </h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Mail className="h-6 w-6 text-[#9CAF88]" />
                <div>
                  <h3 className="font-body text-lg font-medium text-gray-900">Email Us</h3>
                  <p className="text-gray-600">
                    <a
                      href="mailto:trendikalait@gmail.com"
                      className="font-body hover:text-[#9CAF88]"
                    >
                      trendikalait@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-6 w-6 text-[#9CAF88]" />
                <div>
                  <h3 className="font-body text-lg font-medium text-gray-900">Call Us</h3>
                  <p className="font-body text-gray-600">
                    <a href="tel:9220440585" className="hover:text-[#9CAF88]">
                      +91 9220440585
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-6 w-6 text-[#9CAF88] mt-1" />
                <div>
                  <h3 className="font-body text-lg font-medium text-gray-900">Our Location</h3>
                  <p className="font-body text-gray-600">
                    Shop No. 225, Panchsheel Square Mall,
                    <br />
                    Crossing Republik, Ghaziabad,
                    <br />
                    Uttar Pradesh - 201016
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-[#9CAF88]" />
                <div>
                  <h3 className="font-body text-lg font-medium text-gray-900">Business Hours</h3>
                  <p className="font-body text-gray-600">9:00 AM - 9:00 PM</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-body text-lg font-medium text-gray-900 mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/share/14JLn8svZCB/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  <SiFacebook className="h-7 w-7" />
                </a>
                <a
                  href="https://www.instagram.com/trendikalaofficial?igsh=MXdidTA0YmY2Ymd3YQ%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400"
                >
                  <SiInstagram className="h-7 w-7" />
                </a>
                <a
                  href="https://www.youtube.com/@trendikala"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600"
                >
                  <SiYoutube className="h-7 w-7" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
