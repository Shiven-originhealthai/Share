import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import MediaGrid from './MediaGrid';
import { useMediaStore } from '@/store/UserMediaStore';
import { usePosting } from '@/store/Posting';
import { useQrCodeUrl } from '@/store/Qrcode';

const mockSelectedPaths: string[] = ['/dicoms/brain.jpg?v=image1.dcm'];
const mockTogglePath = jest.fn();
const mockToggleUrl = jest.fn();
const mockShared = jest.fn();

type MediaStoreState = {
  selectedPaths: string[];
  togglePath: (path: string) => void;
};

jest.mock('@/store/UserMediaStore', () => ({
  useMediaStore: jest.fn((selector: (state: MediaStoreState) => any) =>
    selector({
      selectedPaths: mockSelectedPaths,
      togglePath: mockTogglePath,
    })
  ),
}));

jest.mock('@/store/Qrcode', () => ({
  useQrCodeUrl: jest.fn((selector: any) =>
    selector({
      url: [''],
      toggeUrl: mockToggleUrl,
    })
  ),
}));

jest.mock('@/store/Posting', () => ({
  usePosting: jest.fn((selector: any) =>
    selector({
      isposting: true,
      Shared: mockShared,
    })
  ),
}));

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        qrCodeUrl: 'https://example.com/qr.png',
        shareUrl: 'https://example.com/share/abc123',
      }),
  })
) as jest.Mock;

const dicomImages = [
  { src: '/dicoms/brain.jpg', name: 'image1.dcm' },
  { src: '/dicoms/brain.jpg', name: 'image2.dcm' },
];

describe('MediaGrid Component Tests', () => {
  beforeEach(() => {
    mockSelectedPaths.length = 1;
    jest.clearAllMocks();
    render(<MediaGrid dicomImages={dicomImages} />);
  });

  test('renders image name', () => {
    const imageName = screen.getByText(/image1.dcm/i);
    expect(imageName).toBeInTheDocument();
  });

  test('calls togglePath on image click', () => {
    const imageName = screen.getByText('image1.dcm');
    fireEvent.click(imageName);
    expect(mockTogglePath).toHaveBeenCalledWith('/dicoms/brain.jpg?v=image1.dcm');
  });

  test('Mock API call test', async () => {
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ arr: mockSelectedPaths }),
      });
    });

    await waitFor(() => {
      expect(mockToggleUrl).toHaveBeenCalledWith('https://example.com/qr.png');
    });
  });
});
