import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: "Email and OTP are required" },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    
    if (user.role !== "receiver") {
      return NextResponse.json(
        { success: false, error: "Invalid verification attempt" },
        { status: 403 },
      );
    }

    
    if (user.receiverType !== "individual") {
      return NextResponse.json(
        { success: false, error: "NGO verification requires admin approval" },
        { status: 403 },
      );
    }

    
    if (user.individualVerification?.emailVerified) {
      return NextResponse.json(
        { success: false, error: "Already verified" },
        { status: 400 },
      );
    }

    
    if (
      !user.otpCode ||
      user.otpCode !== otp ||
      !user.otpExpiresAt ||
      user.otpExpiresAt < new Date()
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired OTP" },
        { status: 400 },
      );
    }
    if (!user.individualVerification) {
      user.individualVerification = {
        emailVerified: false,
        idVerified: false,
      };
    }

    
    user.individualVerification.emailVerified = true;

    
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;

    await user.save();

    return NextResponse.json(
      { success: true, message: "Account verified successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

