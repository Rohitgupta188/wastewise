import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  await dbConnect();

  const { requestId } = await params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await Order.findOne({
    request: requestId,
  })
    .select("_id status pickupTime receiver")
    .lean();

  
  if (!order) {
    return NextResponse.json({ order: null }, { status: 200 });
  }

  
  if (
    user.role === "receiver" &&
    order.receiver.toString() !== user._id.toString()
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ order }, { status: 200 });
}
