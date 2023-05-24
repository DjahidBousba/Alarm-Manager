/*
  Warnings:

  - You are about to drop the `Alert` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Alert";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Alarm" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "schedule" TEXT NOT NULL
);
