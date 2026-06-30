import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (sessionToken) {
    const sessions = await prisma.session.findMany();

    for (const session of sessions) {
      const bcrypt = await import("bcrypt");
      const match = await bcrypt.compare(sessionToken, session.tokenHash);

      if (match) {
        await prisma.session.update({
          where: { id: session.id },
          data: { revokedAt: new Date() },
        });
        break;
      }
    }
  }

  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set("session", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}