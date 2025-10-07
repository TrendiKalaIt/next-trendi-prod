import React from 'react';

const TabsNavigation = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="border-b border-gray-200 flex flex-wrap gap-x-6 sm:gap-x-8 gap-y-1 mb-4">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
             px-2 sm:px-4 mb-1 p-1
            font-semibold text-lg
            whitespace-nowrap
            transition-colors duration-300 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-[#93A87E] focus:ring-offset-2
            rounded-lg
            ${activeTab === tab.id
                            ? 'text-black border-b-3 border-black bg-[#93a87e4e]'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-[#93a87e24]'}
          `}
                >
                    {tab.name}
                </button>
            ))}
        </div>
    );
};

export default TabsNavigation;