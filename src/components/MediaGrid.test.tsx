import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Navbar from './Navbar';
import { usePosting } from '@/store/Posting';
import MediaGrid from './MediaGrid';
const mockSharedFn = jest.fn();
interface MediaGrid {
  dicomImages: { src: string; name: string }[];  // creating a type for media grid client 
}

const dicomImages = [
  { src: '/dicoms/brain.jpg', name: 'image1.dcm' },
  { src: '/dicoms/brain.jpg', name: 'image2.dcm' },
  { src: '/dicoms/brain.jpg', name: 'image3.dcm' },
  { src: '/dicoms/brain.jpg', name: 'image4.dcm' },
  { src: '/dicoms/brain.jpg', name: 'image5.dcm' },
  { src: '/dicoms/brain.jpg', name: 'image6.dcm' },
  { src: '/dicoms/brain.jpg', name: 'image7.dcm' },
  { src: '/dicoms/brain.jpg', name: 'image8.dcm' },
  { src: '/dicoms/brain.jpg', name: 'image9.dcm' },
];
/*jest.mock('@/store/Posting', () => ({
    usePosting: jest.fn((selector) => selector({ Shared: mockSharedFn })),
}));*/
describe('Testing regarding the Media Grid component', () => {
    beforeEach(() => {
    //render(<MediaGrid dicomImages={dicomImages}/>);
    });

    test('Tests for checking images name ', () => {
        //const mockfn = jest.fn();
        const imageName = screen.getByText(/mage1.dcm/i)
        expect(imageName).toBeInTheDocument();

    });
    test("tests for selected images functions",()=>{
    })
});