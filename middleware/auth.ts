import { auth } from "@clerk/nextjs/server"

export async function requireAdmin() {
    const { userId, sessionClaims } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const role = (sessionClaims?.metadata as { role?: string })?.role;

    if (role !== "admin") throw new Error("Unauthorized");
}