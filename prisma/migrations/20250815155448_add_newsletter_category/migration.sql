-- CreateEnum
CREATE TYPE "NewsletterCategory" AS ENUM ('GENERAL', 'IMPORTANT');

-- AlterTable
ALTER TABLE "Newsletter" ADD COLUMN     "category" "NewsletterCategory" NOT NULL DEFAULT 'GENERAL';
