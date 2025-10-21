import { render, screen, fireEvent } from '@testing-library/react';
import Toast from './Toast'; // Adjust the import based on your file structure

// Mock function for onClose
const mockOnClose = jest.fn();

describe('Toast Component', () => {
  it('calls onClose when close button is clicked', () => {
    render(
      <Toast
        message="Error!"
        isOpen={true}
        onClose={mockOnClose}
        type="error"
      />
    );

    // Find the close button and click it
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    // Check if the onClose function was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
