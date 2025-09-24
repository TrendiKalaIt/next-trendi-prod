// components/Spinner.jsx
import React from 'react';

const Spinner = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div>
        <img
          src="/trendikala_logo_bg.webp"
          className="h-24 animate-pulse"
          alt="Trendikala Logo"
          loading="lazy"
        />
      </div>
      <div className="w-10 h-10 border-[5px] border-green-500 border-dashed rounded-full animate-spin duration-[5000ms]"></div>
      <p className="animate-pulse">loading...</p>
    </div>
  );
};

export default Spinner;
