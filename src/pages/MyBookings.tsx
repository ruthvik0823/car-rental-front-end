import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxStoreHooks";
import NavBarMyBook from "@/components/TabNav";
import CarCard from "@/components/CarCard/CarCard";
import { MyBooking } from "@/types/types";
import { fetchCurrentUserBookings } from "@/slices/bookingSlice";

const MyBookings = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((s) => s.auth.user?.userId);
  const bookings = useAppSelector((s) => s.bookings.currentUserBookings);
  const [filter, setFilter] = useState<
    "ALL_BOOKINGS" | MyBooking["bookingStatus"]
  >("ALL_BOOKINGS");
  const [filteredBookings, setFilteredBookings] = useState<MyBooking[]>([]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCurrentUserBookings(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    setFilteredBookings(
      filter === "ALL_BOOKINGS"
        ? bookings
        : bookings.filter((b) => b?.bookingStatus === filter)
    );
  }, [bookings, filter]);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-4">My bookings</h1>
      <NavBarMyBook currentFilter={filter} setFilter={setFilter} />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 mt-6">
        {filteredBookings.map((b) => (
          <CarCard
            key={b.bookingId}
            image={b.carImageUrl}
            carModel={b.carModel}
            bookingStatus={b.bookingStatus}
            orderDetails={b.orderDetails}
            bookingId={b.bookingId}
          />
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
