'use client';
import React, { useEffect, useState } from 'react';
import { useMediaStore } from '@/store/UserMediaStore';
import { useQrCodeUrl } from '@/store/Qrcode';
import { usePosting } from '@/store/Posting';
import useIsMobile from '@/lib/useIsMobile';
import MediaCard from './MediaCard';

interface MediaGridProps {
  dicomImages: { src: string; name: string }[];
  //patientdetails: { SerialId: number; patientId: number; imageName: string }[]; // ✅ Updated to array
}

export default function MediaGrid({ dicomImages}: MediaGridProps) {
  const selectedImage = useMediaStore((state) => state.selectedPaths);
  const togglePath = useMediaStore((state) => state.togglePath);
  const isPosting = usePosting((state) => state.isposting);
  const toggleUrl = useQrCodeUrl((state) => state.toggeUrl);
  const url = useQrCodeUrl((state) => state.url);
  const clearPaths = useMediaStore((state) => state.clearPaths);
  const [token, setToken] = useState('');
  const [link,setLink] = useState('')
  const isMobile = useIsMobile();

  useEffect(() => {
    clearPaths();
  }, []);

  async function postRequest(arr: string[], SerialId: number, patientId: number) {
    try {
      const response = await fetch('http://localhost:3001/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          arr,
          SerialId,
          patientId,
        }),
      });

      const result = await response.json();
      toggleUrl(result.qrCodeUrl);
      const extractedToken = result.shareUrl?.split('/').pop();
      setToken(extractedToken || '');
      console.log('Token extracted:', extractedToken);
      //console.log('Share Url:', result.shareUrl);
      setLink(result.shareUrl);
    } catch (err) {
      console.error('Error sending images:', err);
    }
  }

  useEffect(() => {
    let selectedImageName=[]
    if (isPosting && selectedImage.length > 0) {
      console.log('Posting started');
      const requests = selectedImage.map((imagePath) => {
        const imageName = imagePath.split('?v=')[1]; // get "Image1" from "/dicoms/image-000001.dcm?v=Image1"
        console.log('selected image '+imageName )
        selectedImageName.push(imageName)
        // const matchedDetail = patientdetails.find(
        //   (detail) => detail.imageName === imageName
        // );return postRequest([imagePath], matchedDetail.SerialId, matchedDetail.patientId)
      });
      
      postRequest(selectedImage,1,2)
      Promise.all(requests).then(() => {
        console.log('All post requests done');
      });
    }
  }, [isPosting, selectedImage]);

  const renderMediaGrid = () => (
    <div className="grid grid-cols-4 gap-[20px] w-full max-w-screen-xl py-10">
      {dicomImages.map((image) => (
        <MediaCard
          key={image.name}
          src={image.src}
          name={image.name}
          onSelect={() => togglePath(image.name)}
          selected={selectedImage.includes(image.name)}
        />
      ))}
    </div>
  );

  const showQRSection = isPosting && url[0];

  return (
    <div className="p-4 w-full flex justify-center">
      {renderMediaGrid()}
      {showQRSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 px-2">
          <div className="relative bg-blue-900 text-white rounded-xl shadow-lg p-4 w-full max-w-3xl flex flex-col sm:flex-row gap-6 items-center justify-center max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                console.log('Removed');
                usePosting.getState().Shared(false);
              }}
              className="absolute top-2 right-3 text-gray-900 hover:text-red-600 text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            <img
              src={url[0]}
              alt="QR code"
              className="w-20 h-20 sm:w-65 sm:h-65 object-contain"
            />
            <div className="flex flex-col gap-4 w-full max-w-sm px-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-2 py-2 border border-gray-300 rounded text-black w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <button className="bg-blue-600 text-white px-2 py-2 rounded hover:bg-blue-500">
                Send Mail
              </button>
              <a className='text-blue text-sm ' href={link}>Click here to view</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
