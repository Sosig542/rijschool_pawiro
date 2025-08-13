-- CreateEnum
CREATE TYPE "ExamResult" AS ENUM ('GESLAAGD', 'NIET_GEHAALD');

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "practicalStatus" "ExamResult" NOT NULL DEFAULT 'NIET_GEHAALD',
ADD COLUMN     "theoryStatus" "ExamResult" NOT NULL DEFAULT 'NIET_GEHAALD';
