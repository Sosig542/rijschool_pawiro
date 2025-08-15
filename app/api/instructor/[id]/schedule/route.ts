import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { schedules } = await request.json();
    const instructorId = params.id;

    // Update each schedule
    for (const schedule of schedules) {
      await prisma.lessonSchedule.update({
        where: { id: schedule.id },
        data: {
          isAvailable: schedule.isAvailable,
          maxStudents: schedule.maxStudents,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating instructor schedule:", error);
    return NextResponse.json(
      { error: "Failed to update schedule" },
      { status: 500 }
    );
  }
}
