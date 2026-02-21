import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { requireAdmin } from "@/lib/adminGuard";
import cloudinary from "@/lib/cloudinary";

function generateSignedUrl(publicId: string) {
  return cloudinary.url(publicId, {
    resource_type: "raw",
    type: "authenticated",
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 300,
  });
}

export async function GET(req: NextRequest) {
  await dbConnect();

  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      User.find({
        receiverType: "ngo",
        "ngoVerification.status": "pending",
      })
        .select("name email ngoVerification createdAt")
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments({
        receiverType: "ngo",
        "ngoVerification.status": "pending",
      }),
    ]);

    const formatted = requests.map((ngo) => ({
      _id: ngo._id,
      name: ngo.name,
      email: ngo.email,
      submittedAt: ngo.createdAt,
      documents: ngo.ngoVerification!.documents.map((id: string) =>
        generateSignedUrl(id)
      ),
    }));

    return NextResponse.json({
      data: formatted,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("NGO Requests Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
