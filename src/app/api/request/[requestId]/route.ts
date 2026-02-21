import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Request from "@/models/Request";
import { getCurrentUser } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ requestId: string }> },
) {
  await dbConnect();

  const user = await getCurrentUser();
  if (!user || user.role !== "donor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  
  const { requestId } = await context.params;

  console.log(requestId);

  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    return NextResponse.json({ error: "Invalid request ID" }, { status: 400 });
  }

  const request = await Request.findById(requestId)
    .populate("donation")
    .populate("receiver", "name email");

  if (!request) {
    return NextResponse.json(
      { error: "Request data not found" },
      { status: 404 },
    );
  }

  const donation: any = request.donation;

  if (donation.donor.toString() !== user._id.toString()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ request });
}
