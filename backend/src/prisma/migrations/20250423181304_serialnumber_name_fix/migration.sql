/*
  Warnings:

  - You are about to drop the column `serialNubmer` on the `Task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[serialNumber]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Task_serialNubmer_key";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "serialNubmer",
ADD COLUMN     "serialNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Task_serialNumber_key" ON "Task"("serialNumber");
