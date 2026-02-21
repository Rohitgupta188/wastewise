import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  await dbConnect();

  const {id} = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "receiver") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { pickupTime } = await req.json();

  const order = await Order.findById(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.receiver.toString() !== user._id.toString()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  order.pickupTime = new Date(pickupTime);
  order.status = "pickup_scheduled";
  await order.save();

  return NextResponse.json({ success: true, order });
}
