import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lessonId = params.id;

    // Update the lesson status to completed
    await prisma.lessonBooking.update({
      where: { id: lessonId },
      data: { status: "COMPLETED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error completing lesson:", error);
    return NextResponse.json(
      { error: "Failed to complete lesson" },
      { status: 500 }
    );
  }
}
