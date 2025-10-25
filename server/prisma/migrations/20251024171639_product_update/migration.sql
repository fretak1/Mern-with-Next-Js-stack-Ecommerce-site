/*
  Warnings:

  - You are about to drop the column `isFeatured` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."product" DROP COLUMN "isFeatured",
ADD COLUMN     "productType" TEXT;
