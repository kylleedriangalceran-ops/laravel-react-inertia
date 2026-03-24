import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import useDarkMode from "../Hooks/useDarkMode";
import { GooeyToaster } from "goey-toast";
import "goey-toast/styles.css";
import { Sun, Moon, ArrowUp } from "lucide-react";

export default function Layout({ children }) {
    const [darkMode, toggleDarkMode] = useDarkMode();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [activeLink, setActiveLink] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const fadeTimer = setTimeout(() => setFadeOut(true), 1800);
        const removeTimer = setTimeout(() => setIsLoading(false), 2400);
        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    useEffect(() => {
        // Force scroll to top on page load/refresh
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }

        // Remove hash from the URL initially so the browser doesn't jump to a section
        if (window.location.hash) {
            window.history.replaceState(
                null,
                "",
                window.location.pathname + window.location.search,
            );
        }

        const forceTop = () => window.scrollTo(0, 0);
        forceTop();
        setTimeout(forceTop, 0);
        setTimeout(forceTop, 100);

        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);

            // Determine active section for nav highlighting
            const sections = ["about", "skills", "projects", "contact"];
            let current = "";
            for (const section of sections) {
                const el = document.getElementById(section);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        current = section;
                    }
                }
            }
            if (current && window.scrollY > 100) {
                setActiveLink(current);
            } else if (window.scrollY <= 100) {
                setActiveLink("");
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const scrollToSection = (e, id) => {
        // Only prevent default and scroll if we are on the home page with these sections
        if (
            window.location.pathname === "/" ||
            window.location.pathname === ""
        ) {
            e.preventDefault();
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-transparent dark:bg-[#111111] text-gray-900 dark:text-[#EDEDEC] font-sans selection:bg-sky-primary selection:text-white pb-12 transition-colors duration-500 relative">
            {/* Loading Screen */}
            {isLoading && (
                <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FDFDFC] dark:bg-[#0a0a0a] transition-opacity duration-600 ease-out ${fadeOut ? "opacity-0" : "opacity-100"}`}>
                    <style>{`
                        @keyframes logoBreath {
                            0%, 100% { transform: scale(1); opacity: 0.9; }
                            50% { transform: scale(1.05); opacity: 1; }
                        }
                        @keyframes ringExpand {
                            0% { transform: scale(0.8); opacity: 0.6; }
                            50% { transform: scale(1.15); opacity: 0; }
                            100% { transform: scale(0.8); opacity: 0.6; }
                        }
                        @keyframes shimmer {
                            0% { background-position: -200% center; }
                            100% { background-position: 200% center; }
                        }
                    `}</style>
                    <div className="relative flex items-center justify-center">
                        {/* Outer ring pulse */}
                        <div
                            className="absolute w-32 h-32 rounded-full border-2 border-sky-500/30"
                            style={{ animation: "ringExpand 2s ease-in-out infinite" }}
                        ></div>
                        {/* Inner glow */}
                        <div className="absolute w-20 h-20 rounded-full bg-sky-500/10 blur-xl"></div>
                        {/* Logo */}
                        <img
                            src="/images/logos/khael-logo.png"
                            alt="Loading"
                            className="w-16 h-auto relative z-10 dark:brightness-0 dark:invert"
                            style={{ animation: "logoBreath 2s ease-in-out infinite" }}
                        />
                    </div>
                    {/* Shimmer text */}
                    <p
                        className="mt-8 text-sm font-bold tracking-[0.3em] uppercase"
                        style={{
                            background: "linear-gradient(90deg, #9ca3af 25%, #7EC8E3 50%, #9ca3af 75%)",
                            backgroundSize: "200% auto",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            animation: "shimmer 2s linear infinite",
                        }}
                    >
                        Loading
                    </p>
                </div>
            )}

            {/* Global Background - Original Undisturbed */}
            <div className="fixed inset-0 -z-20 pointer-events-none overflow-hidden">
                <div
                    className="absolute inset-0 bg-fixed bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('/images/backgrounds/download.png')`,
                    }}
                ></div>
            </div>
            {/* Sticky Frostbite Navbar */}
            <nav className="sticky top-0 z-40 bg-white/60 dark:bg-[#111111]/70 backdrop-blur-2xl border-b border-gray-200/50 dark:border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300">
                <div className="w-full max-w-5xl mx-auto px-6 h-[72px] flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <img
                            src="/images/logos/khael-logo.png"
                            alt="Kylle"
                            className="h-10 md:h-12 w-auto dark:brightness-0 dark:invert opacity-90 hover:opacity-100 transition-opacity"
                        />
                    </Link>

                    <div className="hidden md:flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                            {[
                                { name: "About", id: "about" },
                                { name: "Skills", id: "skills" },
                                { name: "Projects", id: "projects" },
                                { name: "Contact", id: "contact" },
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={`#${item.id}`}
                                    onClick={(e) => {
                                        scrollToSection(e, item.id);
                                        setActiveLink(item.id);
                                    }}
                                    className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 group ${
                                        activeLink === item.id
                                            ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10"
                                            : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-white/5"
                                    }`}
                                >
                                    {activeLink === item.id && (
                                        <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-sky-500 dark:bg-sky-400"></span>
                                    )}
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Dark Mode Toggle */}
                        <div className="flex items-center pl-2 ml-2 border-l border-gray-200 dark:border-white/10">
                            <button
                                onClick={toggleDarkMode}
                                className="flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-sky-500 dark:text-gray-400 dark:hover:text-sky-400 transition-colors focus:outline-none"
                            >
                                {darkMode ? (
                                    <Sun className="w-5 h-5" />
                                ) : (
                                    <Moon className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>{children}</main>

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-sky-primary hover:bg-sky-hover text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 cursor-pointer ${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
                aria-label="Scroll to top"
            >
                <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
            </button>

            {/* Notification Toast Component */}
            <GooeyToaster position="top-right" />
        </div>
    );
}
