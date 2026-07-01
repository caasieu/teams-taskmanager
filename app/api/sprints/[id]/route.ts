import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { TeamRole } from "@/app/generated/prisma/enums";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sprint = await prisma.sprint.findUnique({
    where: { id },
    include: {
      tasks: {
        orderBy: {
          createdAt: "desc",
        },
      },
      
      team: {
        include: {
          members: {
            where: {
              userId: user.id,
            },
          },
        },
      },
    },
  });

  if (!sprint) {
    return NextResponse.json({ error: "Sprint not found." }, { status: 404 });
  }

  if (sprint.team.members.length === 0) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(sprint);
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sprint = await prisma.sprint.findUnique({
    where: { id },
  });

  if (!sprint) {
    return NextResponse.json({ error: "Sprint not found." }, { status: 404 });
  }

  const membership = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId: sprint.teamId,
        userId: user.id,
      },
    },
  });

  if (
    !membership ||
    (membership.role !== TeamRole.OWNER && membership.role !== TeamRole.ADMIN)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  const updated = await prisma.sprint.update({
    where: { id },
    data: {
      name: body.name,
      goal: body.goal,
      startDate: body.startDate,
      endDate: body.endDate,
      status: body.status,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sprint = await prisma.sprint.findUnique({
    where: { id },
  });

  if (!sprint) {
    return NextResponse.json({ error: "Sprint not found." }, { status: 404 });
  }

  const membership = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId: sprint.teamId,
        userId: user.id,
      },
    },
  });

  if (!membership || membership.role !== TeamRole.OWNER) {
    return NextResponse.json(
      { error: "Only the team owner can delete a sprint." },
      { status: 403 },
    );
  }

  await prisma.sprint.delete({
    where: { id },
  });

  return NextResponse.json({
    success: true,
  });
}
