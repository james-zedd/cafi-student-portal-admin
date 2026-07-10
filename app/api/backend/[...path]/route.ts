import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth";

async function proxyRequest(
  request: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const backendUrl = process.env.BACKEND_API_URL;
  if (!backendUrl) {
    return NextResponse.json(
      { error: "BACKEND_API_URL is not configured" },
      { status: 500 }
    );
  }

  const token = await getAuthToken();
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { path } = await ctx.params;
  const url = new URL(`${backendUrl}/${path.join("/")}`);
  url.search = request.nextUrl.search;

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const init: RequestInit & { duplex?: "half" } = {
    method: request.method,
    headers,
    body: hasBody ? request.body : undefined,
    duplex: hasBody ? "half" : undefined,
  };

  let backendResponse: Response;
  try {
    backendResponse = await fetch(url, init);
  } catch {
    return NextResponse.json(
      { error: "Could not reach the backend" },
      { status: 502 }
    );
  }

  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: {
      "Content-Type":
        backendResponse.headers.get("content-type") ?? "application/json",
    },
  });
}

export {
  proxyRequest as GET,
  proxyRequest as POST,
  proxyRequest as PUT,
  proxyRequest as PATCH,
  proxyRequest as DELETE,
};
