'use client';
import React, { useEffect, useRef } from 'react';
import cornerstone from 'cornerstone-core';
import { initializeCornerstone } from '@/lib/cornerstoneInit';

type MediaCardProps = {
  src: string;
  name: string;
  selected: boolean;
  onSelect: (name: string) => void;
};

export default function MediaCard({ src, name, selected, onSelect }: MediaCardProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    initializeCornerstone();
    if (!elementRef.current) return;

    cornerstone.enable(elementRef.current);

    const imageId = `wadouri:${window.location.origin}${src}`;

    cornerstone
      .loadImage(imageId)
      .then((image: any) => {
        cornerstone.displayImage(elementRef.current!, image);
      })
      .catch((err: unknown) => {
        console.error('Failed to load DICOM image:', name, err);
      });
  }, [src]);

  const cardClasses = [
    'cursor-pointer',
    'border',
    'rounded-xl',
    'overflow-hidden',
    'transition-all',
    'duration-200',
    'shadow-md',
    'flex',
    'items-center',
    'justify-center',
    'w-full',
    'aspect-[4/3]',
    'max-w-[190px]',      // Mobile
    'sm:max-w-[260px]',   // Small screens
    'md:max-w-[300px]',   // Medium screens
    'lg:max-w-[340px]',   // Large screens
    'xl:max-w-[380px]',   // Extra large
    selected ? 'ring-4 ring-blue-500 scale-105' : 'hover:ring-2 hover:ring-blue-300'
  ].join(' ');

  return (
    <div onClick={() => onSelect(name)} className={cardClasses}>
      <div
        ref={elementRef}
        className="w-full h-full bg-black flex items-center justify-center "
      />
    </div>
  );
}
