import { adminRole, moderatorRole } from "@/config";
import { validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req) {
  const session = await validateRequest();
  let isModerator = false;
  if (session && session.user) {
    try {
      const user = session.user;
      isModerator = user.role === moderatorRole || user.role === adminRole;
    } catch (error) {
      console.error("Error determining moderator status:", error);
    }
  }

  return new Response(JSON.stringify({ isModerator }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
