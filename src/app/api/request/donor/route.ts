import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Request from "@/models/Request";
import { getCurrentUser } from "@/lib/auth";


export async function GET() {
  try {
    await dbConnect();

    const user = await getCurrentUser();
    if (!user || user.role !== "donor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const requests = await Request.find()
      .populate({
        path: "donation",
        match: { donor: user._id },
      })
      .populate("receiver", "name email")
      .lean();

    const filtered = requests.filter(r => r.donation);

    return NextResponse.json({ requests: filtered });
  } catch (err) {
    console.error("DONOR REQUEST ERROR:", err);
    return NextResponse.json(
      { error: "Log in again" },
      { status: 500 }
    );
  }
}
