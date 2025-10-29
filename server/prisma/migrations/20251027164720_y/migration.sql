/*
  Warnings:

  - A unique constraint covering the columns `[cartId,productId,color]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."CartItem_cartId_productId_size_color_key";

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_productId_color_key" ON "public"."CartItem"("cartId", "productId", "color");
