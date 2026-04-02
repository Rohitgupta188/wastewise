import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
export async function GET() {
  await dbConnect();
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    NGOStatus: user.ngoVerification?.status || "unverified",
    IndividualStatus: user.individualVerification?.emailVerified || 'false'
  });
}
