import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { smsService } from "@/lib/smsService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify instructor authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "INSTRUCTOR") {
      return NextResponse.json(
        { error: "Unauthorized - Instructor access required" },
        { status: 401 }
      );
    }

    const bookingId = params.id;

    // Get the booking with student and schedule information
    const booking = await prisma.lessonBooking.findUnique({
      where: { id: bookingId },
      include: {
        student: {
          select: {
            name: true,
            contact: true,
          },
        },
        schedule: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // For now, allow any instructor to cancel any booking since we're using a default instructor
    // In a real app, you would check if the instructor owns this schedule
    // if (booking.schedule.instructor.id !== session.user.id) {
    //   return NextResponse.json(
    //     { error: "Unauthorized - You can only cancel your own bookings" },
    //     { status: 403 }
    //   );
    // }

    // Check if booking can be cancelled (not completed)
    if (booking.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Cannot cancel completed lessons" },
        { status: 400 }
      );
    }

    // Update booking status to cancelled
    const updatedBooking = await prisma.lessonBooking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });

    // Send SMS notification if student has contact info
    if (booking.student.contact) {
      const lessonDate = new Date(booking.lessonDate).toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

      await smsService.sendCancellationNotification(
        booking.student.contact,
        lessonDate,
        session.user.name || "Instructor"
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
