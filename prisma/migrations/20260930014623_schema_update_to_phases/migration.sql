-- CreateEnum
CREATE TYPE "IncidentDomain" AS ENUM ('COMMUNITY', 'ELECTION');

-- CreateEnum
CREATE TYPE "ResultSubmissionStatus" AS ENUM ('SUBMITTED', 'CORROBORATED', 'DISPUTED', 'OFFICIAL');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "IncidentCategory" ADD VALUE 'THEFT';
ALTER TYPE "IncidentCategory" ADD VALUE 'ROADBLOCK';
ALTER TYPE "IncidentCategory" ADD VALUE 'TRAFFIC';
ALTER TYPE "IncidentCategory" ADD VALUE 'RTA';
ALTER TYPE "IncidentCategory" ADD VALUE 'FIRE';
ALTER TYPE "IncidentCategory" ADD VALUE 'UTILITY_OUTAGE';
ALTER TYPE "IncidentCategory" ADD VALUE 'OTHER_COMMUNITY';

-- DropForeignKey
ALTER TABLE "Incident" DROP CONSTRAINT "Incident_electionId_fkey";

-- DropForeignKey
ALTER TABLE "Incident" DROP CONSTRAINT "Incident_pollingUnitId_fkey";

-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "address" TEXT,
ADD COLUMN     "domain" "IncidentDomain" NOT NULL DEFAULT 'COMMUNITY',
ADD COLUMN     "wardId" TEXT,
ALTER COLUMN "electionId" DROP NOT NULL,
ALTER COLUMN "pollingUnitId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "reportCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "verifiedCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ElectionResultSubmission" (
    "id" TEXT NOT NULL,
    "electionId" TEXT NOT NULL,
    "pollingUnitId" TEXT NOT NULL,
    "submitterId" TEXT NOT NULL,
    "tallies" JSONB NOT NULL,
    "resultSheetUrl" TEXT NOT NULL,
    "status" "ResultSubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ElectionResultSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ElectionResultSubmission_pollingUnitId_electionId_idx" ON "ElectionResultSubmission"("pollingUnitId", "electionId");

-- CreateIndex
CREATE INDEX "ElectionResultSubmission_status_idx" ON "ElectionResultSubmission"("status");

-- CreateIndex
CREATE INDEX "Incident_wardId_idx" ON "Incident"("wardId");

-- CreateIndex
CREATE INDEX "Incident_domain_idx" ON "Incident"("domain");

-- AddForeignKey
ALTER TABLE "ElectionResultSubmission" ADD CONSTRAINT "ElectionResultSubmission_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectionResultSubmission" ADD CONSTRAINT "ElectionResultSubmission_pollingUnitId_fkey" FOREIGN KEY ("pollingUnitId") REFERENCES "PollingUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectionResultSubmission" ADD CONSTRAINT "ElectionResultSubmission_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_pollingUnitId_fkey" FOREIGN KEY ("pollingUnitId") REFERENCES "PollingUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE SET NULL ON UPDATE CASCADE;
