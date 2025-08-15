import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const schedules = await prisma.lessonSchedule.findMany({
      where: { isAvailable: true },
      orderBy: { dayOfWeek: "asc" },
    });

    return NextResponse.json({ schedules });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
      { status: 500 }
    );
  }
}
