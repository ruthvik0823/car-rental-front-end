import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../components/common/Button";
import { useState } from "react";
import Toast from "../../components/common/Toast";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxStoreHooks"; // adjust as needed
import { changePassword } from "../../slices/userSlice";

const passwordSchema = z.object({
  currentPassword: z.string().min(8, "Current password required, min 8 chars"),
  newPassword: z
    .string()
    .min(8, "New password required, min 8 chars")
    .regex(/[A-Z]/, "At least one capital letter")
    .regex(/[0-9]/, "At least one digit")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "At least one special character"),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

function ChangePasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const dispatch = useAppDispatch();
  const changePasswordResult = useAppSelector(
    (state) => state.users.changePasswordResult
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (values: PasswordFormValues) => {
    setIsSubmitting(true);

    try {
      // Get current user info from localStorage (to obtain userId)
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );
      if (!currentUser?.userId) {
        throw new Error("User not found");
      }

      // Use changePassword thunk from our redux slice
      await dispatch(
        changePassword({
          userId: currentUser.userId,
          oldPassword: values.currentPassword,
          newPassword: values.newPassword,
        })
      ).unwrap();

      // Update the currentUser in localStorage with the new password
      const updatedUser = { ...currentUser, password: values.newPassword };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      reset();
      setShowSuccessToast(true);
    } catch (error) {
      setShowFailToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toast
        type="success"
        message="Password changed"
        subMessage="Your password was updated successfully."
        isOpen={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
      <Toast
        type="error"
        message="Password change failed"
        subMessage="Your password was not updated."
        isOpen={showFailToast}
        onClose={() => setShowFailToast(false)}
      />
      <form className="max-w-2xl" onSubmit={handleSubmit(onSubmit)}>
        <section className="rounded-xl border p-6 bg-white mb-10">
          <h2 className="text-xl font-semibold mb-4">Password</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Current password</label>
              <input
                className="w-full border rounded px-3 py-2"
                type="password"
                {...register("currentPassword")}
                placeholder="Enter your password"
              />
              {errors.currentPassword && (
                <div className="text-red-500 text-sm">
                  {errors.currentPassword.message}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">New password</label>
              <input
                className="w-full border rounded px-3 py-2"
                type="password"
                {...register("newPassword")}
                placeholder="Create new password"
              />
              {errors.newPassword && (
                <div className="text-red-500 text-sm">
                  {errors.newPassword.message}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Min 8 chars, 1 capital letter, 1 digit, 1 special character ()
              </p>
            </div>
          </div>
        </section>
        <div className="flex justify-end">
          <Button
            type="submit"
            label={isSubmitting ? "Changing..." : "Change password"}
            isLoading={isSubmitting}
            variant="primary"
          />
        </div>
      </form>
    </>
  );
}

export default ChangePasswordForm;
