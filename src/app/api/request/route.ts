import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Request from "@/models/Request";
import Donation from "@/models/Donation";
import { IUser } from "@/models/User";
import { getCurrentUser } from "@/lib/auth";
import { notifyDonorOnRequest } from "@/services/notification.service";

export async function POST(req: NextRequest) {
  await dbConnect();

  const user = await getCurrentUser();
  if (!user || user.role !== "receiver") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    user.role === "receiver" &&
    user.receiverType === "ngo" &&
    user.ngoVerification?.status !== "verified"
  ) {
    return NextResponse.json(
      { error: "NGO not verified yet" },
      { status: 403 },
    );
  }

  const { donationId, quantityRequested, message } = await req.json();

  const donation = await Donation.findById(donationId).populate<{
    donor: IUser;
  }>("donor");

  if (!donation || donation.status !== "listed") {
    return NextResponse.json(
      { error: "Donation not available" },
      { status: 400 },
    );
  }

  const request = await Request.create({
    donation: donation._id,
    receiver: user._id,
    quantityRequested,
    message,
  });

  donation.status = "requested";
  donation.reservedUntil = new Date(Date.now() + 60 * 60 * 1000);
  await donation.save();

  try {
    await notifyDonorOnRequest({
      donorEmail: donation.donor.email,
      donorName: donation.donor.name,
      receiverName: user.name,
      foodName: donation.title,
      quantity: request.quantityRequested,
    });
  } catch (error) {
    console.error("Email sending failed:", error);
  }

  return NextResponse.json({ request }, { status: 201 });
}
