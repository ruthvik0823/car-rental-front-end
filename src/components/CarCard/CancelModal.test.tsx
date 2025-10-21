import { render, screen, fireEvent } from '@testing-library/react';
import CancelModal from './CancelModal';  // Adjust the import path based on your project structure

test('renders the CancelModal when isOpen is true', () => {
  const onClose = jest.fn();
  const onConfirm = jest.fn();

  render(<CancelModal isOpen={true} onClose={onClose} onConfirm={onConfirm} />);

  // Check if the modal title and description are rendered
  expect(screen.getByText(/Cancel Booking?/i)).toBeInTheDocument();
  expect(screen.getByText(/Are you sure you want to cancel this booking?/i)).toBeInTheDocument();
  expect(screen.getByText(/This action cannot be undone./i)).toBeInTheDocument();
});

test('does not render the CancelModal when isOpen is false', () => {
  const onClose = jest.fn();
  const onConfirm = jest.fn();

  render(<CancelModal isOpen={false} onClose={onClose} onConfirm={onConfirm} />);

  // Check that the modal is not in the document
  expect(screen.queryByText(/Cancel Booking?/i)).toBeNull();
});

test('calls onClose when "Go Back" button is clicked', () => {
  const onClose = jest.fn();
  const onConfirm = jest.fn();

  render(<CancelModal isOpen={true} onClose={onClose} onConfirm={onConfirm} />);

  const goBackButton = screen.getByText(/Go Back/i);
  fireEvent.click(goBackButton);

  // Ensure onClose is called when Go Back button is clicked
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('calls onConfirm when "Confirm Cancel" button is clicked', () => {
  const onClose = jest.fn();
  const onConfirm = jest.fn();

  render(<CancelModal isOpen={true} onClose={onClose} onConfirm={onConfirm} />);

  const confirmButton = screen.getByText(/Confirm Cancel/i);
  fireEvent.click(confirmButton);

  // Ensure onConfirm is called when Confirm Cancel button is clicked
  expect(onConfirm).toHaveBeenCalledTimes(1);
});
