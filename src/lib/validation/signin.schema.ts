import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .string()
    .email("Invalid email")
    .transform(v => v.toLowerCase().trim()),

  password: z
    .string()
    .min(1, "Password is required")
    .max(72),
});

export type SigninInput = z.infer<typeof signinSchema>;
