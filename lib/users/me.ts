import { cache } from "react";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const getMe = cache(async () => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) return null;

  const sessions = await prisma.session.findMany({
    where: {
      expiresAt: { gt: new Date() },
      revokedAt: null,
    },
    include: { user: true },
  });

  for (const session of sessions) {
    const match = await bcrypt.compare(sessionToken, session.tokenHash);

    if (match) {
      return session.user;
    }
  }

  return null;
});