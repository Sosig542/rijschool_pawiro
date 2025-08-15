import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { studentId, lessonDate } = await request.json();

    // Validate the request
    if (!studentId || !lessonDate) {
      return NextResponse.json(
        { error: "Student ID and lesson date are required" },
        { status: 400 }
      );
    }

    // Check if student exists and has passed theory
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { theoryStatus: true },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    if (student.theoryStatus !== "GESLAAGD") {
      return NextResponse.json(
        {
          error:
            "Student must pass theory exam before booking practical lessons",
        },
        { status: 400 }
      );
    }

    // Check if the date is valid and available
    const lessonDateTime = new Date(lessonDate);
    const dayOfWeek = lessonDateTime.getDay();

    // Only allow Monday-Friday (1-5, where 0 is Sunday)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return NextResponse.json(
        { error: "Lessons can only be booked on weekdays (Monday-Friday)" },
        { status: 400 }
      );
    }

    const dayName = lessonDateTime
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();

    const schedule = await prisma.lessonSchedule.findFirst({
      where: {
        dayOfWeek: dayName as any,
        isAvailable: true,
      },
      include: {
        bookings: {
          where: {
            lessonDate: {
              gte: new Date(lessonDate + "T00:00:00"),
              lt: new Date(lessonDate + "T23:59:59"),
            },
          },
        },
      },
    });

    if (!schedule) {
      return NextResponse.json(
        { error: "No instructor available on this day" },
        { status: 400 }
      );
    }

    // Check if max students limit is reached
    if (schedule.bookings.length >= schedule.maxStudents) {
      return NextResponse.json(
        { error: "Maximum number of students already booked for this day" },
        { status: 400 }
      );
    }

    // Check if student already has a lesson on this date
    const existingBooking = await prisma.lessonBooking.findFirst({
      where: {
        studentId,
        lessonDate: {
          gte: new Date(lessonDate + "T00:00:00"),
          lt: new Date(lessonDate + "T23:59:59"),
        },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Student already has a lesson booked on this date" },
        { status: 400 }
      );
    }

    // Create the lesson booking
    const booking = await prisma.lessonBooking.create({
      data: {
        studentId,
        scheduleId: schedule.id,
        lessonDate: lessonDateTime,
        status: "SCHEDULED",
      },
    });

    return NextResponse.json({
      success: true,
      booking,
      message: "Lesson booked successfully",
    });
  } catch (error) {
    console.error("Error booking lesson:", error);
    return NextResponse.json(
      { error: "Failed to book lesson" },
      { status: 500 }
    );
  }
}
