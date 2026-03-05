import React, { useState, useEffect } from 'react';

export default function NotificationToast() {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [progress, setProgress] = useState(100);

    const DURATION = 8000; // 8 seconds

    useEffect(() => {
        // Show the toast after 3 seconds
        const showTimer = setTimeout(() => {
            setIsVisible(true);
        }, 3000);

        return () => clearTimeout(showTimer);
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        // Progress bar timer updates every 50ms
        const interval = 50;
        const decrement = (100 / (DURATION / interval));

        const progressTimer = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) {
                    clearInterval(progressTimer);
                    setIsVisible(false);
                    return 0;
                }
                return prev - decrement;
            });
        }, interval);

        return () => clearInterval(progressTimer);
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform bg-white dark:bg-[#161615] rounded-lg shadow-xl border border-gray-100 dark:border-[#3E3E3A] overflow-hidden ${isExpanded ? 'w-80' : 'w-64 cursor-pointer hover:-translate-y-1'}`}
            onClick={() => !isExpanded && setIsExpanded(true)}
        >
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                        <div className="text-xl">👋</div>
                        <div>
                            <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                {isExpanded ? 'Welcome to my Portfolio!' : 'Welcome!'}
                            </h4>
                            {isExpanded && (
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Thanks for visiting. Feel free to explore my projects and get in touch if you have any questions or opportunities!
                                </p>
                            )}
                        </div>
                    </div>
                    {isExpanded && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsVisible(false);
                            }}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Progress Bar Container */}
            <div className="h-1 bg-gray-100 dark:bg-gray-800 w-full relative group">
                {/* Visual indicator of the time running out */}
                <div
                    className="h-full bg-[var(--color-sky-primary)] left-0 top-0 transition-none"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
}
