export type ReceiverType = "ngo" | "individual";

export type VerificationStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "rejected";

export type User = {
  _id: string;
  role: "donor" | "receiver" | "admin";

  receiverType?: ReceiverType;

  ngoVerificationStatus?: VerificationStatus;

  phoneVerified?: boolean;
  idVerified?: boolean;

  trustScore: number;
  isBlacklisted: boolean;
};
