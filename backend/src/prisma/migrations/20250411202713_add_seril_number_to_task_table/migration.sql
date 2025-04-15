/*
  Warnings:

  - A unique constraint covering the columns `[serialNubmer]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "serialNubmer" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Task_serialNubmer_key" ON "Task"("serialNubmer");
