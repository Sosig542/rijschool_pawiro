-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'INSTRUCTOR');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY');

-- CreateEnum
CREATE TYPE "LessonStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'ADMIN';

-- CreateTable
CREATE TABLE "Instructor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Instructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonSchedule" (
    "id" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT false,
    "maxStudents" INTEGER NOT NULL DEFAULT 5,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonBooking" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "lessonDate" TIMESTAMP(3) NOT NULL,
    "status" "LessonStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Instructor_email_key" ON "Instructor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LessonSchedule_instructorId_dayOfWeek_key" ON "LessonSchedule"("instructorId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "LessonBooking_studentId_lessonDate_key" ON "LessonBooking"("studentId", "lessonDate");

-- AddForeignKey
ALTER TABLE "LessonSchedule" ADD CONSTRAINT "LessonSchedule_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonBooking" ADD CONSTRAINT "LessonBooking_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonBooking" ADD CONSTRAINT "LessonBooking_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "LessonSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
