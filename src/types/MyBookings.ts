export interface CarBooking {
  userId: string;        // User ID of the person who booked the car
  bookingId: string;     // Unique identifier for the booking
  bookingStatus: string; // The current status of the booking
  carImageUrl: string;   // URL to the car's image
  carModel: string;      // Model of the car
  orderDetails: string;  // Order details like #2437 (05.10.2024)
}