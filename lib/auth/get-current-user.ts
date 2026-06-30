import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    return null;
  }

  const sessions = await prisma.session.findMany({
    where: {
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });

  for (const session of sessions) {
    const match = await bcrypt.compare(
      sessionToken,
      session.tokenHash
    );

    if (match) {
      return session.user;
    }
  }

  return null;
}