import { render, fireEvent, screen } from '@testing-library/react';
import NavBarMyBook from './TabNav';

describe('NavBarMyBook', () => {
  const mockSetFilter = jest.fn();

  // Test: Render component and check if all options are displayed
  it('renders all options correctly', () => {
    render(<NavBarMyBook currentFilter="All bookings" setFilter={mockSetFilter} />);

    // Check if each option is rendered
    const options = [
      "All bookings",
      "Reserved",
      "Service started",
      "Service provided",
      "Booking finished",
      "Cancelled"
    ];

    options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  // Test: Check if the `setFilter` function is called when an option is clicked
  it('calls setFilter when an option is clicked', () => {
    render(<NavBarMyBook currentFilter="All bookings" setFilter={mockSetFilter} />);

    const reservedButton = screen.getByText('Reserved');
    fireEvent.click(reservedButton);

    expect(mockSetFilter).toHaveBeenCalledTimes(1);
    expect(mockSetFilter).toHaveBeenCalledWith('Reserved');
  });

  // Test: Check if the selected option has the correct style
  it('applies the correct style for the selected filter', () => {
    render(<NavBarMyBook currentFilter="Reserved" setFilter={mockSetFilter} />);

    const reservedButton = screen.getByText('Reserved');
    expect(reservedButton).toHaveClass('bg-black text-white');

    const allBookingsButton = screen.getByText('All bookings');
    expect(allBookingsButton).toHaveClass('text-gray-600 hover:text-black');
  });

  // Test: Check if the non-selected options have the correct style
  it('applies the correct style for non-selected filters', () => {
    render(<NavBarMyBook currentFilter="Reserved" setFilter={mockSetFilter} />);

    const cancelledButton = screen.getByText('Cancelled');
    expect(cancelledButton).toHaveClass('text-gray-600 hover:text-black');
  });
});
