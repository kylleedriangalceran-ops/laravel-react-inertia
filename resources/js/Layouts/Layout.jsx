import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import useDarkMode from '../Hooks/useDarkMode';
import { GooeyToaster } from 'goey-toast';
import 'goey-toast/styles.css';

export default function Layout({ children }) {
    const [darkMode, toggleDarkMode] = useDarkMode();
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        // Force scroll to top on page load/refresh
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);

        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC] font-sans selection:bg-[var(--color-sky-primary)] selection:text-white pb-12 transition-colors duration-300 relative">
            {/* Global Background Image */}
            <div className="fixed inset-0 -z-10 bg-[url('/images/backgrounds/download.png')] bg-cover bg-center bg-fixed opacity-[0.04] dark:opacity-[0.06] pointer-events-none"></div>
            {/* Sticky Navbar */}
            <nav className="sticky top-0 z-40 bg-[#FDFDFC]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-100 dark:border-[#3E3E3A]">
                <div className="w-full max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <img src="/images/logos/khael-logo.svg" alt="Kylle" className="h-8 w-auto" />
                    </Link>

                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                        <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-[var(--color-sky-primary)] dark:hover:text-[var(--color-sky-primary)] transition-colors">About</a>
                        <a href="#skills" className="text-gray-600 dark:text-gray-300 hover:text-[var(--color-sky-primary)] dark:hover:text-[var(--color-sky-primary)] transition-colors">Skills</a>
                        <a href="#projects" className="text-gray-600 dark:text-gray-300 hover:text-[var(--color-sky-primary)] dark:hover:text-[var(--color-sky-primary)] transition-colors">Projects</a>
                        <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-[var(--color-sky-primary)] dark:hover:text-[var(--color-sky-primary)] transition-colors">Contact</a>

                        {/* Dark Mode Toggle */}
                        <button onClick={toggleDarkMode} className="p-2 text-gray-400 hover:text-white rounded-full transition-colors ml-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-sky-light)]">
                            {darkMode ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-[var(--color-sky-primary)] hover:bg-[var(--color-sky-hover)] text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 cursor-pointer ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                aria-label="Scroll to top"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </button>

            {/* Notification Toast Component */}
            <GooeyToaster position="bottom-right" />
        </div>
    );
}
