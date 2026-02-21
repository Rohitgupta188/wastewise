import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  await dbConnect();
  const user = await getCurrentUser();

  const { id } = await params;

  if (!user || user.role !== "receiver") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await Order.findById(id).populate("donation");
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  order.deliveredAt = new Date();
  order.status = "delivered";
  await order.save();

  // update donation
  const donation: any = order.donation;
  donation.status = "delivered";
  await donation.save();

  return NextResponse.json({ success: true, order });
}
