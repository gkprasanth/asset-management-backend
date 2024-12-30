/*
  Warnings:

  - Changed the type of `purchaseDate` on the `Asset` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "purchaseDate",
ADD COLUMN     "purchaseDate" TIMESTAMP(3) NOT NULL;
