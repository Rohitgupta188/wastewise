import { z } from "zod";

const baseSchema = {
  email: z
    .email("Invalid email format")
    .transform((v) => v.toLowerCase().trim()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password too long")
    .regex(/[A-Z]/, "Must include one uppercase letter")
    .regex(/[a-z]/, "Must include one lowercase letter")
    .regex(/[0-9]/, "Must include one number"),

  name: z.string().min(2).max(50).optional(),
};

export const signupSchema = z.discriminatedUnion("role", [
  z.object({
    ...baseSchema,
    role: z.literal("donor"),
  }),

  z.object({
    ...baseSchema,
    role: z.literal("admin"),
  }),

  z.object({
    ...baseSchema,
    role: z.literal("receiver"),
    receiverType: z.enum(["ngo", "individual"]),
  }),
]);

export type SignupInput = z.infer<typeof signupSchema>;
