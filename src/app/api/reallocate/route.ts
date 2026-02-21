import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Donation from "@/models/Donation";
import Request from "@/models/Request";

export async function POST() {
  await dbConnect();

  const now = new Date();

  // Find expired reservations
  const expiredDonations = await Donation.find({
    status: "requested",
    reservedUntil: { $lt: now },
  });

  for (const donation of expiredDonations) {
    // Reject open requests
    await Request.updateMany(
      { donation: donation._id, status: "open" },
      { status: "rejected" }
    );

    // Reopen donation
    donation.status = "listed";
    donation.reservedUntil = undefined;
    await donation.save();
  }

  return NextResponse.json({
    success: true,
    reopened: expiredDonations.length,
  });
}
