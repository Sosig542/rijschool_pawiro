-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "passedExams" TEXT[] DEFAULT ARRAY[]::TEXT[];
