import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import mongoose from "mongoose";

export async function POST(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  await dbConnect();

  try {
    const currentUser = await getCurrentUser();
 
    
 

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
   const { userId } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    const body = await req.json();
    const { action } = body;

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.ngoVerification?.status !== "pending") {
      return NextResponse.json(
        { error: "Verification not in pending state" },
        { status: 400 }
      );
    }

    
    if (action === "approve") {
      user.ngoVerification.status = "verified";
      user.ngoVerification.reviewedAt = new Date();
      user.ngoVerification.reviewedBy = currentUser._id;


      await user.save();

      for (const publicId of user.ngoVerification.documents) {
        await cloudinary.uploader.destroy(publicId, {
          resource_type: "raw",
          type: "authenticated",
        });
      }

      return NextResponse.json(
        { message: "NGO verified successfully" },
        { status: 200 }
      );
    }

    
    if (action === "reject") {
      user.ngoVerification.status = "rejected";
      user.ngoVerification.reviewedAt = new Date();
      user.ngoVerification.reviewedBy = currentUser._id;

      await user.save();

      return NextResponse.json(
        { message: "NGO rejected successfully" },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("NGO Verify Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
