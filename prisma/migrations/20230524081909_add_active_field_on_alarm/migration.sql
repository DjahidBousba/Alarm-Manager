-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Alarm" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "schedule" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Alarm" ("createdAt", "id", "schedule") SELECT "createdAt", "id", "schedule" FROM "Alarm";
DROP TABLE "Alarm";
ALTER TABLE "new_Alarm" RENAME TO "Alarm";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
