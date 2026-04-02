import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  if (currentUser.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }


  if (process.env.ADMIN_EMAIL && process.env.ADMIN_NAME) {
    if (currentUser.email !== process.env.ADMIN_EMAIL || currentUser.name !== process.env.ADMIN_NAME) {
      return {
        error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      };
    }
  }

  return { admin: currentUser };
}
