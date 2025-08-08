/*
  Warnings:

  - You are about to drop the column `commissionRate` on the `agents` table. All the data in the column will be lost.
  - You are about to drop the column `contactPhone` on the `agents` table. All the data in the column will be lost.
  - You are about to drop the column `coordinates` on the `agents` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `agents` table. All the data in the column will be lost.
  - You are about to drop the column `liquidityBalance` on the `agents` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `agents` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `agents` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `agents` table. All the data in the column will be lost.
  - You are about to drop the column `totalVolume` on the `agents` table. All the data in the column will be lost.
  - You are about to drop the column `resource` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `resourceId` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `canWithdraw` on the `business_users` table. All the data in the column will be lost.
  - You are about to drop the column `maxWithdrawal` on the `business_users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `business_users` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `maxUsers` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `billingPeriod` on the `subscription_payments` table. All the data in the column will be lost.
  - You are about to drop the column `paymentRef` on the `subscription_payments` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `subscription_payments` table. All the data in the column will be lost.
  - You are about to drop the column `autoRenew` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `currentPeriodEnd` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `currentPeriodStart` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `includedWithdrawals` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `maxAmountPerWithdrawal` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyFee` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `nextBillingDate` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `usedWithdrawals` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `agentId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `agentLocation` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `externalRef` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `feeAmount` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `isFeeFree` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `withdrawalCode` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `businessAddress` to the `agents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `agents` table without a default value. This is not possible if the table is not empty.
  - Made the column `details` on table `audit_logs` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `phoneNumber` to the `businesses` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `reports` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `maxTransactionAmount` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthlyPrice` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overageFee` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionLimit` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "withdrawal_tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "qrCode" TEXT,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "agentId" TEXT,
    "redeemedAt" DATETIME,
    "redeemedLocation" TEXT,
    "transactionId" TEXT,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "withdrawal_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "withdrawal_tokens_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "withdrawal_tokens_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_agents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "agentCode" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessAddress" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationDate" DATETIME,
    "totalTransactions" INTEGER NOT NULL DEFAULT 0,
    "totalAmount" INTEGER NOT NULL DEFAULT 0,
    "commissionEarned" INTEGER NOT NULL DEFAULT 0,
    "latitude" REAL,
    "longitude" REAL,
    "serviceArea" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "agents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_agents" ("agentCode", "businessName", "businessAddress", "phoneNumber", "createdAt", "id", "status", "totalTransactions", "updatedAt", "userId") SELECT "agentCode", "businessName", COALESCE("location", 'Default Address'), COALESCE("contactPhone", '0000000000'), "createdAt", "id", "status", "totalTransactions", "updatedAt", "userId" FROM "agents";
DROP TABLE "agents";
ALTER TABLE "new_agents" RENAME TO "agents";
CREATE UNIQUE INDEX "agents_userId_key" ON "agents"("userId");
CREATE UNIQUE INDEX "agents_agentCode_key" ON "agents"("agentCode");
CREATE TABLE "new_audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_audit_logs" ("action", "createdAt", "details", "id", "ipAddress", "userAgent", "userId") SELECT "action", "createdAt", "details", "id", "ipAddress", "userAgent", "userId" FROM "audit_logs";
DROP TABLE "audit_logs";
ALTER TABLE "new_audit_logs" RENAME TO "audit_logs";
CREATE TABLE "new_business_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "business_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "business_users_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_business_users" ("businessId", "createdAt", "id", "role", "userId") SELECT "businessId", "createdAt", "id", "role", "userId" FROM "business_users";
DROP TABLE "business_users";
ALTER TABLE "new_business_users" RENAME TO "business_users";
CREATE UNIQUE INDEX "business_users_userId_businessId_key" ON "business_users"("userId", "businessId");
CREATE TABLE "new_businesses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_businesses" ("address", "phoneNumber", "createdAt", "email", "id", "name", "type", "updatedAt") SELECT "address", COALESCE("phone", '0000000000'), "createdAt", "email", "id", "name", "type", "updatedAt" FROM "businesses";
DROP TABLE "businesses";
ALTER TABLE "new_businesses" RENAME TO "businesses";
CREATE TABLE "new_notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_notifications" ("createdAt", "id", "isRead", "message", "title", "type", "userId") SELECT "createdAt", "id", "isRead", "message", "title", "type", "userId" FROM "notifications";
DROP TABLE "notifications";
ALTER TABLE "new_notifications" RENAME TO "notifications";
CREATE TABLE "new_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_reports" ("createdAt", "data", "id", "period", "type", "userId") SELECT "createdAt", "data", "id", "period", "type", "userId" FROM "reports";
DROP TABLE "reports";
ALTER TABLE "new_reports" RENAME TO "reports";
CREATE TABLE "new_subscription_payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriptionId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "transactionId" TEXT,
    "paidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "subscription_payments_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "subscription_payments_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_subscription_payments" ("amount", "createdAt", "id", "paymentMethod", "status", "subscriptionId") SELECT "amount", "createdAt", "id", "paymentMethod", "status", "subscriptionId" FROM "subscription_payments";
DROP TABLE "subscription_payments";
ALTER TABLE "new_subscription_payments" RENAME TO "subscription_payments";
CREATE UNIQUE INDEX "subscription_payments_transactionId_key" ON "subscription_payments"("transactionId");
CREATE TABLE "new_subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "monthlyPrice" INTEGER NOT NULL,
    "transactionLimit" INTEGER NOT NULL,
    "maxTransactionAmount" INTEGER NOT NULL,
    "overageFee" INTEGER NOT NULL,
    "transactionsUsed" INTEGER NOT NULL DEFAULT 0,
    "currentMonthStart" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME,
    "lastRenewalDate" DATETIME,
    "nextRenewalDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_subscriptions" ("createdAt", "id", "status", "tier", "monthlyPrice", "transactionLimit", "maxTransactionAmount", "overageFee", "updatedAt", "userId") 
SELECT 
    "createdAt", 
    "id", 
    "status", 
    "tier",
    CASE 
        WHEN "tier" = 'BASIC_TIER' THEN 7500
        WHEN "tier" = 'STANDARD_TIER' THEN 15000
        WHEN "tier" = 'PREMIUM_TIER' THEN 60000
        WHEN "tier" = 'BUSINESS_TIER' THEN 200000
        ELSE 7500
    END,
    CASE 
        WHEN "tier" = 'BASIC_TIER' THEN 10
        WHEN "tier" = 'STANDARD_TIER' THEN 25
        WHEN "tier" = 'PREMIUM_TIER' THEN 100
        WHEN "tier" = 'BUSINESS_TIER' THEN 500
        ELSE 10
    END,
    CASE 
        WHEN "tier" = 'BASIC_TIER' THEN 75000
        WHEN "tier" = 'STANDARD_TIER' THEN 500000
        WHEN "tier" = 'PREMIUM_TIER' THEN 1500000
        WHEN "tier" = 'BUSINESS_TIER' THEN 5000000
        ELSE 75000
    END,
    1000,
    "updatedAt", 
    "userId" 
FROM "subscriptions";
DROP TABLE "subscriptions";
ALTER TABLE "new_subscriptions" RENAME TO "subscriptions";
CREATE UNIQUE INDEX "subscriptions_userId_key" ON "subscriptions"("userId");
CREATE TABLE "new_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "fee" INTEGER NOT NULL DEFAULT 0,
    "totalAmount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reference" TEXT NOT NULL,
    "mobileMoneyProvider" TEXT,
    "phoneNumber" TEXT,
    "subscriptionId" TEXT,
    "isOverageTransaction" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_transactions" ("amount", "fee", "totalAmount", "reference", "createdAt", "id", "status", "type", "updatedAt", "userId") SELECT "amount", COALESCE("feeAmount", 0), "amount" + COALESCE("feeAmount", 0), 'TXN-' || "id", "createdAt", "id", "status", "type", "updatedAt", "userId" FROM "transactions";
DROP TABLE "transactions";
ALTER TABLE "new_transactions" RENAME TO "transactions";
CREATE UNIQUE INDEX "transactions_reference_key" ON "transactions"("reference");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "withdrawal_tokens_token_key" ON "withdrawal_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "withdrawal_tokens_transactionId_key" ON "withdrawal_tokens"("transactionId");
