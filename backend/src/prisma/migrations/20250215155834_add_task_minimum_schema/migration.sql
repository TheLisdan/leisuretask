-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'IN_PROGRESS',

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
