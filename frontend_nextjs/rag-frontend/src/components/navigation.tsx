"use client";
import Image from "next/image";
import { ModeToggle } from "@/components/toggle-mode";

export default function NavigationBar() {


    return (
        <nav className="fixed top-1 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-gray-400 dark:border-gray-700 shadow-md rounded-2xl px-6 py-3 flex items-center justify-between">
            {/* Left Side: Logo and Name */}
            <div className="flex items-center space-x-3 cursor-pointer">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-black-100 dark:bg-black-100 flex items-center justify-center dark:invert">
                    <Image
                        // priority={true}
                        src="/logo.png"
                        alt="SigmARJ Logo"
                        width={100}
                        height={100}
                        className="object-cover dark:invert "
                    />
                </div>
                <span className="text-xl font-semibold text-gray-800 dark:invert tracking-tight">
                    SigmARJ
                </span>
            </div>

            {/* Right Side: Dark/Light Toggle and Navigation Links */}
            <div className="flex items-center space-x-6 ">
                <ModeToggle />
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