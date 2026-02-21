import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDonation extends Document {
  donor: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  foodType: string;
  quantity: number;
  unit: "kg" | "plates" | "packs" | string;
  readyTime: Date;
  safeUntil: Date;
  reservedUntil?: Date;
  pickupWindow: string;
  area: string;
  photos?: string;
  status:
    | "listed"
    | "requested"
    | "accepted"
    | "picked"
    | "delivered"
    | "cancelled"
    | "expired";
  createdAt: Date;
  updatedAt: Date;
}

const DonationSchema = new Schema<IDonation>(
  {
    donor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: String,
    foodType: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: {
      type: String,
      default: "kg",
    },
    readyTime: { type: Date, required: true },
    safeUntil: { type: Date, required: true },
    reservedUntil: { type: Date },
    pickupWindow: String,
    area: { type: String, required: true },
    photos: String,
    status: {
      type: String,
      enum: [
        "listed",
        "requested",
        "accepted",
        "picked",
        "delivered",
        "cancelled",
        "expired",
      ],
      default: "listed",
    },
  },
  { timestamps: true },
);

DonationSchema.index({ status: 1, safeUntil: 1 }); // for cleanup of expired

export default (mongoose.models.Donation as Model<IDonation>) ||
  mongoose.model<IDonation>("Donation", DonationSchema);
