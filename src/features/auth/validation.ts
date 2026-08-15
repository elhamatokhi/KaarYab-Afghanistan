import { z } from "zod";

const passwordSchema = z
  .string({ error: "Password is required." })
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password must be 128 characters or fewer.")
  .regex(/[A-Za-z]/, "Password must include at least one letter.")
  .regex(/[0-9]/, "Password must include at least one number.");

export const loginInputSchema = z.object({
  email: z
    .string({ error: "Email is required." })
    .trim()
    .toLowerCase()
    .email("Enter a valid email address.")
    .max(160, "Email must be 160 characters or fewer."),
  password: z.string({ error: "Password is required." }).min(1, "Password is required."),
});

export const registerInputSchema = z.object({
  name: z
    .string({ error: "Name is required." })
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be 100 characters or fewer."),
  email: z
    .string({ error: "Email is required." })
    .trim()
    .toLowerCase()
    .email("Enter a valid email address.")
    .max(160, "Email must be 160 characters or fewer."),
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginInputSchema>;
export type RegisterInput = z.infer<typeof registerInputSchema>;
