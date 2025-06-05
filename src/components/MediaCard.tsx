'use client';

import React, { useEffect, useRef } from 'react';
import { usePosting } from '@/store/Posting';
import Image from 'next/image';

/* Type Declaration for the media card which would be displaying the media files */
type MediaCardProps = {
  src: string;
  name: string;
  selected: boolean;
  onSelect: (name: string) => void;
};

// This is the Media Card component which is responsible for displaying the image cards for Dicom images 
export default function MediaCard({ src, name, selected, onSelect }: MediaCardProps) {
  const elementRef = useRef<HTMLDivElement | null>(null); // Creates a refrence for the html div element 
  const isPosting = usePosting((state) => state.isposting); // Variable for checking the share button clicked status 

  // Only show blue ring if selected and sessionStorage says to show
  const [showRing, setShowRing] = React.useState(true);

  useEffect(() => {
    // On mount, check if we should show the ring
    const hideRing = sessionStorage.getItem('hideBlueRing');
    if (hideRing === 'true') setShowRing(false);
  }, []);

  // Only render <Image> for jpg, not cornerstone for DICOM (had implemented the dicom reading function too)
  if (src.endsWith('.jpg')) {
    return (
      <div
        onClick={() => onSelect(name)}
        className={`cursor-pointer w-full aspect-[4/3] transition-all duration-200 border rounded ${selected ? 'ring-4 ring-blue-500 scale-105' : 'hover:ring-2 hover:ring-blue-900'}`}
        data-testid = 'select'
      >
        <div className="border rounded-xl overflow-hidden shadow-md w-full h-full relative flex items-center justify-center bg-black">
          <Image
            src={src}
            alt={name}
            fill
            style={{ objectFit: 'contain' }}
            className="rounded-t-xl"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
            {name}
          </div>
        </div>
      </div>
    );
  }

  /*
  DICOM image reading function which needs .dcm files to read 
  
  useEffect(() => { 
    if (typeof window === 'undefined') return;

    let cornerstone: any;
    let resizeObserver: ResizeObserver;

    const load = async () => {
      cornerstone = (await import('cornerstone-core')).default;
      const { initializeCornerstone } = await import('@/lib/cornerstoneInit');

      initializeCornerstone();

      if (!elementRef.current) return;

      cornerstone.enable(elementRef.current);

      const imageId = `wadouri:${window.location.origin}${src}`;

      try {
        const image = await cornerstone.loadImage(imageId);
        if (!elementRef.current) return;
        cornerstone.displayImage(elementRef.current, image);

        resizeObserver = new ResizeObserver(() => {
          if (elementRef.current) {
            cornerstone.resize(elementRef.current, true);
          }
        });
        resizeObserver.observe(elementRef.current);
      } catch (err) {
        console.error('Failed to load DICOM image:', name, err);
      }
    };

    load();

    return () => {
      if (resizeObserver && elementRef.current) {
        resizeObserver.disconnect();
      }
      if (cornerstone && elementRef.current) {
        cornerstone.disable(elementRef.current);
      }
    };
  }, [src]);*/

  //Returns the grid ith images in them with defined styles
  return (
    <div
      onClick={() => onSelect(name)}
      className={`cursor-pointer w-full aspect-[4/3] transition-all duration-200 border rounded ${selected && showRing && !isPosting ? 'ring-4 ring-blue-500 scale-105' : 'hover:ring-2 hover:ring-blue-900'}`}
    >
      <div className="border rounded-xl overflow-hidden shadow-md w-full h-full relative">
        <div ref={elementRef} className="absolute inset-0 bg-black" />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
          {name}
        </div>
      </div>
    </div>
  );
}
