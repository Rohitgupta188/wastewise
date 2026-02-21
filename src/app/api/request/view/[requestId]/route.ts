import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Request from "@/models/Request";
import { getCurrentUser } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  await dbConnect();

  const { requestId } = await params; 
  console.log(requestId);
  

  if (!mongoose.Types.ObjectId.isValid(requestId)) {
  return NextResponse.json({ error: "Invalid request id" }, { status: 400 });
}

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const request = await Request.findById(requestId)
    .populate("donation", "title quantity unit donor")
    .populate("receiver", "name email");

  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 409 });
  }

  return NextResponse.json({ request }, { status: 200 });
}
