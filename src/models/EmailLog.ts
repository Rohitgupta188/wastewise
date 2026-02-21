import mongoose from "mongoose";

const emailLogSchema = new mongoose.Schema(
  {
    to: { type: String, required: true },
    subject: String,
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    attempts: { type: Number, default: 0 },
    error: String,
    event: String, // e.g. "RECEIVER_REQUEST"
  },
  { timestamps: true }
);

export default mongoose.models.EmailLog ||
  mongoose.model("EmailLog", emailLogSchema);
