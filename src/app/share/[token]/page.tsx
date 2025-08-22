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
// Declaring the mobile media card prop which is used for rendering the images with their type
interface MobileMediaCardProps {
  src: string;
}
// This component is responsible for displaying the mobile media card where the selected images are put in
const MobileMediaCard: React.FC<MobileMediaCardProps> = ({ src }) => {
  return (
    <div className="rounded-xl overflow-hidden">
      <div className="w-full h-60 bg-black rounded-t-xl flex items-center justify-center relative">
        <img src={src} alt="" />
      </div>
    </div>
  );
};
function MobileDisplay({ selectedPaths }: { selectedPaths: string[] }) {
  return (
    <div className="grid grid-cols-4 gap-5 w-full max-w-screen-xl py-10 mx-auto">
      {selectedPaths.length > 0 ? (
        selectedPaths.map((src: string, idx: number) => (
          <MobileMediaCard key={idx} src={src} />
        ))
      ) : (
        <p className="text-center col-span-4 text-gray-500">
          No media selected. Please select on desktop.
        </p>
      )}
    </div>
  );
}
// Responsible for displaying the selected component
export default function SelectedMobileMediaGrid() {
  const [selectedPaths, setSelectedPaths] = useState<string[]>([])
  const [tokenFromUrl, setTokenFromUrl] = useState<string | undefined>(undefined);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const [Updated, setUpdated] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlToken = window.location.pathname.split('/').pop();
      setTokenFromUrl(urlToken);
    }
  }, []);
  useEffect(() => {
    if (tokenFromUrl) {
      validateToken(tokenFromUrl);
    }
  }, [tokenFromUrl]);
  async function validateToken(token: string) {
    try {
      const res = await fetch(`http://localhost:3001/images/share/${token}`);
      const data = await res.json();
      console.log(!!data?.response)
      setIsTokenValid(!!data?.response);
      console.log('Response' + data?.response)
      console.log('DicomImages' + data?.DicomImages.src)
      data?.DicomImages.forEach((elem: any) => {
        setSelectedPaths((prevPaths) => [...prevPaths, elem.src]);
        console.log(elem.src)
      });
    } catch (err) {
      setIsTokenValid(false);
    } finally {
      setIsLoading(false);
    }
  }
  async function otp_validation(otpField: { enteredOtp: string; token: string }) {
    const response = await fetch('http://localhost:3001/images/validateOtp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(otpField),
    });
    const received_json = await response.json();
    return received_json;
  }
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
      if (isValid['response']) {
        setIsOtpVerified(true);
      } else {
        setOtpError(isValid['Error']);
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
  return <MobileDisplay selectedPaths={selectedPaths} />;
}