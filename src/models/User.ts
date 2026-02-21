import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;

  role: "donor" | "receiver" | "admin";

  receiverType?: "ngo" | "individual";

  ngoVerification?: {
    status: "unverified" | "pending" | "verified" | "rejected";
    documents: string[];
    reviewedAt?: Date;
    reviewedBy?: mongoose.Types.ObjectId;
  };
  individualVerification?: {
    emailVerified: boolean;
    idVerified: boolean;
  };

  isBlacklisted: boolean;
  trustScore: number;
  weeklyRequestCount: number;
  otpCode?: string;
  otpExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true },

    name: String,

    role: {
      type: String,
      enum: ["donor", "receiver", "admin"],
      required: true,
    },

    receiverType: {
      type: String,
      enum: ["ngo", "individual"],
      required: function (this: IUser) {
        return this.role === "receiver";
      },
    },

    ngoVerification: {
      status: {
        type: String,
        enum: ["unverified", "pending", "verified", "rejected"],
        default: "unverified",
      },
      documents: [String],
      reviewedAt: Date,
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

    },

    individualVerification: {
      emailVerified: {
        type: Boolean,
        default: false,
      },
      idVerified: {
        type: Boolean,
        default: false,
      },
    },

    isBlacklisted: { type: Boolean, default: false },

    trustScore: { type: Number, default: 0 },

    weeklyRequestCount: { type: Number, default: 0 },

    otpCode: { type: String },
    otpExpiresAt: { type: Date },
  },
  { timestamps: true },
);

export default (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
