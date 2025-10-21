import type { CarBooking } from "./MyBookings";

export interface BookingView extends CarBooking {
  editable: boolean;
  isFeedbackGiven: boolean;
}
