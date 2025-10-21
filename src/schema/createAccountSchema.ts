import { z } from "zod";

const nameRegex = /^[A-Za-z]+$/;

export const createAccountSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "First name is required" })
      .min(3, { message: "First name must be at least 3 characters" })
      .regex(nameRegex, {
        message:
          "First name must contain only alphabets with no spaces or special characters",
      }),
    lastName: z
      .string()
      .min(1, { message: "Last name is required" })
      .regex(nameRegex, {
        message:
          "Last name must contain only alphabets with no spaces or special characters",
      }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one capital letter",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one digit",
      })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type CreateAccountFormValues = z.infer<typeof createAccountSchema>;
