/*
  Warnings:

  - A unique constraint covering the columns `[txRef]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "txRef" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_txRef_key" ON "public"."Order"("txRef");

-- CreateIndex
CREATE INDEX "Order_txRef_idx" ON "public"."Order"("txRef");
