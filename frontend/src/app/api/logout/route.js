import { NextResponse } from "next/server";

export async function POST(req) {
  // Clear the 'token' cookie
  try {
    const response = NextResponse.json({ message: "success" });
    // response.headers.set("set-cookie", "jwt=" + cookie[1]);
    response.headers.append(
      "Set-Cookie",
      "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    );
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
