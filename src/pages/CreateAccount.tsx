import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../slices/authSlice";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";
import {
  createAccountSchema,
  type CreateAccountFormValues,
} from "../schema/createAccountSchema";
import Toast from "../components/common/Toast";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxStoreHooks";

const CreateAccount = () => {
  const [successToastOpen, setSuccessToastOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);
  const [FailToastOpen, setFailToastOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: CreateAccountFormValues) => {
    const result = await dispatch(
      signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      })
    );

    if (signUp.fulfilled.match(result)) {
      setSuccessToastOpen(true);
      setTimeout(() => {
        navigate("/login", {
          state: { showSuccessToast: true },
        });
      }, 2000);
    } else if (signUp.rejected.match(result)) {
      setError("email", {
        type: "manual",
        message: result.payload || "An error occurred during registration.",
      });
      setFailToastOpen(true);
      setTimeout(() => {
        setFailToastOpen(false);
      }, 2000);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Car Image */}
      <div className="hidden md:block md:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2070&auto=format&fit=crop"
          alt="Car with scenic sunset view"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Create an account
          </h1>
          <p className="text-gray-600 mb-8">
            Enter your details below to get started
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <InputField
                  label="Name"
                  name="firstName"
                  placeholder="Write your name"
                  register={register}
                  error={errors.firstName}
                />
              </div>
              <div className="flex-1">
                <InputField
                  label="Surname"
                  name="lastName"
                  placeholder="Write your surname"
                  register={register}
                  error={errors.lastName}
                />
              </div>
            </div>

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
              placeholder="Create password"
              register={register}
              error={errors.password}
            />
            <p className="text-xs text-gray-500 -mt-4 mb-4">
              Minimum 8 characters with at least one capital letter, one special
              character and one digit
            </p>

            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              register={register}
              error={errors.confirmPassword}
            />

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                label="Cancel"
                variant="secondary"
                fullWidth
                onClick={() => {
                  reset();
                }}
              />
              <Button
                type="submit"
                label={status === "loading" ? "Registering..." : "Register"}
                isLoading={status === "loading"}
                fullWidth
              />
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already here?{" "}
              <Link to="/login" className="text-black font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Render SuccessToast */}
      {successToastOpen && (
        <Toast
          type="success"
          isOpen={successToastOpen}
          onClose={() => setSuccessToastOpen(false)}
          message="Congratulations!"
          subMessage="Your account has been created successfully!"
        />
      )}

      {/* Render ErrorToast */}
      {errors && FailToastOpen && (
        <Toast
          type="error"
          isOpen={FailToastOpen}
          onClose={() => {
            setFailToastOpen(false);
          }}
          message="Error!"
          subMessage={error || "An error occurred during registration."}
        />
      )}
    </div>
  );
};

export default CreateAccount;
