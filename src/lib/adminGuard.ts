import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  if (currentUser.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { admin: currentUser };
}
