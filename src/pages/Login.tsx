import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signIn } from "../slices/authSlice";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";
import Toast from "../components/common/Toast";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxStoreHooks";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status, error, user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // Redirect back to the original page or home

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const result = await dispatch(signIn(data));
    if (signIn.fulfilled.match(result)) {
      setShowSuccessToast(true);
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 2000);
    } else {
      setShowFailToast(true);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Success Toast */}
      <Toast
        type="success"
        isOpen={showSuccessToast}
        onClose={() => {
          console.log("Success toast closed");
          setShowSuccessToast(false);
        }}
        message="Login Successful!"
        subMessage={`Welcome back, ${user?.firstName || "User"}!`}
      />

      {/* Error Toast */}
      <Toast
        type="error"
        isOpen={showFailToast}
        onClose={() => {
          setShowFailToast(false);
        }}
        message="Error!"
        subMessage={error || "Incorrect Email or password!"}
      />

      <div className="hidden md:block md:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2070&auto=format&fit=crop"
          alt="Car with scenic sunset view"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Log in</h1>
          <p className="text-gray-600 mb-8">Glad to see you again</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="Write your email"
              register={register}
              error={errors.email}
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Write your password"
              register={register}
              error={errors.password}
            />
            <p className="text-xs text-gray-500 -mt-4">
              Minimum 8 characters with at least 1 capital letter, 1 special
              character and 1 digit
            </p>

            <div className="pt-4">
              <Button
                type="submit"
                label={status === "loading" ? "Logging in..." : "Login"}
                isLoading={status === "loading"}
                fullWidth
              />
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              New here?{" "}
              <Link to="/create-account" className="text-black font-medium">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
