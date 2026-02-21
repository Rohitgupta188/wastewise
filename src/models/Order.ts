import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  donation: mongoose.Types.ObjectId;
  request: mongoose.Types.ObjectId;
  donor: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;

  pickupTime?: Date;
  pickedAt?: Date;
  deliveredAt?: Date;

  status:
    | "created"
    | "pickup_scheduled"
    | "picked_up"
    | "delivered"
    | "cancelled";
}

const OrderSchema = new Schema<IOrder>(
  {
    donation: { type: Schema.Types.ObjectId, ref: "Donation", required: true },
    request: { type: Schema.Types.ObjectId, ref: "Request", required: true },
    donor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },

    pickupTime: Date,
    pickedAt: Date,
    deliveredAt: Date,

    status: {
      type: String,
      enum: [
        "created",
        "pickup_scheduled",
        "picked_up",
        "delivered",
        "cancelled",
      ],
      default: "created",
    },
  },
  { timestamps: true }
);

export default (mongoose.models.Order as Model<IOrder>) ||
  mongoose.model<IOrder>("Order", OrderSchema);
