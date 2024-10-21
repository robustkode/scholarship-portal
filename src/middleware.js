"server only";
import { cookies } from "next/headers";

import { API_URL } from "./config";

export async function middleware(req) {
  if ((await isModerator(req)) !== true) {
    // return new Response("Unauthorized", {
    //   status: 401,
    // });
    return Response.redirect(new URL("/", req.url));
  }
}

async function isModerator(req) {
  const sessionId = cookies().get("auth_session")?.value ?? null;
  if (!sessionId) return false;
  try {
    const response = await fetch(`${API_URL}/admin`, {
      headers: {
        "Content-Type": "application/json",
        cookie: `auth_session=${sessionId}`,
      },
    });
    const data = await response.json();
    return data.isModerator;
  } catch (error) {
    console.error("Failed to check moderator status:", error);
    return false;
  }
}

export const config = {
  matcher: "/admin/:path*",
};
