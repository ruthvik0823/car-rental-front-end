import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import ProfileAvatarCard from "../../components/profile/ProfileAvatarCard";
import Toast from "../../components/common/Toast";
import Button from "../../components/common/Button";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxStoreHooks"; // adjust the path as needed
import { updateUserPersonalInfo } from "../../slices/userSlice";
import { PersonalInfo } from "../../types/types";
import { updateUser } from "@/slices/authSlice";

const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "Required" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name must not contain numbers or special characters",
    }),
  lastName: z
    .string()
    .min(1, { message: "Required" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Surname must not contain numbers or special characters",
    }),
  phone: z
    .string()
    .min(10, { message: "Phone number must have at least 10 digits" })
    .max(15, { message: "Phone number must not exceed 15 digits" })
    .regex(/^[+0-9\s\-()]+$/, { message: "Invalid phone number" }),
  country: z.string(),
  city: z.string(),
  street: z.string(),
  postalCode: z.string(),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

function PersonalInfoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const dispatch = useAppDispatch();

  // Get the current user details from redux store (userSlice)
  const userDetails = useAppSelector((state) => state.users.userDetails);
  const user = useAppSelector((state) => state.auth.user);
  console.log(userDetails);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: userDetails?.phone || "",
      country: userDetails?.country || "",
      city: userDetails?.city || "",
      street: userDetails?.street || "",
      postalCode: userDetails?.postalCode || "",
    },
  });

  const onSubmit = async (values: PersonalInfoFormValues) => {
    setIsSubmitting(true);
    const updatedInfo: PersonalInfo = {
      clientId: userDetails?.clientId || "",
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      country: values.country,
      city: values.city,
      street: values.street,
      postalCode: values.postalCode,
      // Added missing properties from userDetails
      imageUrl: userDetails?.imageUrl,
      email: userDetails?.email || "",
      role: userDetails?.role || "CLIENT",
    };

    console.log("Updated Info:", updatedInfo);

    try {
      await dispatch(updateUserPersonalInfo(updatedInfo));
      setShowSuccessToast(true);
      const existingUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );
      // Merge the existing user with updated profile fields
      const updatedUser = {
        ...existingUser,
        firstName: values.firstName,
        lastName: values.lastName,
        // if the phone or address fields are stored in currentUser, update them as well:
        phone: values.phone,
        address: {
          ...existingUser.address,
          country: values.country,
          city: values.city,
          street: values.street,
          postalCode: values.postalCode,
        },
      };

      // Update localStorage with the updated user information
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      reset(values);
    } catch (error) {
      console.error("Failed to update personal info", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchUserDetailsIfNeeded = async () => {
      if (userDetails) {
        reset({
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          phone: userDetails.phone,
          country: userDetails.country,
          city: userDetails.city,
          street: userDetails.street,
          postalCode: userDetails.postalCode,
        });
      }
      const updatedAuthUserInfo = {
        userId: userDetails?.clientId || "",

        email: userDetails?.email || " ",
        firstName: userDetails?.firstName || "",
        lastName: userDetails?.lastName || "",
      };
      console.log("Updated Auth User Info:", updatedAuthUserInfo);

      await dispatch(updateUser(updatedAuthUserInfo));
    };
    fetchUserDetailsIfNeeded();
  }, [userDetails, reset, dispatch]);

  return (
    <>
      <Toast
        type="success"
        message="Profile updated!"
        subMessage="Your profile info was updated successfully."
        isOpen={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
      <form className="max-w-2xl space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <ProfileAvatarCard />

        <section className="rounded-xl border p-6 bg-white mb-6">
          <h2 className="text-xl font-semibold mb-4">Personal info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Name</label>
              <input
                className="w-full border rounded px-3 py-2"
                {...register("firstName")}
              />
              {errors.firstName && (
                <div className="text-red-500 text-sm">
                  {errors.firstName.message}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Surname</label>
              <input
                className="w-full border rounded px-3 py-2"
                {...register("lastName")}
              />
              {errors.lastName && (
                <div className="text-red-500 text-sm">
                  {errors.lastName.message}
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Phone</label>
              <input
                className="w-full border rounded px-3 py-2"
                {...register("phone")}
              />
              {errors.phone && (
                <div className="text-red-500 text-sm">
                  {errors.phone.message}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-xl border p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Country</label>
              <input
                className="w-full border rounded px-3 py-2"
                {...register("country")}
              />
              {errors.country && (
                <div className="text-red-500 text-sm">
                  {errors.country.message}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">City</label>
              <input
                className="w-full border rounded px-3 py-2"
                {...register("city")}
              />
              {errors.city && (
                <div className="text-red-500 text-sm">
                  {errors.city.message}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Street</label>
              <input
                className="w-full border rounded px-3 py-2"
                {...register("street")}
              />
              {errors.street && (
                <div className="text-red-500 text-sm">
                  {errors.street.message}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Postal code</label>
              <input
                className="w-full border rounded px-3 py-2"
                {...register("postalCode")}
              />
              {errors.postalCode && (
                <div className="text-red-500 text-sm">
                  {errors.postalCode.message}
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <Button
            type="submit"
            label={isSubmitting ? "Saving..." : "Save changes"}
            isLoading={isSubmitting}
            variant="primary"
          />
        </div>
      </form>
    </>
  );
}

export default PersonalInfoForm;
