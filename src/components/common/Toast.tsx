import { useEffect, ReactNode } from "react";
import { Check, X } from "lucide-react";

interface ToastProps {
  message: string;
  subMessage?: string;
  isOpen: boolean;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
  type?: "success" | "error";
  children?: ReactNode;
}

const Toast = ({
  message,
  subMessage,
  isOpen,
  onClose,
  autoClose = true,
  autoCloseTime = 5000,
  type = "success",
  children,
}: ToastProps) => {
  useEffect(() => {
    let timer: number | undefined;
    if (isOpen && autoClose) {
      timer = window.setTimeout(() => {
        onClose();
      }, autoCloseTime);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, autoClose, autoCloseTime, onClose]);

  if (!isOpen) return null;

  const colorStyles =
    type === "success"
      ? {
          bg: "bg-green-50",
          border: "border-green-200",
          iconBg: "bg-green-500",
          title: "text-green-800",
          text: "text-green-700",
        }
      : {
          bg: "bg-red-50",
          border: "border-red-200",
          iconBg: "bg-red-500",
          title: "text-red-800",
          text: "text-red-700",
        };

  const Icon = type === "success" ? Check : X;

  return (
    <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 animate-fade-in">
      <div
        className={`${colorStyles.bg} ${colorStyles.border} border rounded-md p-4 shadow-lg`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <div
              className={`w-6 h-6 rounded-full ${colorStyles.iconBg} flex items-center justify-center`}
            >
              <Icon className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="ml-3 flex-1">
            <h3 className={`text-sm font-semibold ${colorStyles.title}`}>
              {message}
            </h3>
            {subMessage && (
              <p className={`text-sm ${colorStyles.text}`}>{subMessage}</p>
            )}
            {children && (
              <div className="mt-4 flex justify-end gap-2">{children}</div>
            )}
          </div>
          <div className="ml-auto pl-3">
            <button
              type="button"
              onClick={() => {
                console.log("Button clicked");
                onClose();
              }}
              className="inline-flex text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
