export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Donation from "@/models/Donation";
import { uploadBufferToCloudinary } from "@/lib/uploadToCloudinary";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const user = await getCurrentUser();

    if (!user || user.role !== "donor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const foodType = formData.get("foodType") as string;
    const quantity = Number(formData.get("quantity"));
    const unit = (formData.get("unit") as string) || "kg";
    const area = formData.get("area") as string;
    const pickupWindow = (formData.get("pickupWindow") as string) || "";
    const description = (formData.get("description") as string) || "";

    const readyTimeRaw = formData.get("readyTime") as string;
    const safeUntilRaw = formData.get("safeUntil") as string;

    if (!title || !foodType || !area || !readyTimeRaw || !safeUntilRaw) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const readyTime = new Date(readyTimeRaw);
    const safeUntil = new Date(safeUntilRaw);

    if (isNaN(readyTime.getTime()) || isNaN(safeUntil.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 },
      );
    }

    const files = formData.getAll("photos");
    let photoUrls: string = "";

    for (const item of files) {
      if (!(item instanceof File) || item.size === 0) continue;

      const bytes = await item.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const url = await uploadBufferToCloudinary(buffer);
      photoUrls = url;
    }
    console.log(user._id);
    console.log(new mongoose.Types.ObjectId(user._id));

    const donation = await Donation.create({
      donor: user._id,
      title,
      foodType,
      quantity,
      unit,
      readyTime,
      safeUntil,
      pickupWindow,
      area,
      description,
      photos: photoUrls,
      status: "listed",
    });

    return NextResponse.json(
      {
        success: true,
        donation: {
          id: donation._id,
          title: donation.title,
          quantity: donation.quantity,
          status: donation.status,
          photos: donation.photos,
          createdAt: donation.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/donation error:", error);
    return NextResponse.json(
      { error: "Failed to create donation" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await dbConnect();

    const user = await getCurrentUser();

    if (!user || user.role !== "donor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const donations = await Donation.find({
      donor: user._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ donations }, { status: 200 });
  } catch (error) {
    console.error("GET /api/donation error:", error);
    return NextResponse.json(
      { error: "Failed to fetch donations" },
      { status: 500 },
    );
  }
}
