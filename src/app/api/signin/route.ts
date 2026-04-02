import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyPassword, generateToken } from "@/lib/auth";
import { signinSchema } from "@/lib/validation/signin.schema";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const json = await req.json();
    const { email, password } = signinSchema.parse(json);

    
    const user = await User.findOne({ email })
      .select("+password +role +name +email +receiverType")
      .lean();

    
    if (!user) {
      return NextResponse.json(
        { error: "User not exits" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = generateToken(user._id.toString(), user.role, user.receiverType);

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          receiverType: user.receiverType
        },
      },
      { status: 200 }
    );

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      priority: "high",
    });

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid credentials format" },
        { status: 422 }
      );
    }

    console.error("Signin error:", error);

    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
