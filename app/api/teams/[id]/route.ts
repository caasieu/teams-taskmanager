import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { TeamRole } from "@/app/generated/prisma/enums";

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

  const { id } = await params;

  const team = await prisma.team.findFirst({
    where: {
      id,
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              email: true,
            },
          },
        },
      },
      sprints: true,
      tasks: true,
    },
  });

  if (!team) {
    return NextResponse.json(
      { error: "Team not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(team);
}

export async function DELETE(
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

  const { id } = await params;

  const owner = await prisma.teamMember.findFirst({
    where: {
      teamId: id,
      userId: user.id,
      role: TeamRole.OWNER,
    },
  });

  if (!owner) {
    return NextResponse.json(
      { error: "Only the team owner can delete this team." },
      { status: 403 }
    );
  }

  await prisma.team.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({
    message: "Team deleted successfully.",
  });
}