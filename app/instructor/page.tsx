import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import InstructorSchedule from "@/app/components/InstructorSchedule";
import InstructorStudents from "@/app/components/InstructorStudents";

async function getInstructorData() {
  // For now, we'll use a default instructor - in a real app, this would be based on authentication
  const instructor = await prisma.instructor.findFirst({
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
          isAvailable: false,
          maxStudents: 5,
          startTime: "09:00",
          endTime: "17:00",
        },
      });
    }

    return await prisma.instructor.findUnique({
      where: { id: newInstructor.id },
      include: {
        schedules: {
          orderBy: { dayOfWeek: "asc" },
        },
      },
    });
  }

  return instructor;
}

async function getStudentsData() {
  const students = await prisma.student.findMany({
    select: {
      id: true,
      name: true,
      registrationId: true,
      registeredAt: true,
      theoryStatus: true,
      practicalStatus: true,
      theoryExamAt: true,
      practicalExamAt: true,
      lessonBookings: {
        where: { status: "SCHEDULED" },
        select: {
          lessonDate: true,
          schedule: {
            select: { dayOfWeek: true },
          },
        },
      },
      documents: {
        select: {
          type: true,
          isSubmitted: true,
        },
      },
    },
    orderBy: { registeredAt: "desc" },
  });

  return students;
}

export default async function InstructorPage() {
  const [instructor, students] = await Promise.all([
    getInstructorData(),
    getStudentsData(),
  ]);

  if (!instructor) return notFound();

  return (
    <main className="space-y-6">
      <div className="bg-white border rounded p-4">
        <h1 className="text-2xl font-semibold mb-2">Instructor Dashboard</h1>
        <div className="text-sm text-gray-600">
          <p>Name: {instructor.name}</p>
          <p>Email: {instructor.email}</p>
          {instructor.phone && <p>Phone: {instructor.phone}</p>}
        </div>
      </div>

      <InstructorSchedule
        instructorId={instructor.id}
        initialSchedules={instructor.schedules}
      />

      <InstructorStudents students={students} />
    </main>
  );
}
