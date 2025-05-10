/*
  Warnings:

  - Added the required column `award` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `penalty` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "award" INTEGER NOT NULL,
ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "penalty" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avaiableTime" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastTimerUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "timerActive" BOOLEAN NOT NULL DEFAULT false;
