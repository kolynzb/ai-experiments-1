-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('FULL_TIME', 'PART_TIME', 'FREELANCE', 'CONTRACT');

-- CreateTable
CREATE TABLE "Talent" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bio" TEXT,
    "experienceYears" INTEGER NOT NULL,
    "hourlyRate" DOUBLE PRECISION,
    "skills" TEXT[],
    "education" TEXT,
    "certifications" TEXT[],
    "availability" "Availability" NOT NULL,
    "portfolioUrl" TEXT,
    "experience" TEXT[],
    "embedding" DOUBLE PRECISION[],

    CONSTRAINT "Talent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Talent_email_key" ON "Talent"("email");
