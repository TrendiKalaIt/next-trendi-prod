'use client';

import { Gift } from 'lucide-react';

const NewUpdatesMsg = () => {
  return (
    <div className="bg-gray-100 flex items-center justify-center font-sans text-gray-800 overflow-hidden">
      <div className="w-full">
        <div className="relative text-[#8d9f79] p-2 flex items-center blinking-background">
          <div className="updates-marquee-container">
            <div className="updates-marquee-content md:text-base tracking-wide flex items-center gap-8">
              <span className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#fcd34d]" />
                “Exclusive Offer: Complimentary gifts with the first 100 orders.”
              </span>
              <span className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#fcd34d]" />
                “Exclusive Offer: Complimentary gifts with the first 100 orders.”
              </span>
              <span className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#fcd34d]" />
                “Exclusive Offer: Complimentary gifts with the first 100 orders.”
              </span>
              <span className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#fcd34d]" />
                “Exclusive Offer: Complimentary gifts with the first 100 orders.”
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Background blinking animation */
        @keyframes blink-bg {
          0% { background-color: #f3f4f6; }
          50% { background-color: #fcd34d; }
          100% { background-color: #f3f4f6; }
        }

        .blinking-background {
          animation: blink-bg 1s infinite;
        }

        .updates-marquee-container {
          display: flex;
          overflow: hidden;
          position: relative;
        }

        .updates-marquee-content {
          display: flex;
          white-space: nowrap;
          animation: marquee-scroll 20s linear infinite;
          will-change: transform;
        }

        .updates-marquee-container:hover .updates-marquee-content {
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

export default NewUpdatesMsg;
