import { z } from "zod";

export const donationCreateSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(500).optional(),
  foodType: z.string().min(2),
  quantity: z.number().positive(),
  unit: z.enum(["kg", "plates", "packs"]),
  readyTime: z.string(),
  safeUntil: z.string(),
  pickupWindow: z.string(),
  area: z.string().min(2),
  photos: z.array(z.string().url()).optional(),
});

export type DonationCreateInput = z.infer<typeof donationCreateSchema>;
