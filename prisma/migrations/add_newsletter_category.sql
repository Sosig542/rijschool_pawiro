-- Add category field to Newsletter table
ALTER TABLE "Newsletter" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'GENERAL';

-- Create the NewsletterCategory enum type
CREATE TYPE "NewsletterCategory" AS ENUM ('GENERAL', 'IMPORTANT');

-- Update the category column to use the enum
ALTER TABLE "Newsletter" ALTER COLUMN "category" TYPE "NewsletterCategory" USING "category"::"NewsletterCategory";
