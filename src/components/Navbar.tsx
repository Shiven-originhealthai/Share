'use client';
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePosting } from '@/store/Posting';
import { useMediaStore } from '@/store/UserMediaStore';

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const post = usePosting((state) => state.Shared);
  const selectedArray = useMediaStore((state) => state.selectedPaths);
  const clearPaths = useMediaStore((state) => state.clearPaths);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const onShare = () => {
    console.log('sharing');
    post(true);
  };

  const onCancel = () => {
    console.log('cancelling');
    clearPaths();
  };

  return (
    <>
      {/* Navbar */}
      <nav className="w-full bg-blue-900 text-white px-4 sm:px-6 py-4 flex items-center transition-all duration-300">
        {/* Title */}
        <h1 className="text-xl font-bold">Feature</h1>

        {/* Buttons - centered and optimized */}
        <div className="hidden sm:flex flex-1 justify-center items-center gap-3">
          <button className="bg-blue-100 text-blue-600 font-semibold px-3 py-1.5 rounded hover:bg-sky-700 hover:text-white transition cursor-pointer whitespace-nowrap">
            Go to the report
          </button>
          <button className="bg-blue-100 text-blue-600 font-semibold px-3 py-1.5 rounded hover:bg-sky-700 hover:text-white transition cursor-pointer whitespace-nowrap">
            Print
          </button>
          <button
            onClick={onShare}
            className="bg-blue-100 text-blue-600 font-semibold px-3 py-1.5 rounded hover:bg-sky-700 hover:text-white transition cursor-pointer whitespace-nowrap"
            data-testid="shareButton"
          >
            Share
          </button>
          {selectedArray.length > 0 && (
            <button
              onClick={onCancel}
              className="bg-blue-100 text-blue-600 font-semibold px-2 py-1.5 rounded hover:bg-sky-700 hover:text-white transition cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
          )}
        </div>

        {/* User Info aligned right */}
        <div className="flex items-center gap-6 whitespace-nowrap ml-auto">
          <p className="text-lg font-bold">Shiven Dashora</p>
        </div>

        {/* Hamburger Menu for Mobile */}
        <button
          onClick={toggleSidebar}
          className="sm:hidden ml-4 text-white focus:outline-none transition-all duration-300"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Sidebar Drawer for Mobile */}
      {sidebarOpen && (
        <div className="sm:hidden bg-blue-800 text-white px-6 py-4 flex flex-col gap-3 transition-all duration-300">
          <button className="bg-blue-100 text-blue-600 font-semibold px-3 py-1.5 rounded hover:bg-sky-700 hover:text-white transition whitespace-nowrap">
            Go to the report
          </button>
          <button className="bg-blue-100 text-blue-600 font-semibold px-3 py-1.5 rounded hover:bg-sky-700 hover:text-white transition whitespace-nowrap">
            Print
          </button>
          <button
            onClick={onShare}
            className="bg-blue-100 text-blue-600 font-semibold px-3 py-1.5 rounded hover:bg-sky-700 hover:text-white transition whitespace-nowrap"
          >
            Share
          </button>
          {selectedArray.length > 0 && (
            <button
              onClick={onCancel}
              className="bg-blue-100 text-blue-600 font-semibold px-3 py-1.5 rounded hover:bg-sky-700 hover:text-white transition whitespace-nowrap"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </>
  );
}
