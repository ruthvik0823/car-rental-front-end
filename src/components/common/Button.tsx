interface ButtonProps {
  label: string;
  onClick?: () => void;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}

const Button = ({
  label,
  onClick,
  isLoading = false,
  type = "button",
  variant = "primary",
  fullWidth = false,
}: ButtonProps) => {
  const baseStyles =
    "px-4 py-3 rounded-full flex justify-center items-center transition-colors duration-300 font-medium focus:outline-none";

  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${widthClass}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
      ) : null}
      {label}
    </button>
  );
};

export default Button;
