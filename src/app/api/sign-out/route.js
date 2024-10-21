import { lucia, validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export async function GET() {
    const {session} = await validateRequest()
    if (!session) {
        redirect("/sign-in")
    }
    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        session.attributes
    )
    redirect("/sign-up")
}