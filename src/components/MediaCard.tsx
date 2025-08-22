'use client';
import React, { useEffect, useRef, useState } from 'react';
import { usePosting } from '@/store/Posting';
type MediaCardProps = {
  src: string; // This is already base64 encoded
  name: string;
  selected: boolean;
  onSelect: (name: string) => void;
};
export default function MediaCard({ src, name, selected, onSelect }: MediaCardProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const isPosting = usePosting((state) => state.isposting);
  const [showRing, setShowRing] = useState(true);
  useEffect(() => {
    const hideRing = sessionStorage.getItem('hideBlueRing');
    if (hideRing === 'true') setShowRing(false);
  }, []);
  return (
    <div
      onClick={() => onSelect(name)}
      className={`cursor-pointer w-full aspect-[4/3] transition-all duration-200 border rounded
        ${selected && showRing && !isPosting
          ? 'ring-4 ring-blue-500 scale-105'
          : 'hover:ring-2 hover:ring-blue-900'}`}
    >
      <div className="overflow-hidden shadow-md w-full h-full relative flex items-center justify-center bg-black">
        {/* Display the base64 image directly */}
        <img
          src={src} // this is "data:image/jpeg;base64,...." from backend
          alt={name}
          className="absolute inset-0 w-full h-full object-contain rounded-t-xl"
        />
        <div className="absolute bottom-0 left-3 right-0 bg-black bg-opacity-50 text-white text-base p-1 truncate">
          {name}
        </div>
      </div>
    </div>
  );
}





