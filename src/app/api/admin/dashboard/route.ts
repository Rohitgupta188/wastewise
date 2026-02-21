import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { requireAdmin } from "@/lib/adminGuard";

export async function GET() {
  await dbConnect();

  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const [
      totalUsers,
      totalNgos,
      pendingNgos,
      verifiedNgos,
      rejectedNgos,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ receiverType: "ngo" }),
      User.countDocuments({ "ngoVerification.status": "pending" }),
      User.countDocuments({ "ngoVerification.status": "verified" }),
      User.countDocuments({ "ngoVerification.status": "rejected" }),
    ]);

    return NextResponse.json({
      metrics: {
        totalUsers,
        totalNgos,
        pendingNgos,
        verifiedNgos,
        rejectedNgos,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
