import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get instructor data
    let instructor = await prisma.instructor.findFirst({
      where: { isActive: true },
      include: {
        schedules: {
          orderBy: { dayOfWeek: "asc" },
        },
      },
    });

    if (!instructor) {
      // Create a default instructor if none exists
      const newInstructor = await prisma.instructor.create({
        data: {
          name: "Default Instructor",
          email: "instructor@rijschool.com",
          phone: "+597-123-4567",
        },
      });

      // Create default schedules for each day
      const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
      for (const day of days) {
        await prisma.lessonSchedule.create({
          data: {
            instructorId: newInstructor.id,
            dayOfWeek: day as any,
            isAvailable: true, // Make schedules available by default
            maxStudents: 5,
            startTime: "09:00",
            endTime: "17:00",
          },
        });
      }

      instructor = await prisma.instructor.findUnique({
        where: { id: newInstructor.id },
        include: {
          schedules: {
            orderBy: { dayOfWeek: "asc" },
          },
        },
      });
    }

    // Get students data
    const students = await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        registrationId: true,
        registeredAt: true,
        lessonBookings: {
          where: {
            status: { in: ["SCHEDULED", "CANCELLED"] },
            schedule: {
              instructor: {
                name: instructor?.name || "Default Instructor",
              },
            },
          },
          select: {
            id: true,
            lessonDate: true,
            status: true,
            schedule: {
              select: {
                dayOfWeek: true,
                instructor: {
                  select: { name: true },
                },
              },
            },
          },
          orderBy: { lessonDate: "asc" },
        },
      },
      orderBy: { registeredAt: "desc" },
    });

    // Get booking stats
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const [
      totalBookings,
      thisWeekBookings,
      cancelledBookings,
      completedBookings,
    ] = await Promise.all([
      prisma.lessonBooking.count({
        where: {
          schedule: {
            instructor: { name: instructor?.name || "Default Instructor" },
          },
        },
      }),
      prisma.lessonBooking.count({
        where: {
          lessonDate: { gte: startOfWeek },
          status: "SCHEDULED",
          schedule: {
            instructor: { name: instructor?.name || "Default Instructor" },
          },
        },
      }),
      prisma.lessonBooking.count({
        where: {
          status: "CANCELLED",
          schedule: {
            instructor: { name: instructor?.name || "Default Instructor" },
          },
        },
      }),
      prisma.lessonBooking.count({
        where: {
          status: "COMPLETED",
          schedule: {
            instructor: { name: instructor?.name || "Default Instructor" },
          },
        },
      }),
    ]);

    return NextResponse.json({
      instructor,
      students,
      stats: {
        totalBookings,
        thisWeekBookings,
        cancelledBookings,
        completedBookings,
      },
    });
  } catch (error) {
    console.error("Error fetching instructor data:", error);
    return NextResponse.json(
      { error: "Failed to fetch instructor data" },
      { status: 500 }
    );
  }
}
