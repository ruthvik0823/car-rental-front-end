import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxStoreHooks";
import { CreateFeedbackPayload, FeedbackInfo } from "@/types/types";
import { postFeedback, updateFeedback } from "@/slices/feedbackSlice";
import Toast from "../common/Toast";
type FeedbackModalProps = {
  isOpen: boolean;
  bookingId: string;
  onClose: () => void;
  carId: string;
  currentFeedback: FeedbackInfo | undefined;
};

const FeedbackModal = ({
  isOpen,
  onClose,
  currentFeedback,
  bookingId,
  carId,
}: FeedbackModalProps) => {
  const dispatch = useAppDispatch();
  const [rating, setRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const user = useAppSelector((state) => state.auth.user);
  const [toastOpen, setToastOpen] = useState(false);

  // Synchronize state with currentFeedback when it changes
  useEffect(() => {
    if (currentFeedback) {
      setRating(Number(currentFeedback.rating));
      setFeedbackText(currentFeedback.feedbackText);
    }
  }, [currentFeedback]);

  const handleConfirm = () => {
    const feedbackPayload: CreateFeedbackPayload = {
      bookingId: bookingId,
      carId,
      clientId: user?.userId ? user.userId : "",
      feedbackText: feedbackText,
      rating: rating.toString(),
    };
    if (currentFeedback) {
      const payload = {
        feedbackId: currentFeedback.feedbackId,
        updatedFeedbackText: feedbackText,
        updatedRating: rating.toString(),
      };
      dispatch(updateFeedback(payload));
    } else {
      dispatch(postFeedback(feedbackPayload));
    }
    setToastOpen(true);
    onClose();
  };

  return (
    <>
      {status === "loading" && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="loader"></div>
        </div>
      )}
      {status === "failed" && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-md">
            <p className="text-red-500">
              Failed to submit feedback. Please try again.
            </p>
          </div>
        </div>
      )}

      <Modal
        open={isOpen}
        title="How was your experience?"
        onCancel={onClose}
        onConfirm={handleConfirm}
        confirmText={currentFeedback ? "Update" : "Submit"}
        cancelText={currentFeedback ? "Cancel" : "Close"}
      >
        <div className="space-y-4 text-sm text-gray-700 pt-2">
          <div>
            <p className="mb-1 font-medium">Rate your experience</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-2xl cursor-pointer ${
                    rating >= star ? "text-yellow-500" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 font-medium">Review</p>
            <textarea
              className="w-full border rounded-md p-2 text-sm"
              placeholder="Add your comment"
              rows={3}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
          </div>
        </div>
      </Modal>
      <Toast
        type="success"
        message="Feedback updated successfully!"
        subMessage="Thank you for your Feedback it was very useful!!"
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
      />
    </>
  );
};

export default FeedbackModal;
