// components/NewArrivals.jsx
import React, { useState, useEffect, memo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const NewArrivals = () => {
  const newArrivalsItems = [
    {
      imageUrl: '/trendi-kala-discount-banner.jpg',
      discount: '',
      description: '',
      bgColor: '#E8E0D7',
      objectFit: 'contain',
    },
    {
      imageUrl: '/trendi-kala-discount-banner-2.jpg',
      discount: '',
      description: '',
      bgColor: '#E8E0D7',
      objectFit: 'contain',
    },
  ];

  const [idx, setIdx] = useState(0);
  const intervalRef = useRef(null);

  const startAutoScroll = () => {
    intervalRef.current = setInterval(() => {
      setIdx((prevIdx) => (prevIdx + 1) % newArrivalsItems.length);
    }, 5000);
  };

  useEffect(() => {
    startAutoScroll();
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleNext = () => {
    setIdx((i) => (i + 1) % newArrivalsItems.length);
    resetAutoScroll();
  };

  const handlePrev = () => {
    setIdx((i) => (i - 1 + newArrivalsItems.length) % newArrivalsItems.length);
    resetAutoScroll();
  };

  const resetAutoScroll = () => {
    clearInterval(intervalRef.current);
    startAutoScroll();
  };

  const current = newArrivalsItems[idx];

  return (
    <section className="relative w-full mx-auto p-4">
      <div
        className="relative w-full md:h-96 lg:rounded-2xl rounded-md overflow-hidden shadow-lg lg:aspect-[2/1] aspect-[3/1]"
        style={{ backgroundColor: current.bgColor }}
      >
        <img
          src={current.imageUrl}
          alt={`Collection ${idx + 1}`}
          className="absolute w-full h-full"
          loading="lazy"
        />

        {/* Desktop Text */}
        <div className="absolute bottom-2 md:bottom-6 left-6 text-white max-w-md">
          <h2 className="font-home text-2xl sm:text-5xl font-bold drop-shadow hidden md:block">
            {current.discount}
          </h2>
          <p className="font-body text-base sm:text-lg mb-4 drop-shadow hidden md:block">
            {current.description}
          </p>
          <Link href="/all-products">
            <button className="font-heading hidden md:block bg-[#9CAF88] text-white p-3 rounded-full text-sm font-semibold">
              VIEW COLLECTIONS
            </button>
          </Link>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow transition-opacity duration-300 z-1 focus:outline-none opacity-10 md:opacity-100"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow transition-opacity duration-300 z-1 focus:outline-none opacity-10 md:opacity-100"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile Button */}
      <Link href="/all-products">
        <button className="font-body block sm:hidden mt-2 bg-[#9CAF88] text-white px-2 rounded-full text-sm">
          COLLECTIONS
        </button>
      </Link>
    </section>
  );
};

export default memo(NewArrivals);
