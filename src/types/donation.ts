export type DonationStatus =
  | "listed"
  | "requested"
  | "accepted"
  | "picked"
  | "delivered"
  | "cancelled"
  | "expired";

export type Donation = {
  _id: string;
  title: string;
  description?: string;
  foodType: string;
  quantity: number;
  unit: string;
  readyTime?: string;
  safeUntil?: string;
  reservedUntil?: string;
  pickupWindow?: string;
  area: string;
  photos?: string;
  status: DonationStatus;
  category?: string;
  ngo?: string;
  donorName?: string;
  urgent?: boolean;
  createdAt?: string;
};
