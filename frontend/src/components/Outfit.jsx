// components/Outfit.jsx
import React, { useState, useEffect, useRef, memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import ReelsMsg from "./ReelsMsg";

const Outfit = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReel, setSelectedReel] = useState(null);
  const [showReels, setShowReels] = useState(false);
  const reelsRef = useRef(null);

  const sideImages = [
    { id: 1, url: "/cro1.webp" },
    { id: 2, url: "/cro2.webp" },
    { id: 3, url: "/cro3.webp" },
  ];

  const reels = [
    { id: 7, url: "/dress7.mp4" },
    { id: 8, url: "/dress8.mp4" },
    { id: 9, url: "/dress9.mp4" },
    { id: 10, url: "/dress10.mp4" },
    { id: 1, url: "/dress1.mp4" },
    { id: 3, url: "/dress3.mp4" },
    { id: 4, url: "/dress4.mp4" },
    { id: 5, url: "/dress5.mp4" },
    { id: 2, url: "/dress2.mp4" },
    { id: 6, url: "/dress6.mp4" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowReels(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (reelsRef.current) observer.observe(reelsRef.current);

    return () => {
      if (reelsRef.current) observer.unobserve(reelsRef.current);
    };
  }, []);

  const openModal = (reel) => {
    setSelectedReel(reel);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReel(null);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full mx-auto p-4">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 justify-between lg:gap-4 mb-6 gap-y-2">
        {/* Main Poster */}
        <div className="col-span-2 h-[250px] md:h-[350px] rounded-2xl overflow-hidden relative bg-[#cff1b9]">
          <picture className="w-full h-full">
            {/* Desktop version */}
            <source media="(min-width:768px)" srcSet="/desktop-offer-banner.webp" />
            {/* Mobile version (fallback) */}
            <img
              src="/mobile-offer-banner.webp"
              alt="Offer banner"
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </picture>
        </div>

        {/* Side Carousel */}
        <div className="h-[350px] w-full flex justify-center">
          <Swiper
            direction="horizontal"
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 2000 }}
            loop
            navigation={false}
            className="h-full rounded-2xl w-[300px]"
          >
            {sideImages.map((img) => (
              <SwiperSlide key={img.id}>
                <img
                  src={img.url}
                  alt={`Side ${img.id}`}
                  className="w-full lg:w-[300px] h-full object-top bg-blue-50 rounded-2xl object-cover"
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* --- Reels Section --- */}
      <div className="mt-6" ref={reelsRef}>
        <h3 className="font-home text-[#9CAF88] uppercase text-lg font-semibold mb-2">
          Reels for you
        </h3>
        <div className="mb-2">
          <ReelsMsg />
        </div>

        {showReels ? (
          <Swiper
            slidesPerView="auto"
            spaceBetween={16}
            modules={[Autoplay]}
            autoplay={{ delay: 2500 }}
            loop
            className="pb-2"
          >
            {reels.map((reel) => (
              <SwiperSlide
                key={reel.id}
                className="!w-[328px] md:!w-[180px] h-[240px] rounded-2xl overflow-hidden shadow relative cursor-pointer"
                onClick={() => openModal(reel)}
              >
                <video
                  src={reel.url}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="flex gap-4 overflow-hidden pb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="!w-[328px] md:!w-[180px] h-[240px] rounded-2xl bg-gray-300 animate-pulse"
              />
            ))}
          </div>
        )}
      </div>

      {/* --- Modal --- */}
      {isModalOpen && selectedReel && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="relative w-full h-full aspect-video overflow-hidden">
            <video
              src={selectedReel.url}
              className="w-full h-full md:object-contain bg-black"
              autoPlay
              controls
              loop
              playsInline
            />
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 bg-white bg-opacity-35 rounded px-3 md:py-1 text-white font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Outfit);
