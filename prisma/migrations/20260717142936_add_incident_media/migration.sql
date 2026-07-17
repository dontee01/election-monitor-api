/*
  Warnings:

  - You are about to drop the column `fileName` on the `IncidentMedia` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `IncidentMedia` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `IncidentMedia` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reference]` on the table `IncidentMedia` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileSize` to the `IncidentMedia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `IncidentMedia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `IncidentMedia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `IncidentMedia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadedById` to the `IncidentMedia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `IncidentMedia` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT');

-- AlterTable
ALTER TABLE "IncidentMedia" DROP COLUMN "fileName",
DROP COLUMN "fileUrl",
DROP COLUMN "size",
ADD COLUMN     "fileSize" INTEGER NOT NULL,
ADD COLUMN     "reference" TEXT NOT NULL,
ADD COLUMN     "type" "MediaType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "uploadedById" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "IncidentMedia_reference_key" ON "IncidentMedia"("reference");

-- CreateIndex
CREATE INDEX "IncidentMedia_incidentId_idx" ON "IncidentMedia"("incidentId");

-- AddForeignKey
ALTER TABLE "IncidentMedia" ADD CONSTRAINT "IncidentMedia_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
