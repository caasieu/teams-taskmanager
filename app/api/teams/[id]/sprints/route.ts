import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id: teamId } = await params;

  const member = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId: user.id,
    },
  });

  if (!member) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const sprints = await prisma.sprint.findMany({
    where: {
      teamId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(sprints);
}