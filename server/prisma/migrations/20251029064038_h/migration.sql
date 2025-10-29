-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "resetCode" TEXT,
ADD COLUMN     "resetCodeExpires" TIMESTAMP(3);
