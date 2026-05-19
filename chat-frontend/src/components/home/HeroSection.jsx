import React from "react";
import UserMenu from "../user/UserMenu";
import { assets } from "../../assets/assets";

/**
 * Hero section with Free4Talk branding and user menu.
 */
const HeroSection = ({ isLoggedIn, onAuthClick, onLogout }) => (
  <div className="">
    {/* FreeTalk Navbar */}
    <header className="sticky top-0 z-10 px-5 sm:px-10 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2.5">
        <img
          src={assets.logo}
          alt="FreeTalk Logo"
          className="w-10 h-10 rounded-full flex-shrink-0"
        />
        <span className="text-xl font-bold text-white tracking-tight">
          FreeTalk
        </span>
      </div>
      <div>
        {isLoggedIn ? (
          <UserMenu onLogout={onLogout} />
        ) : (
          <button
            onClick={onAuthClick}
            className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </header>

    {/* Hero Content */}
    <div className="text-center py-10 sm:py-12 px-4">
      <h1 className="text-xl sm:text-2xl md:text-5xl font-bold text-white leading-tight tracking-tight">
        Chat Freely. Connect Instantly.
      </h1>
      <p className="text-gray-300 mt-6 text-lg leading-relaxed">
        Join chat rooms, connect with people worldwide, and build real
        conversations in real time.
      </p>
    </div>
  </div>
);

export default HeroSection;
