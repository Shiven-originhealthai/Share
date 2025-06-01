'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useMediaStore } from '@/store/UserMediaStore';
import { initializeCornerstone } from '@/lib/cornerstoneInit';
import useIsMobile from '@/lib/useIsMobile';
import { useQrCodeUrl } from '@/store/Qrcode';
import { usePosting } from '@/store/Posting';
import { useTokenSetter } from '@/store/Token'; 

interface MobileMediaCardProps {
  src: string;
}

const MobileMediaCard: React.FC<MobileMediaCardProps> = ({ src }) => {
  const dicomRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cornerstone: any;

    async function load() {
      const cornerstoneModule = await import('cornerstone-core');
      cornerstone = cornerstoneModule.default;

      initializeCornerstone();

      const element = dicomRef.current;
      if (!element) return;

      cornerstone.enable(element);
      const imageId = `wadouri:${window.location.origin}/${src}`;

      try {
        const image = await cornerstone.loadImage(imageId);
        cornerstone.displayImage(element, image);
      } catch (err) {
        console.error('Cornerstone error:', err);
      }
    }

    load();

    return () => {
      if (cornerstone && dicomRef.current) {
        cornerstone.disable(dicomRef.current);
      }
    };
  }, [src]);

  return (
    <div className="rounded-xl shadow-md overflow-hidden">
      <div
        ref={dicomRef}
        className="w-full h-40 bg-black rounded-t-xl"
        style={{ position: 'relative' }}
      />
      <div className="p-2 text-center">
        <p className="text-sm text-white-700">{src.split('/').pop()}</p>
      </div>
    </div>
  );
};

function MobileDisplay({ selectedPaths }: { selectedPaths: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-screen-sm mx-auto p-4">
      {selectedPaths.length > 0 ? (
        selectedPaths.map((src: string, idx: number) => (
          <MobileMediaCard key={idx} src={src} />
        ))
      ) : (
        <p className="text-center col-span-2 text-gray-500">
          No media selected. Please select on desktop.
        </p>
      )}
    </div>
  );
}

export default function SelectedMobileMediaGrid() {
  const selectedPaths = useMediaStore((state) => state.selectedPaths);
  //const url = useQrCodeUrl((state) => state.url);
  const token = useTokenSetter((state) => state.extractedToken);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  console.log(token);

  useEffect(() => {
    if (token) {
      validateToken(token);
    }
  }, [token]);

  async function validateToken(token: string) {
    try {
      const res = await fetch(`http://localhost:3001/share/${token}`);
      const data = await res.json();
      setIsTokenValid(data?.success === true);
      console.log('Validated token');
    } catch (err) {
      console.error('Token validation failed:', err);
      setIsTokenValid(false);
    }
  }

  async function otp_validation(otpField: { enteredOtp: number }) {
    const response = await fetch('http://localhost:3001/images/validateOtp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(otpField)
    });

    const received_json = await response.json();
    return received_json["validationResonpe"];
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOtpError('');

    if (!otp.trim()) {
      setOtpError('Please enter OTP');
      return;
    }

    try {
      const isValid = await otp_validation({ enteredOtp: Number(otp) });
      if (isValid) {
        setIsOtpVerified(true);
      } else {
        setOtpError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setOtpError('Error verifying OTP. Please try again.');
    }
  }

if (!isTokenValid) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl text-black font-bold mb-4 text-center">Invalid Token</h2>
        <p className="mb-4 text-center text-black">Access denied. Please check your link.</p>
      </div>
    </div>
  );
}

if (!isOtpVerified) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl text-black font-bold mb-4 text-center">OTP Verification</h2>
        <p className="mb-4 text-center text-black">Please enter the OTP sent to your device</p>
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500 transition"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}

// ✅ Both token and OTP are valid – show media
return <MobileDisplay selectedPaths={selectedPaths} />;

  /*if (!isTokenValid) {
    return (
      <div className="text-center p-6 text-red-500">
        Invalid or missing token. Access denied.
      </div>
    );
  }*/
  //<MobileDisplay selectedPaths={selectedPaths}




}