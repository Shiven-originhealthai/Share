'use client';

import React, { useEffect, useRef } from 'react';
import { usePosting } from '@/store/Posting';

type MediaCardProps = {
  src: string;
  name: string;
  selected: boolean;
  onSelect: (name: string) => void;
};

export default function MediaCard({ src, name, selected, onSelect }: MediaCardProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const isPosting = usePosting((state) => state.isposting);

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
  }, [src]);

  return (
    <div
      onClick={() => onSelect(name)}
      className={`cursor-pointer w-full aspect-[4/3] transition-all duration-200 ${
        selected && !isPosting
          ? 'ring-4 ring-blue-500 scale-105'
          : 'hover:ring-2 hover:ring-blue-900 border rounded'
      }`}
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
