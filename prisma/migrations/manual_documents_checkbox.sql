-- Manual migration to change Document table from file uploads to checkbox status
-- Run this after updating the Prisma schema

-- First, drop the existing documents table (this will lose existing data)
DROP TABLE IF EXISTS "Document";

-- Recreate the table with the new structure
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" DATETIME,
    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- Add the foreign key constraint
ALTER TABLE "Document" ADD CONSTRAINT "Document_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
