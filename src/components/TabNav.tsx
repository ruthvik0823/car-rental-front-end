// components/navBarMyBook.tsx
import { MyBooking } from "@/types/types";
import React from "react";

interface NavBarProps {
  currentFilter: string;
  setFilter: React.Dispatch<
    React.SetStateAction<"ALL_BOOKINGS" | MyBooking["bookingStatus"]>
  >;
}

const OPTIONS: Array<
  | "ALL_BOOKINGS"
  | "RESERVED"
  | "SERVICE_STARTED"
  | "SERVICE_PROVIDED"
  | "BOOKING_FINISHED"
  | "CANCELLED"
> = [
  "ALL_BOOKINGS",
  "RESERVED",
  "SERVICE_STARTED",
  "SERVICE_PROVIDED",
  "BOOKING_FINISHED",
  "CANCELLED",
];

const NavBarMyBook: React.FC<NavBarProps> = ({ currentFilter, setFilter }) => {
  return (
    <nav className="flex flex-wrap gap-2 border-b border-gray-300 pb-2">
      {OPTIONS.map((opt) => (
        <button
          key={opt}
          onClick={() => setFilter(opt)}
          className={`text-sm font-medium px-3 py-1 rounded ${
            currentFilter === opt
              ? "bg-black text-white"
              : "text-gray-600 hover:text-black"
          }`}
        >
          {opt
            .split("_")
            .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
            .join(" ")}
        </button>
      ))}
    </nav>
  );
};

export default NavBarMyBook;
