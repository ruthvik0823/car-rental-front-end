import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  UseFormRegister,
  FieldError,
  Path,
  FieldValues,
} from "react-hook-form";

type InputFieldProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  required?: boolean;
};

const InputField = <T extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
}: InputFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-gray-700 text-sm font-medium mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          type={inputType}
          placeholder={placeholder}
          className={`w-full p-3 border rounded-md focus:outline-none focus:border-gray-400 ${
            error ? "border-red-500" : "border-gray-200"
          }`}
          {...register(name)}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff size={18} className="text-gray-500" />
            ) : (
              <Eye size={18} className="text-gray-500" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
};

export default InputField;
