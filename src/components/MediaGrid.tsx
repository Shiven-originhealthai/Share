// src/components/MediaGrid.tsx
'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
const MediaCard = dynamic(() => import('./MediaCard'), { ssr: false });

const dicomImages = [
  { src: '/dicoms/image-000002.dcm', name: 'image1.dcm' },
  { src: '/dicoms/image-000003.dcm', name: 'image2.dcm' },
  { src: '/dicoms/image-000004.dcm', name: 'image3.dcm' },
  { src: '/dicoms/image-000005.dcm', name: 'image4.dcm' },
  { src: '/dicoms/image-000006.dcm', name: 'image5.dcm' },
  { src: '/dicoms/image-000091.dcm', name: 'image6.dcm' }
];

export default function MediaGrid() {
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelect = (name: string) => {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };
  //localStorage.setItem('selected',JSON.stringify(selected));
  return (
    <div className="px-10 py-25  flex justify-center items-center " >
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg-grid-cols-4 gap-35 ">
        {dicomImages.map(image => (
          <MediaCard
            key={image.name}
            src={image.src}
            name={image.name}
            selected={selected.includes(image.name)}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}
