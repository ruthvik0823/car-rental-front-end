import React from "react";
import Modal from "../common/Modal";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CancelModal: React.FC<CancelModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      open={isOpen}
      title="Cancel Booking?"
      description="Are you sure you want to cancel this booking? This action cannot be undone."
      confirmText="Confirm Cancel"
      cancelText="Go Back"
      onCancel={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default CancelModal;