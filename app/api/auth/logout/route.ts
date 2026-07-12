import { NextResponse } from "next/server";
import { AUTH_COOKIE, REFRESH_COOKIE, USER_COOKIE } from "@/lib/constants";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(AUTH_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
  response.cookies.delete(USER_COOKIE);
  return response;
}
