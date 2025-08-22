import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Navbar from './Navbar';
import { usePosting } from '@/store/Posting';
const mockSharedFn = jest.fn();

jest.mock('@/store/Posting', () => ({
    usePosting: jest.fn((selector) => selector({ Shared: mockSharedFn })),
}));

describe('Testing regarding the navbar component', () => {
    beforeEach(() => {
        render(<Navbar />);
    });

    test('Name testing', () => {
        const feature = screen.getByText(/Feature/i);
        const text = screen.getByRole('heading', { level: 1 });
        const patientName = screen.getByText(/Shiven Dashora/i);
        const GotoReport = screen.getByText(/Go to the Report/i);
        const share = screen.getByText(/Share/i);
        const print = screen.getByText(/Print/i);

        expect(feature).toBeInTheDocument();
        expect(patientName).toBeInTheDocument();
        expect(text).toBeInTheDocument();
        expect(GotoReport).toBeInTheDocument();
        expect(share).toBeInTheDocument();
        expect(print).toBeInTheDocument();
    });

    test('Share button triggers usePosting().Shared(true)', () => {
        (usePosting as unknown as jest.Mock).mockReturnValue(mockSharedFn);
        const share_button = screen.getByTestId("shareButton");
        fireEvent.click(share_button);

        expect(mockSharedFn).toHaveBeenCalledWith(true);
    });
});
