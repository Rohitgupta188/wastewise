import { User } from "../types/user";

export function canRequestFood(user: User): boolean {
  if (user.isBlacklisted) return false;

  if (user.role !== "receiver") return false;
  
  if (user.receiverType === "individual") {
    return user.phoneVerified === true;
  }

  if (user.receiverType === "ngo") {
    return user.ngoVerificationStatus === "verified";
  }

  return false;
}
