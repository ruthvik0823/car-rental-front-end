import type { BookingView } from "../types/MyBookingStates";
import type { CarBooking } from "../types/MyBookings";
import type { Feedback } from "../types/myBookingsFeedBack";
import bookingsRaw from "../config/carBookingsByUser.json";
import feedbackRaw from "../config/MyBookingFeedBack.json";

export function loadBookingsForUser(userId: string): BookingView[] {
  // Build a map of feedback by bookingId
  const fbMap: Record<string, Feedback> = {};
  feedbackRaw.forEach((f) => {
    fbMap[f.bookingId] = f;
  });

  // Filter and map to BookingView
  return (bookingsRaw as CarBooking[])
    .filter((b) => b.userId === userId)
    .map((b) => ({
      // Spread all CarBooking props (userId, bookingStatus, etc.)
      ...b,
      editable: !["Service Provided", "Booking Finished", "Cancelled"].includes(
        b.bookingStatus
      ),
      isFeedbackGiven: Boolean(fbMap[b.bookingId]),
    }));
}
