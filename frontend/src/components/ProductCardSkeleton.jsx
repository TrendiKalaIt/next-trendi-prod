// components/ProductCardSkeleton.jsx
import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <div
      className="relative w-full max-w-xs mx-auto bg-white border border-gray-200 rounded-3xl shadow-md overflow-hidden
                 h-96 flex flex-col animate-pulse transition-all duration-300 ease-in-out"
    >
      {/* Image Skeleton */}
      <div className="w-full h-3/5 bg-gray-300 rounded-t-2xl" />

      {/* Content Skeleton */}
      <div className="h-2/5 p-4 flex flex-col justify-between bg-white rounded-b-3xl space-y-2">
        <div className="space-y-2">
          <div className="h-4 w-20 bg-gray-300 rounded" />       {/* Category */}
          <div className="h-5 w-40 bg-gray-300 rounded" />       {/* Product Name */}
          <div className="h-4 w-32 bg-gray-300 rounded" />       {/* Description */}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <div className="flex-1 h-8 bg-gray-300 rounded-full" />
          <div className="flex-1 h-8 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
