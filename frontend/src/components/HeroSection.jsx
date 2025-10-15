"use client";
import React, { memo } from "react";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push("/categories"); 
  };

  return (
    <section className="relative text-gray-800 overflow-hidden">
      {/* Background image */}
      <img
        src="/OutfitImg1.webp"
        alt="Outfit Background"
        loading="eager"
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      <div className="bg-black/10">
        <div className="flex flex-col md:flex-row overflow-hidden">
          {/* Left Side */}
          <div className="w-full md:w-1/2 flex flex-col h-full lg:ms-7">
            <div className="relative h-full flex justify-center md:justify-end xl:pe-20">
              <img
                src="/images/women/Anarkali/AFSANA (2).png"
                alt="madubala"
                className="rounded-b-full object-cover object-bottom md:h-[340px] w-[250px] sm:w-[300px] hidden md:block"
                loading="eager"
                decoding="async"
              />
            </div>

            {/* Desktop Text */}
            <div className="hidden md:flex h-full w-3/4 p-4 md:p-8 flex-col text-right ml-auto">
              <p className="font-home leading-[1.4] text-lg font-bold text-[#ffffffde] mb-6 text-justify tracking-[1px]">
                Trendi Kala brings you elegant ethnic fashion that blends
                tradition with trend, offering timeless pieces designed for the
                bold, modern Indian.
              </p>
              <button
                onClick={handleViewDetails}
                className="font-heading bg-[#9CAF88] hover:bg-[#93a87ec6] text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 m-auto"
              >
                View Details
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full md:w-1/2 flex flex-col">
            {/* Fixed Desktop Text */}
            <div className="hidden md:flex flex-col h-[250px] w-full justify-center items-center text-center mb-2">
              <h1 className="font-heading uppercase text-3xl w-2/3 font-semibold leading-tight mt-20 md:mt-5 text-[#ffffffde]">
                Treditional Elegancee
              </h1>
            </div>

            {/* Static Image */}
            <div className="w-full h-auto md:h-[340px] flex justify-center items-center lg:p-4 pb-2 md:p-8">
              <div className="relative w-screen md:max-w-[300px] mx-auto min-h-[340px] overflow-hidden">
                <img
                  src="/madhubala (6).webp"
                  alt="Static Right"
                  className="relative w-full h-auto object-cover rounded-b-full md:rounded-b-none md:rounded-t-full opacity-100"
                  style={{ aspectRatio: "3/4" }}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
            </div>

            {/* Mobile Text */}
            <div className="flex flex-col items-center text-center pb-6 md:hidden">
              <h2 className="text-[22px] font-heading font-bold text-[#ffffffde] mb-2 uppercase">
                Treditional Elegancee
              </h2>
              <button
                onClick={handleViewDetails}
                className="bg-[#93A87E] hover:bg-[#93a87ec6] font-heading text-white font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Prevent unnecessary re-render
export default memo(HeroSection);
