import { render, screen, fireEvent } from '@testing-library/react';
import CarCard from './CarCard';  // Adjust the import path based on your project structure

test('renders support chat link with correct icon', () => {
  const booking = {
    bookingId: "12345",
    carModel: "Tesla Model 3",
    carImageUrl: "https://example.com/tesla.jpg",
    bookingStatus: "Reserved",
    orderDetails: "12345 (2025.04.25)",
    editable: true,
    isFeedbackGiven: false,
    userId: "user123",  // Ensure userId is present
  };

  render(<CarCard booking={booking} onStatusChange={jest.fn()} />);

  const supportChatLink = screen.getByText(/Support chat/i);
  expect(supportChatLink).toBeInTheDocument();
  expect(supportChatLink).toContainHTML('<svg');  // Checks that the icon is rendered as part of the link
});

test('calls onStatusChange when Cancel modal confirm is clicked', () => {
  const mockOnStatusChange = jest.fn();
  const booking = {
    bookingId: "12345",
    carModel: "Tesla Model 3",
    carImageUrl: "https://example.com/tesla.jpg",
    bookingStatus: "Reserved", // Active status to show "Cancel" button
    orderDetails: "12345 (2025.04.25)",
    editable: true,
    isFeedbackGiven: false,
    userId: "user123",  // Ensure userId is present
  };

  render(<CarCard booking={booking} onStatusChange={mockOnStatusChange} />);

  const cancelButton = screen.getByText(/Cancel/i);
  fireEvent.click(cancelButton);

  // Confirm the modal is shown
  expect(screen.getByText(/Are you sure you want to cancel?/i)).toBeInTheDocument();  // Adjust based on your modal content

  const confirmButton = screen.getByText(/Confirm/i);
  fireEvent.click(confirmButton);

  // Check if onStatusChange was called with correct arguments
  expect(mockOnStatusChange).toHaveBeenCalledWith("12345", "Cancelled");
});

test('opens Cancel modal when "Cancel" button is clicked', () => {
  const booking = {
    bookingId: "12345",
    carModel: "Tesla Model 3",
    carImageUrl: "https://example.com/tesla.jpg",
    bookingStatus: "Reserved", // Active status to show "Cancel" button
    orderDetails: "12345 (2025.04.25)",
    editable: true,
    isFeedbackGiven: false,
    userId: "user123",  // Ensure userId is present
  };

  render(<CarCard booking={booking} onStatusChange={jest.fn()} />);

  const cancelButton = screen.getByText(/Cancel/i);
  fireEvent.click(cancelButton);
});
