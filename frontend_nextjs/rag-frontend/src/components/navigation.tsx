"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function NavigationBar() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    return (
        <nav className="fixed w-full bg-white dark:bg-gray-900 shadow-md px-6 py-3 flex items-center justify-between">
            {/* Left Side: Logo and Name */}
            <div className="flex items-center space-x-3 cursor-pointer">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center dark:invert">
                    <Image
                        src="/next.svg"
                        alt="SigmARJ Logo"
                        width={40}
                        height={40}
                        className="object-cover dark:invert"
                    />
                </div>
                <span className="text-xl font-semibold text-gray-800 dark:invert tracking-tight">
                    SigmARJ
                </span>
            </div>

            {/* Right Side: Dark/Light Toggle and Navigation Links */}
            <div className="flex items-center space-x-6 ">
                {/* Dark/Light Mode Toggle */}
                <button
                    onClick={() => setDarkMode((prev) => !prev)}
                    className="cursor-pointer focus:outline-none text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    aria-label="Toggle Dark Mode"
                >
                    {darkMode ? (
                        // Sun icon for light mode
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 6.66l-.71-.71M4.05 4.93l-.71-.71M12 7a5 5 0 100 10 5 5 0 000-10z" />
                        </svg>
                    ) : (
                        // Moon icon for dark mode
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                        </svg>
                    )}
                </button>
                <a
                    href="#about"
                    className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                    About
                </a>
                <a
                    href="#contact"
                    className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                    Contact
                </a>
            </div>
        </nav>
    );
}