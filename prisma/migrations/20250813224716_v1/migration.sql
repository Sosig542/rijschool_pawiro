/*
  Warnings:

  - A unique constraint covering the columns `[idCardNumber]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idCardNumber` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "idCardNumber" TEXT NOT NULL,
ADD COLUMN     "practicalExamAt" TIMESTAMP(3),
ADD COLUMN     "theoryExamAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Newsletter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_idCardNumber_key" ON "Student"("idCardNumber");
