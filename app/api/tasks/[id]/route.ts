import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-current-user";

import {
  TeamRole,
  TaskPriority,
  TaskStatus,
} from "@/app/generated/prisma/enums";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _: Request,
  { params }: Params
) {
  const { id } = await params;

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      sprint: {
        include: {
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
      },
      assignee: {
        select: {
          id: true,
          username: true,
          fullName: true,
          email: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          username: true,
          fullName: true,
          email: true,
        },
      },
    },
  });

  if (!task) {
    return NextResponse.json(
      { error: "Task not found." },
      { status: 404 }
    );
  }

  if (!task.sprint || task.sprint.team.members.length === 0) {
  return NextResponse.json(
    { error: "Forbidden" },
    { status: 403 }
  );
}

  return NextResponse.json(task);
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task) {
    return NextResponse.json(
      { error: "Task not found." },
      { status: 404 },
    );
  }

  const membership = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId: task.teamId,
        userId: user.id,
      },
    },
  });

  if (
    !membership ||
    (membership.role !== TeamRole.OWNER &&
      membership.role !== TeamRole.ADMIN)
  ) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  const body = await req.json();

  const updated = await prisma.task.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      status: body.status as TaskStatus | undefined,
      priority: body.priority as TaskPriority | undefined,
      assigneeId: body.assigneeId,
      sprintId: body.sprintId,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: Params,
) {
  const { id } = await params;

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task) {
    return NextResponse.json(
      { error: "Task not found." },
      { status: 404 },
    );
  }

  const membership = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId: task.teamId,
        userId: user.id,
      },
    },
  });

  if (
    !membership ||
    membership.role !== TeamRole.OWNER
  ) {
    return NextResponse.json(
      {
        error:
          "Only the team owner can delete tasks.",
      },
      { status: 403 },
    );
  }

  await prisma.task.delete({
    where: { id },
  });

  return NextResponse.json({
    success: true,
  });
}