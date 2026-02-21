import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Donation from "@/models/Donation";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();

    const user = await getCurrentUser();

    if (!user || user.role == "donor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const donations = await Donation.find({ status: "listed" }) // receivers only see available food
      
      


    return NextResponse.json({ donations }, { status: 200 });
  } catch (error) {
    console.error("Receiver donation fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch donations" },
      { status: 500 }
    );
  }
}
