import { render, screen, fireEvent } from '@testing-library/react';
import FeedbackModal from './FeedbackModal';  // Adjust the import path based on your project structure
import { CarBooking } from "../../types/myBooking";  // Adjust this import if needed

const mockOnStatusChange = jest.fn();
const mockOnClose = jest.fn();

// Mock localStorage
const setItemMock = jest.fn();
const getItemMock = jest.fn();
Object.defineProperty(window, 'localStorage', {
  value: {
    setItem: setItemMock,
    getItem: getItemMock,
  },
});

const booking: CarBooking & { editable: boolean; isFeedbackGiven: boolean } = {
  bookingId: "12345",
  carModel: "Tesla Model 3",
  carImageUrl: "https://example.com/tesla.jpg",
  bookingStatus: "Service Provided",
  orderDetails: "12345 (2025.04.25)",
  userId: "user123",
  editable: true,
  isFeedbackGiven: false,
};

test('calls onClose when the Close button is clicked', () => {
  render(<FeedbackModal 
    isOpen={true} 
    onClose={mockOnClose} 
    booking={booking} 
    onStatusChange={mockOnStatusChange} 
    isLeaveFeedback={false} 
  />);
  
  const closeButton = screen.getByText(/Close/i);
  fireEvent.click(closeButton);
  
  expect(mockOnClose).toHaveBeenCalledTimes(1);
});

test('renders the feedback modal with the correct title for editing feedback', () => {
  render(<FeedbackModal 
    isOpen={true} 
    onClose={mockOnClose} 
    booking={booking} 
    onStatusChange={mockOnStatusChange} 
    isLeaveFeedback={true} 
  />);
  
  // Check modal title for editing feedback
  expect(screen.getByText(/Rate your experience/i)).toBeInTheDocument();
});
