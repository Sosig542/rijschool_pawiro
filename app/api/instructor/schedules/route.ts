import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const schedules = await prisma.lessonSchedule.findMany({
      where: { isAvailable: true },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: { dayOfWeek: "asc" },
    });

    // Get all active instructors for selection
    const instructors = await prisma.instructor.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        phone: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      schedules,
      instructors,
    });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
      { status: 500 }
    );
  }
}
