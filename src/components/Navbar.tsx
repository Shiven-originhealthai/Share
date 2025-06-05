'use client';
import React, { useState } from 'react'; // Imported the useState hook for maintaining the state of the sidebar in ss view 
import { Menu, X } from 'lucide-react'; // Install Lucide: npm install lucide-react used for design of sidebar icon
import { usePosting } from '@/store/Posting';
import { useMediaStore } from '@/store/UserMediaStore';
export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const post = usePosting((state) => state.Shared) // function for maintaing the state of share button 
  const selectedArray = useMediaStore((state) => state.selectedPaths)
  const clearPaths = useMediaStore((state) => state.clearPaths)


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // used for maintaining side bar status
  };

  // changes the state of share based n the click event of share button
  const onShare = () => {
    console.log('sharing');
    post((true));

  };
  const onCancel = () => {
    console.log('cancelling');
    console.log(selectedArray.length)
    clearPaths();

  }

  return (
    <>
      {/* Navbar */}
      <nav className="w-full bg-blue-900 text-white px-4 sm:px-6 py-4 flex justify-between items-center transition-all duration-300" >
        <h1 className="text-xl font-bold">Feature</h1>

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
            data-testid='shareButton'
          >
            Share
          </button>
          {selectedArray.length > 0 && <button
            onClick={onCancel}
            className="bg-blue-100 text-blue-600 font-bold px-3 py-2 rounded hover:bg-sky-700 hover:text-white transition cursor-pointer "
          >
            Cancel
          </button>}

        </div>
        <p className="text-lg font-bold ml-4">Shiven Dashora</p>{/*User Meta Data Section* /}

        {/* Hamburger Menu - Visible on Mobile */}
        <button
          onClick={toggleSidebar}
          className="sm:hidden text-white focus:outline-none transition-all duration-300"
        >
          {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Sidebar Drawer for Mobile */}
      {sidebarOpen && (
        <div className="sm:hidden bg-blue-800 text-white px-9 py-4 flex flex-col gap-4 transition-all duration-300">
          <button className="bg-blue-100 text-blue-600 font-bold px-3 py-2 rounded hover:bg-sky-700 hover:text-white transition">
            Go to the report
          </button>
          <button className="bg-blue-100 text-blue-600 font-bold px-1 py-2 rounded hover:bg-sky-700 hover:text-white transition">
            Print
          </button>
          <button
            onClick={onShare}
            className="bg-blue-100 text-blue-600 font-bold px-3 py-2 rounded hover:bg-sky-700 hover:text-white transition"
          >
            Share
          </button>

        </div>
      )}
    </>
  );
}
