import React from "react";

const SizeChartModel = ({ isOpen, onClose }) => {
  const sizeData = [
    { size: "XS", chest: 30, waist: 26, hip: 32 },
    { size: "S", chest: 32, waist: 28, hip: 34 },
    { size: "M", chest: 34, waist: 30, hip: 36 },
    { size: "L", chest: 36, waist: 32, hip: 38 },
    { size: "XL", chest: 38, waist: 34, hip: 40 },
    { size: "XXL", chest: 40, waist: 36, hip: 42 },
    { size: "3XL", chest: 42, waist: 38, hip: 44 },
    { size: "4XL", chest: 44, waist: 40, hip: 46 },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-5xl bg-white shadow-2xl  overflow-hidden md:flex max-h-[90vh] overflow-y-auto">
        {/* Close Button*/}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 transition-colors duration-200"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image Section */}
        <div className=" md:block md:w-96 p-4 bg-gray-50 flex items-center justify-center">
          <img
            src="/MEASUREMENT CHART-1.webp"
            alt="Fashion model  Size chart trendi kala"
            className="w-full object-cover "
          />
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-[#9CAF88] mb-2 font-heading">
              Size Chart
            </h1>
            <p className="text-sm text-gray-500 font-body">
              All measurements are in inches.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full overflow-hidden border-collapse">
              <thead>
                <tr className="bg-[#9CAF88]   text-white font-bold text-sm sm:text-lg text-center">
                  <th className="py-4 px-2 sm:px-4 font-home">Size</th>
                  <th className="py-4 px-2 sm:px-4 font-home">Chest</th>
                  <th className="py-4 px-2 sm:px-4 font-home">Waist</th>
                  <th className="py-4 px-2 sm:px-4 font-home">Hip</th>
                </tr>
              </thead>
              <tbody>
                {sizeData.map((item, index) => (
                  <tr
                    key={index}
                    className={`text-center transition-colors duration-200 ease-in-out ${
                      index % 2 === 0
                        ? "bg-white hover:bg-[#9caf8891]"
                        : "bg-gray-50 hover:bg-gray-200"
                    }`}
                  >
                    <td className="py-3 px-2 sm:px-4 font-medium text-gray-800">
                      {item.size}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-gray-600">
                      {item.chest}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-gray-600">
                      {item.waist}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-gray-600">
                      {item.hip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 text-center text-xs text-gray-400 mt-4 font-body">
            Note: This is a general guide. Please check product-specific size
            charts for best fit.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeChartModel;