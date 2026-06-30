import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const sessions = await prisma.session.findMany({
    where: {
      expiresAt: { gt: new Date() },
      revokedAt: null,
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
      return NextResponse.json({ user: session.user });
    }
  }

  return NextResponse.json({ user: null }, { status: 401 });
}