'use client';
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react'; // Install Lucide: npm install lucide-react

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const onShare = () => {
    console.log('sharing');
    console.log(localStorage.getItem('selected'))
  };

  return (
    <>
      {/* Navbar */}
      <nav className="w-full bg-blue-900 text-white px-4 sm:px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Sonio Share</h1>

        {/* Desktop Buttons */}
        <div className="hidden sm:flex flex-row items-center gap-4">
          <button className="bg-blue-100 text-blue-600 font-bold px-5 py-2 rounded hover:bg-sky-700 hover:text-white transition cursor-pointer">
            Go to the report
          </button>
          <button className="bg-blue-100 text-blue-600 font-bold px-5 py-2 rounded hover:bg-sky-700 hover:text-white transition cursor-pointer">
            Print
          </button>
          <button
            onClick={onShare}
            className="bg-blue-100 text-blue-600 font-bold px-5 py-2 rounded hover:bg-sky-700 hover:text-white transition cursor-pointer"
          >
            Share
          </button>
        </div>
        <p className="text-lg font-bold ml-4">JOHN DOE</p>

        {/* Hamburger Menu - Visible on Mobile */}
        <button
          onClick={toggleSidebar}
          className="sm:hidden text-white focus:outline-none"
        >
          {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Sidebar Drawer for Mobile */}
      {sidebarOpen && (
        <div className="sm:hidden bg-blue-800 text-white px-6 py-4 flex flex-col gap-4 transition-all duration-300">
          <button className="bg-blue-100 text-blue-600 font-bold px-5 py-2 rounded hover:bg-sky-700 hover:text-white transition">
            Go to the report
          </button>
          <button className="bg-blue-100 text-blue-600 font-bold px-5 py-2 rounded hover:bg-sky-700 hover:text-white transition">
            Print
          </button>
          <button
            onClick={onShare}
            className="bg-blue-100 text-blue-600 font-bold px-5 py-2 rounded hover:bg-sky-700 hover:text-white transition"
          >
            Share
          </button>
          <p className="text-lg font-bold">JOHN DOE</p>
        </div>
      )}
    </>
  );
}
