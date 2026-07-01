import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-current-user";

import { SprintStatus, TeamRole } from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const {
    teamId,
    name,
    goal,
    startDate,
    endDate,
  } = await req.json();

  if (!teamId || !name || !startDate || !endDate) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const membership = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId: user.id,
      role: {
        in: [TeamRole.OWNER, TeamRole.ADMIN],
      },
    },
  });

  if (!membership) {
    return NextResponse.json(
      { error: "Forbidden." },
      { status: 403 }
    );
  }

  const sprint = await prisma.sprint.create({
    data: {
      teamId,
      name,
      goal,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: SprintStatus.PLANNED,
    },
  });

  return NextResponse.json(sprint, {
    status: 201,
  });
}