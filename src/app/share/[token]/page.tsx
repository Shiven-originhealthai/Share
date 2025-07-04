'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useMediaStore } from '@/store/UserMediaStore';
import useIsMobile from '@/lib/useIsMobile';
import { useQrCodeUrl } from '@/store/Qrcode';
import { usePosting } from '@/store/Posting';
import { useTokenSetter } from '@/store/Token';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Loading from '@/components/Loading';
//Declaring the mobile media card prop which is used for rendering the images with their type
interface MobileMediaCardProps {
  src: string;
}
//This component is responsible for displaying the mobile media card where the selected images are put in  
const MobileMediaCard: React.FC<MobileMediaCardProps> = ({ src }) => {
  return (
    <div className="rounded-xl shadow-md overflow-hidden">
      <div className="w-full h-40 bg-black rounded-t-xl flex items-center justify-center" style={{ position: 'relative' }}>
        <Image
          src={src}
          alt={src.split('/').pop() || 'image'}
          fill
          style={{ objectFit: 'contain' }}
          className="rounded-t-xl"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      </div>
      <div className="p-2 text-center">
        <p className="text-sm text-white-700">{src.split('/').pop()}</p>
      </div>
    </div>
  );
};

function MobileDisplay({ selectedPaths }: { selectedPaths: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-screen-sm mx-auto p-4 overflow-y-auto max-h-[80vh]" style={{ height: '80vh' }}>
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

// Responsible for displaying the selected component 
export default function SelectedMobileMediaGrid() {
  //const router = useRouter();
  const selectedPaths = useMediaStore((state) => state.selectedPaths);
  const [tokenFromUrl, setTokenFromUrl] = useState<string | undefined>(undefined);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //stores the token in the store
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlToken = window.location.pathname.split('/').pop();
      setTokenFromUrl(urlToken);
    }
  }, []);

  // if the token is available then the token is back validated from backend 
  useEffect(() => {
    if (tokenFromUrl) {
      validateToken(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  // function for vaidating the token from backend
  async function validateToken(token: string) {
    try {
      const res = await fetch(`http://localhost:3001/images/share/${token}`);
      const data = await res.json();
      setIsTokenValid(!!data?.response);
    } catch (err) {
      setIsTokenValid(false);
    } finally {
      setIsLoading(false)
    }
  }

  // function for validating the otp validation
  async function otp_validation(otpField: { enteredOtp: string, token: string }) {
    const response = await fetch('http://localhost:3001/images/validateOtp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(otpField)
    });
    const received_json = await response.json();
    return received_json;
  }

  // Handles otp submit function from the input entered 
  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOtpError('');

    if (!otp.trim()) {
      setOtpError('Please enter OTP');
      return;
    }

    if (!tokenFromUrl) {
      setOtpError('Token missing. Please refresh the page.');
      return;
    }

    try {
      const isValid = await otp_validation({ enteredOtp: otp.trim(), token: tokenFromUrl });
      if (isValid["response"]) {
        setIsOtpVerified(true);
      } else {
        setOtpError(isValid["Error"]);
      }
    } catch (err) {
      setOtpError('Error verifying OTP. Please try again.');
    }
  }
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // checks for is token valid where token is validated from backend  if not successfull renders below div 
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

  //checks for the condition is otp verified if yes would display code accordingly
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

  // returns component on mobile display 
  return <MobileDisplay selectedPaths={selectedPaths} />;
}