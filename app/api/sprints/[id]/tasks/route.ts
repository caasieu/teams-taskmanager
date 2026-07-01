import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-current-user";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  req: Request,
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

  const sprint = await prisma.sprint.findUnique({
    where: {
      id,
    },
  });

  if (!sprint) {
    return NextResponse.json(
      { error: "Sprint not found." },
      { status: 404 }
    );
  }

  const body = await req.json();

  const {
    title,
    description,
    priority,
    assigneeId,
  } = body;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      priority,
      teamId: sprint.teamId,
      sprintId: id,
      assigneeId: assigneeId?.trim() ? assigneeId : null,
      createdById: user.id,
    },
  });

  return NextResponse.json(task, {
    status: 201,
  });
}