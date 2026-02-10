-- CreateIndex
CREATE INDEX "Messages_conversationId_createdAt_idx" ON "Messages"("conversationId", "createdAt");
