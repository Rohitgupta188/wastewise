import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";
import { uploadBufferToCloudinaryForNgo } from "@/lib/uploadBufferToCloudinaryForNgo";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.role !== "receiver" || currentUser.receiverType !== "ngo") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    if (
      currentUser.ngoVerification?.status === "pending" ||
      currentUser.ngoVerification?.status === "verified"
    ) {
      return NextResponse.json(
        { error: "Verification already submitted" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("documents") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "At least one document is required" },
        { status: 400 }
      );
    }

    if (files.length > 5) {
      return NextResponse.json(
        { error: "Maximum 5 documents allowed" },
        { status: 400 }
      );
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const uploadedPublicIds: string[] = [];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Only PDF and images allowed." },
          { status: 400 }
        );
      }

      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: "File size exceeds 5MB limit." },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const publicId = await uploadBufferToCloudinaryForNgo(
        buffer,
        file.name
      );

      uploadedPublicIds.push(publicId);
    }

    const dbUser = await User.findById(currentUser._id);

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    dbUser.ngoVerification = {
      status: "pending",
      documents: uploadedPublicIds, 
      reviewedAt: undefined,
      reviewedBy: undefined,
    };

    await dbUser.save();

    return NextResponse.json(
      { message: "Verification submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("NGO Verification Error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

