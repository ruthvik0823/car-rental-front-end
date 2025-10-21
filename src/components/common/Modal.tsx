type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onCancel: (() => void) | null;
  onConfirm: (() => void) | null;
  children?: React.ReactNode;
};

function Modal({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onCancel,
  onConfirm,
  children,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center overflow-hidden">
      <div className="bg-white rounded-lg shadow-lg max-w-xs w-full p-6 relative">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        {description && (
          <p className="text-gray-700 mb-6 text-sm">{description}</p>
        )}
        <div className="space-y-4">{children}</div> {/* Render children here */}
        <div
          className={`flex gap-2  ${
            onCancel ? "justify-end" : "justify-start"
          }`}
        >
          {onCancel && (
            <button
              className="px-4 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-black"
              onClick={onCancel}
            >
              {cancelText}
            </button>
          )}
          <button
            className={`px-4 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white ${
              onCancel ? " " : "w-full"
            }`}
            onClick={typeof onConfirm === "function" ? onConfirm : () => {}}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
