import { NextResponse } from "next/server";
import { AUTH_COOKIE, REFRESH_COOKIE, USER_COOKIE } from "@/lib/constants";

// TODO: adjust the path and payload shape to match the backend's login endpoint.
const LOGIN_PATH = "/api/auth";

export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_API_URL;
  if (!backendUrl) {
    return NextResponse.json(
      { error: "BACKEND_API_URL is not configured" },
      { status: 500 }
    );
  }

  const credentials = await request.json();

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${backendUrl}${LOGIN_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the backend" },
      { status: 502 }
    );
  }

  const data = await backendResponse.json().catch(() => null);

  if (!backendResponse.ok) {
    return NextResponse.json(
      { error: data?.message ?? data?.error ?? "Invalid email or password" },
      { status: backendResponse.status }
    );
  }

  const token = data?.token ?? data?.accessToken ?? data?.access_token;
  if (!token) {
    return NextResponse.json(
      { error: "Backend response did not include a token" },
      { status: 502 }
    );
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  } as const;

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, token, cookieOptions);
  if (data?.refreshToken) {
    response.cookies.set(REFRESH_COOKIE, data.refreshToken, cookieOptions);
  }
  if (data?.user) {
    response.cookies.set(USER_COOKIE, JSON.stringify(data.user), cookieOptions);
  }
  return response;
}
