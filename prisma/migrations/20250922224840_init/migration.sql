-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'credentials'
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
