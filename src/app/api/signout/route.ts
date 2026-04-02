import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: 'Signed out successfully' },
    { status: 200 }
  )

    response.cookies.set({
    name: "auth_token",
    value: "",
    expires: new Date(0),
    path: "/",
  });

  return response
}
