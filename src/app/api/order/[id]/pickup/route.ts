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
  const {id} = await params;

  if (!user || user.role !== "donor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await Order.findById(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  order.pickedAt = new Date();
  order.status = "picked_up";
  await order.save();

  return NextResponse.json({ success: true, order });
}
