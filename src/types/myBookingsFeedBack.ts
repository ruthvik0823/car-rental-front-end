export interface Feedback {
    bookingId: string;       // The booking ID
    carId: string;           // The car ID
    clientId: string;        // The client ID (renamed from userId)
    feedbackText: string;    // Text about car rental experience
    rating: string;          // Rating (example: "4.8")
  }
  