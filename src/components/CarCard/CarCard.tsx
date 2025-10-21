import { Card } from "@mui/material";
import { MessageSquare } from "lucide-react";
import Button from "../common/Button";
import CancelModal from "./CancelModal";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxStoreHooks";
import { cancelBooking } from "@/slices/bookingSlice";
import FeedbackModal from "./FeedbackModal";
import { useNavigate } from "react-router";

const getStatusBadgeStyles = (status: string) => {
  switch (status) {
    case "RESERVED":
      return "bg-white text-green-700";
    case "Reserved by SA":
      return "bg-white text-green-700";
    case "SERVICE_STARTED":
      return "bg-white text-blue-700";
    case "SERVICE_PROVIDED":
      return "bg-white text-gray-700";
    case "BOOKING_FINISHED":
      return "bg-white text-yellow-800";
    case "CANCELLED":
      return "bg-white text-red-700";
    default:
      return "bg-white text-gray-700";
  }
};

type CarCardProps = {
  image: string;
  carModel: string;
  bookingStatus: string;
  orderDetails: string;
  bookingId: string;
};

const CarCard: React.FC<CarCardProps> = ({
  image,
  carModel,
  bookingStatus,
  orderDetails,
  bookingId,
}) => {
  const showEditCancel =
    bookingStatus !== "SERVICE_STARTED" &&
    bookingStatus !== "SERVICE_PROVIDED" &&
    bookingStatus !== "BOOKING_FINISHED" &&
    bookingStatus !== "CANCELLED";
  const dispatch = useAppDispatch();
  const { feedbacks } = useAppSelector((state) => state.feedback);
  const navigate = useNavigate();

  const currentFeedback = feedbacks.find(
    (feedback) => feedback.bookingId === bookingId
  );
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const { bookings } = useAppSelector((state) => state.bookings);
  const currentBooking = bookings.find(
    (booking) => booking.bookingId === bookingId
  );
  const carId = currentBooking?.carId;

  const renderButton = () => {
    if (
      bookingStatus === "SERVICE_PROVIDED" ||
      bookingStatus === "BOOKING_FINISHED"
    ) {
      return (
        <div className="h-10 overflow-hidden border border-black-700 rounded-full">
          <div className="h-full flex items-center">
            <Button
              variant={currentFeedback ? "secondary" : "primary"}
              label={currentFeedback ? "View Feedback" : "Leave Feedback"}
              fullWidth
              onClick={() => {
                setShowFeedbackModal(true);
              }}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  return (
    <>
      <Card className="max-h-[420px] flex flex-col justify-between shadow-sm">
        <div className="relative">
          <img
            src={image}
            alt={carModel}
            className="w-full h-44 object-cover"
          />
          <div className="absolute top-3 left-3">
            <span
              className={`px-2 py-0.5 text-sm rounded-md font-medium ${getStatusBadgeStyles(
                bookingStatus
              )}`}
            >
              {bookingStatus === "Reserved by SA"
                ? "Reserved by SA"
                : bookingStatus.split("_").join(" ").slice(0, 1).toUpperCase() +
                  bookingStatus.split("_").join(" ").slice(1).toLowerCase()}
            </span>
          </div>
        </div>

        <div className="p-3 flex flex-col h-full">
          <div>
            <h3 className="text-lg font-semibold mb-1">{carModel}</h3>
            <p className="text-gray-500 text-sm mb-3">Order: {orderDetails}</p>

            {showEditCancel && (
              <div className="flex gap-1.5 mb-3 h-10 rounded-full">
                <Button
                  variant="secondary"
                  label="Cancel"
                  fullWidth
                  onClick={handleCancelClick}
                />
                <Button
                  variant="primary"
                  label="Edit"
                  fullWidth
                  onClick={() => {
                    navigate("/checkout", {
                      state: {
                        modifyBooking: true,
                        bookingId,
                        carId,
                      },
                    });
                  }}
                />
              </div>
            )}
          </div>

          {renderButton()}

          <div className="mt-auto pt-2 flex items-center gap-1 text-gray-500 text-sm">
            <span>Have any questions?</span>
            <button className="flex items-center text-gray-700 hover:text-gray-900 underline">
              Support chat <MessageSquare className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>

      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => {
          dispatch(cancelBooking(bookingId));
          setShowCancelModal(false);
        }}
      />

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        currentFeedback={currentFeedback}
        bookingId={bookingId}
        carId={carId || ""}
      />
    </>
  );
};

export default CarCard;
