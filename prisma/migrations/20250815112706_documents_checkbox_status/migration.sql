/*
  Warnings:

  - You are about to drop the column `filename` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedAt` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "filename",
DROP COLUMN "uploadedAt",
ADD COLUMN     "isSubmitted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "submittedAt" TIMESTAMP(3);
