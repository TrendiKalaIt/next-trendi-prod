// components/ReelsMsg.jsx
import React from "react";

const ReelsMsg = () => {
  return (
    <div className="bg-gray-100 flex items-center justify-center font-sans text-gray-800 overflow-hidden">
      <div className="w-full">
        <div className="relative text-[#8d9f79] p-2 flex items-center">
          <div className="marquee-container">
            <div className="marquee-content md:text-base tracking-wide flex items-center gap-8">
              <span>
                Not just new outfits — we also customise and recycle your old
                favourites fits into Pinterest-worthy looks. DM us on Instagram
                to create yours 💌
              </span>
              <span>
                Not just new outfits — we also customise and recycle your old
                favourites fits into Pinterest-worthy looks. DM us on Instagram
                to create yours 💌
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          display: flex;
          overflow: hidden;
          position: relative;
        }

        .marquee-content {
          display: flex;
          white-space: nowrap;
          animation: marquee-scroll 20s linear infinite;
          will-change: transform;
        }

        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
          cursor: pointer;
        }

        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default ReelsMsg;
