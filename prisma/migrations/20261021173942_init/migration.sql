-- CreateTable
CREATE TABLE "Ticket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requesterEmail" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Other',
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "status" TEXT NOT NULL DEFAULT 'Open',
    "assignedTo" TEXT NOT NULL DEFAULT 'Unassigned',
    "aiDraftReply" TEXT,
    "aiReasoning" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
