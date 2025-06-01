'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useMediaStore } from '@/store/UserMediaStore';
import { useQrCodeUrl } from '@/store/Qrcode';
import { usePosting } from '@/store/Posting';
import useIsMobile from '@/lib/useIsMobile';
import SelectedMobileMediaGrid from '../app/share/[token]/page';

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
  const selectedImage = useMediaStore((state) => state.selectedPaths);
  const togglePath = useMediaStore((state) => state.togglePath);
  const toggleUrl = useQrCodeUrl((state) => state.toggeUrl);
  const isPosting = usePosting((state) => state.isposting);
  const url = useQrCodeUrl((state) => state.url);

  const [token, setToken] = useState('');
  const isMobile = useIsMobile();

  // ✅ Function to POST selected images
  async function postRequest(arr: string[]) {
    try {
      const response = await fetch('http://localhost:3001/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ arr }),
      });

      const result = await response.json();
      toggleUrl(result.qrCodeUrl);

      const extractedToken = result.shareUrl?.split('/').pop();
      setToken(extractedToken || '');
      console.log('Token extracted:', extractedToken);
      console.log('Share Url:', result.shareUrl);
    } catch (err) {
      console.error('Error sending images:', err);
    }
  }
  useEffect(() => {
    if (isPosting && selectedImage.length > 0) {
      console.log('Posting started');
      postRequest(selectedImage);
    }
  }, [isPosting, selectedImage]);

  const renderMediaGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-screen-xl py-10">
      {dicomImages.map((image) => (
        <MediaCard
          key={image.name}
          src={image.src}
          name={image.name}
          onSelect={() => togglePath(image.src)}
          selected={selectedImage.includes(image.src)}
        />
      ))}
    </div>
  );

  const renderMobileMediaGrid = () => <SelectedMobileMediaGrid />;

  const showQRSection = isPosting && url[0];

  return (
    <div className="p-4 w-full flex justify-center fixed">
      {isMobile ? renderMobileMediaGrid() : renderMediaGrid()}

      {showQRSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 px-2">
          <div className="relative bg-white rounded-xl shadow-lg p-4 w-full max-w-3xl flex flex-col sm:flex-row gap-6 items-center justify-center max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                console.log('clicked')
                usePosting.getState().Shared(false)
                //useQrCodeUrl.getState().clearUrl()

              }}
              className="absolute top-2 right-3 text-gray-700 hover:text-red-600 text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>

            <img
              src={url[0]}
              alt="QR code"
              className="w-64 h-64 sm:w-72 sm:h-72 object-contain"
            />

            <div className="flex flex-col gap-4 w-full max-w-sm px-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 border border-gray-300 rounded text-black w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
                Send Mail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}