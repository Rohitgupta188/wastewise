import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Request from "@/models/Request";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  const { id } = await params;

  const user = await getCurrentUser();
  if (!user || user.role !== "donor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action } = await req.json();
  if (!["accept", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const existingOrder = await Order.findOne({ request: id });
  if (existingOrder) {
    return NextResponse.json(
      { success:false, error: "Order is already created"},
      { status: 400 })
  }


  try {
    const request = await Request.findById(id)
      .populate("donation")
      .session(session);

    if (!request) {
      throw new Error("Request not found");
    }

    const donation: any = request.donation;

    if (donation.donor.toString() !== user._id.toString()) {
      throw new Error("Forbidden");
    }

    if (request.status !== "open") {
      throw new Error("Request already processed");
    }

    if (action === "accept") {
      request.status = "accepted";
      donation.status = "accepted";

      await request.save({ session });
      await donation.save({ session });

      await Request.updateMany(
        {
          donation: donation._id,
          _id: { $ne: request._id },
          status: "open",
        },
        { status: "rejected" },
        { session }
      );

      await Order.create(
        [
          {
            donation: donation._id,
            request: request._id,
            donor: donation.donor,
            receiver: request.receiver,
          },
        ],
        { session }
      );
    }

    if (action === "reject") {
      request.status = "rejected";
      await request.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({ success: true, request }, { status: 200 });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 400 }
    );
  }
}
