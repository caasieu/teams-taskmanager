import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-current-user";

import { TeamRole } from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { name, description } = body;

  if (!name?.trim()) {
    return NextResponse.json(
      { error: "Team name is required." },
      { status: 400 },
    );
  }

  const team = await prisma.$transaction(async (tx) => {
    const createdTeam = await tx.team.create({
      data: {
        name,
        description,
      },
    });

    await tx.teamMember.create({
      data: {
        teamId: createdTeam.id,
        userId: user.id,
        role: TeamRole.OWNER,
      },
    });

    return createdTeam;
  });

  return NextResponse.json(team, {
    status: 201,
  });
}

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const teams = await prisma.team.findMany({
    where: {
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
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(teams);
}
