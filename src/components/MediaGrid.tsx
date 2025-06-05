'use client';

import React, { useEffect, useState } from 'react'; //used for maintaining various rendering states
import dynamic from 'next/dynamic'; 
import { useMediaStore } from '@/store/UserMediaStore'; //Importing media store for storing the url or location for the DICOM images
import { useQrCodeUrl } from '@/store/Qrcode'; //Importing qr code url for storing the url for the generated qr code from backend
import { usePosting } from '@/store/Posting'; // Imported usePosting function to maintain the share button click state and the corrosponding media selected 
import useIsMobile from '@/lib/useIsMobile'; // Imported useIsMobile for detection of the scanning device to be a phone
import SelectedMobileMediaGrid from '@/app/share/[token]/page'; // Imported the SelectedMobileMediaGrid component o display the selected media files in a mobile view maintaining the route security by verification of token and otp for validating patient
import MediaCard from './MediaCard';
//const MediaCard = dynamic(() => import('./MediaCard'), { ssr: false });

interface MediaGrid {
  dicomImages: { src: string; name: string }[];  // creating a type for media grid client 
}


export default function MediaGrid({ dicomImages }: MediaGrid) {
  const selectedImage = useMediaStore((state) => state.selectedPaths); // Calls for the array from store where the paths have benn stored for the media files 
  const togglePath = useMediaStore((state) => state.togglePath); // Calls for the toggle path function where it selectively checks for the array if the path doesn't exists
  const isPosting = usePosting((state) => state.isposting); // Calls for checking the posting state checks based on the clicks of share button
  const toggleUrl = useQrCodeUrl((state) => state.toggeUrl);
  const url = useQrCodeUrl((state) => state.url);

  const [token, setToken] = useState('');
  const isMobile = useIsMobile();
  /* This function deals with sending requests to api for getting response on string array
  (image,id or image name bssed on database key ) 
  passed to generate tokens for securing routes*/
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
/*Below function deals with checking for whether the share button is clicked or not and media files are selected or not in the array */ 
  useEffect(() => {
    if (isPosting && selectedImage.length > 0) {
      console.log('Posting started');
      postRequest(selectedImage);
    }
  }, [isPosting, selectedImage]);


  // RenderMediaFrid function runs the funtion and display the style grid component for the media files that are being fetched(currently without database)
  const renderMediaGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 w-full max-w-screen-xl py-10">
      {dicomImages.map((image) => (
        <MediaCard
          key={image.name}
          src={image.src}
          name={image.name}
          onSelect={() => togglePath(image.src + '?v=' + image.name)}
          selected={selectedImage.includes(image.src + '?v=' + image.name)}
        />
      ))}
    </div>
  );
  // verifies the condition where both share button and qr code image need to be true for displaying the qr code section
  const showQRSection = isPosting && url[0];


  // Conditionally render the various components based on whether its a small screen device,medium or a big screen device 
  return (
    <div className="p-4 w-full flex justify-center">
      {isMobile ? <SelectedMobileMediaGrid /> : renderMediaGrid() }  
      {showQRSection && (// for displaying the qr section
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 px-2">
          <div className="relative bg-blue-900 text-white rounded-xl shadow-lg p-4 w-full max-w-3xl flex flex-col sm:flex-row gap-6 items-center justify-center max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                console.log('Removed');
                usePosting.getState().Shared(false);// for removing the qrsection
              }}
              className="absolute top-2 right-3 text-gray-900 hover:text-red-600 text-2xl font-bold  "
              aria-label="Close"
            >
              &times;
            </button>
            <img
              src={url[0]}
              alt="QR code"
              className="w-20 h-20 sm:w-65 sm:h-65 object-contain" // works for dispalying the qr code image
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
