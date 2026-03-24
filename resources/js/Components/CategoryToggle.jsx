import React from 'react';

export default function CategoryToggle({ categories, activeCategory, onCategoryChange }) {
    return (
        <div className="flex justify-center mb-12">
            <div className="bg-white/90 dark:bg-[#111111]/80 backdrop-blur-md rounded-full p-1.5 shadow-md border border-gray-100 dark:border-white/10 flex items-center">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onCategoryChange(category.id)}
                        className={`px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold text-sm md:text-base border border-transparent transition-all duration-300 ${activeCategory === category.id
                                ? "bg-gray-900 dark:bg-white text-white dark:text-[#0B1528] shadow-md"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                            }`}
                    >
                        {category.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
