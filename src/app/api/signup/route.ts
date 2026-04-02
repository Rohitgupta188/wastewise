import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { signupSchema } from "@/lib/validation/signup.scheme";
import { ZodError } from "zod";
import { generateOtp } from "@/lib/generateOtp";
import { sendOtpVerificationEmail } from "@/services/notification.service";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const json = await req.json();
    const data = signupSchema.parse(json);

    if (data.role === "receiver" && !data.receiverType) {
      return NextResponse.json(
        { success: false, error: "Receiver type required" },
        { status: 400 },
      );
    }
    const existingUser = await User.exists({ email: data.email });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 },
      );
    }

    const hashedPassword = await hashPassword(data.password);

    let otpCode: string | undefined;
    let otpExpiresAt: Date | undefined;

    if (data.role === "receiver" && data.receiverType === "individual") {
      otpCode = generateOtp();
      otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    }


    const user = await User.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role,
      receiverType: data.role === "receiver" ? data.receiverType : undefined,
      otpCode,
      otpExpiresAt,
    });

    if (otpCode) {
      sendOtpVerificationEmail({
        email: user.email,
        name: user.name,
        otp: otpCode,
      }).catch(console.error);
    }

    return NextResponse.json(
      {
        success: true,
        userId: user._id.toString(),
        role: user.role,
        receiverType: user.receiverType ?? null,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          fields: error.flatten().fieldErrors,
        },
        { status: 422 },
      );
    }

    if ((error as any)?.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
