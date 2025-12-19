-- DropIndex
DROP INDEX "FeedbackItem_createdAt_idx";

-- DropIndex
DROP INDEX "FeedbackItem_productArea_idx";

-- DropIndex
DROP INDEX "FeedbackItem_severity_idx";

-- CreateTable
CREATE TABLE "FeedbackTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,

    CONSTRAINT "FeedbackTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackForm" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "productArea" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "productArea" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesNote" (
    "id" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "productArea" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalesNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackTag_feedbackId_name_key" ON "FeedbackTag"("feedbackId", "name");

-- AddForeignKey
ALTER TABLE "FeedbackTag" ADD CONSTRAINT "FeedbackTag_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "FeedbackItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
