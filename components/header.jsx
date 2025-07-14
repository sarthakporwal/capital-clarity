'use client';

import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./ui/tooltip";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDark}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/70 dark:bg-black/70 shadow-md backdrop-blur-md border border-gray-200 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 group"
          >
            <Sun className={`absolute transition-all duration-300 ${isDark ? 'opacity-0 scale-75' : 'opacity-100 scale-100'} text-yellow-500`} />
            <Moon className={`absolute transition-all duration-300 ${isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} text-blue-400`} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isDark ? "Switch to light mode" : "Switch to dark mode"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const Header = () => {
  return (
    <header className="sticky top-0 w-full z-50 shadow-lg bg-white/60 dark:bg-black/60 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={"/logo.png"}
            alt="Welth Logo"
            width={160}
            height={48}
            className="h-10 w-auto object-contain drop-shadow-md"
          />
        </Link>
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-4">
          <SignedOut>
            <a href="#features" className="px-3 py-1 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
              Features
            </a>
            <a href="#testimonials" className="px-3 py-1 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
              Testimonials
            </a>
          </SignedOut>
        </div>
        {/* Action Buttons */}
        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <SignedIn>
            <Link href="/dashboard" className="flex items-center gap-2">
              <Button variant="outline" className="rounded-lg px-4 py-2 shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
            <a href="/transaction/create">
              <Button className="flex items-center gap-2 rounded-lg px-4 py-2 shadow-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </a>
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline" className="rounded-lg px-4 py-2 shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
                Login
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
