import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { TeamRole } from "@/app/generated/prisma/enums";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id: teamId } = await params;
  const { username } = await req.json();

  const membership = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId: currentUser.id,
      role: {
        in: [TeamRole.OWNER, TeamRole.ADMIN],
      },
    },
  });

  if (!membership) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found." },
      { status: 404 }
    );
  }

  const exists = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId: user.id,
      },
    },
  });

  if (exists) {
    return NextResponse.json(
      { error: "User is already a member." },
      { status: 409 }
    );
  }

  const member = await prisma.teamMember.create({
    data: {
      teamId,
      userId: user.id,
      role: TeamRole.MEMBER,
    },
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
  });

  return NextResponse.json(member, {
    status: 201,
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id: teamId } = await params;
  const { username } = await req.json();

  const membership = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId: currentUser.id,
      role: {
        in: [TeamRole.OWNER, TeamRole.ADMIN],
      },
    },
  });

  if (!membership) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found." },
      { status: 404 }
    );
  }

  await prisma.teamMember.delete({
    where: {
      teamId_userId: {
        teamId,
        userId: user.id,
      },
    },
  });

  return NextResponse.json({
    message: "Member removed successfully.",
  });
}