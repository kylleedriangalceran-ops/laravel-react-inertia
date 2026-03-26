import React, { useRef, useLayoutEffect, useState } from 'react';

export default function CategoryToggle({ categories, activeCategory, onCategoryChange }) {
    const btnRefs = useRef([]);
    const [pill, setPill] = useState({ left: 0, width: 0 });
    const [ready, setReady] = useState(false);
    const [pressing, setPressing] = useState(null);

    // Measure the active button's position so the pill can follow it
    useLayoutEffect(() => {
        const idx = categories.findIndex(c => c.id === activeCategory);
        const el = btnRefs.current[idx];
        if (el) {
            setPill({ left: el.offsetLeft, width: el.offsetWidth });
            if (!ready) setReady(true);
        }
    }, [activeCategory, categories]);

    return (
        <div className="flex justify-center mb-10">
            <style>{`
                @keyframes pillGlow {
                    0%   { opacity: 0.55; transform: scaleX(1)   scaleY(1); }
                    60%  { opacity: 0.2;  transform: scaleX(1.12) scaleY(1.5); }
                    100% { opacity: 0;    transform: scaleX(1.25) scaleY(2); }
                }
                @keyframes pillShimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }
            `}</style>

            <div className="relative bg-white/90 dark:bg-[#111111]/80 backdrop-blur-md rounded-full p-1.5 shadow-lg border border-gray-100 dark:border-white/10 flex items-center">

                {/* Glow burst — re-triggers on every category change via key */}
                {ready && (
                    <span
                        key={`glow-${activeCategory}`}
                        aria-hidden="true"
                        className="absolute top-1.5 bottom-1.5 rounded-full pointer-events-none"
                        style={{
                            left: pill.left,
                            width: pill.width,
                            background: 'radial-gradient(ellipse at center, rgba(126,200,227,0.55) 0%, transparent 70%)',
                            animation: 'pillGlow 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                            transition: `left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
                                         width 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)`,
                        }}
                    />
                )}

                {/* Sliding pill — the main background */}
                {ready && (
                    <span
                        aria-hidden="true"
                        className="absolute top-1.5 bottom-1.5 rounded-full bg-gray-900 dark:bg-white shadow-md overflow-hidden"
                        style={{
                            left: pill.left,
                            width: pill.width,
                            transition: `left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
                                         width 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)`,
                        }}
                    >
                        {/* Shimmer stripe inside the pill */}
                        <span
                            key={`shimmer-${activeCategory}`}
                            aria-hidden="true"
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)',
                                backgroundSize: '200% auto',
                                animation: 'pillShimmer 0.55s ease-out forwards',
                            }}
                        />
                    </span>
                )}

                {/* Buttons */}
                {categories.map((category, i) => (
                    <button
                        key={category.id}
                        ref={el => (btnRefs.current[i] = el)}
                        onClick={() => onCategoryChange(category.id)}
                        onMouseDown={() => setPressing(category.id)}
                        onMouseUp={() => setPressing(null)}
                        onMouseLeave={() => setPressing(null)}
                        className={`relative z-10 px-7 md:px-9 py-2.5 md:py-3 rounded-full font-semibold text-sm md:text-base select-none outline-none ${
                            activeCategory === category.id
                                ? 'text-white dark:text-[#0B1528]'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                        style={{
                            transition: 'color 0.25s ease, transform 0.1s ease',
                            transform: pressing === category.id ? 'scale(0.93)' : 'scale(1)',
                        }}
                    >
                        {category.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
