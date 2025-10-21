import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MyBookings from './MyBookings'; // Adjust if your path differs
import * as dataAdapters from '../utils/dataAdapters';
import feedbackData from '../config/MyBookingFeedBack.json';

// 🧪 Mock TabNav component using React.createElement to avoid JSX issues
jest.mock('../components/TabNav', () => ({
  __esModule: true,
  default: (props: any) =>
    React.createElement(
      'div',
      { 'data-testid': 'mock-nav-bar' },
      `Filter: ${props.currentFilter}`
    ),
}));

// 🧪 Mock CarCard component using React.createElement
jest.mock('../components/CarCard/CarCard', () => ({
  __esModule: true,
  default: (props: any) =>
    React.createElement(
      'div',
      { 'data-testid': 'mock-car-card' },
      `Booking ID: ${props.booking.bookingId}`
    ),
}));

// 🧪 Mock loadBookingsForUser function
jest.spyOn(dataAdapters, 'loadBookingsForUser').mockImplementation(() => [
  {
    userId: 'user-123',
    bookingId: 'booking-1',
    bookingStatus: 'Reserved',
    carImageUrl: 'url-1',
    carModel: 'Model S',
    orderDetails: 'Details here',
    isFeedbackGiven: false,
    editable: true,
  },
]);

describe('MyBookings component', () => {
  beforeEach(() => {
    localStorage.clear();

    const user = JSON.stringify({ id: 'user-123', email: 'test@example.com' });
    localStorage.setItem('currentUser', user);
  });

  it('shows login prompt if no user in localStorage', () => {
    localStorage.removeItem('currentUser');
    render(<MyBookings />);
    expect(
      screen.getByText(/Please log in to see your bookings/i)
    ).toBeInTheDocument();
  });

  it('renders bookings and nav bar when user is logged in', async () => {
    render(<MyBookings />);

    await waitFor(() => {
      expect(screen.getByText(/My bookings/i)).toBeInTheDocument();
      expect(screen.getByTestId('mock-nav-bar')).toBeInTheDocument();
      expect(screen.getByTestId('mock-car-card')).toBeInTheDocument();
    });

    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    expect(storedBookings.length).toBeGreaterThan(0);

    const storedFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
    expect(storedFeedback).toEqual(feedbackData);
  });
});
