-- CreateEnum
CREATE TYPE "CardGenre" AS ENUM ('LANDSCAPE', 'PORTRAIT', 'TRAVEL', 'ANIMAL', 'OBJECT', 'ETC');

-- CreateEnum
CREATE TYPE "CardGrade" AS ENUM ('COMMON', 'RARE', 'SUPER_RARE', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('ON_SALE', 'SOLD_OUT', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ExchangeStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "NotiType" AS ENUM ('EXCHANGE_RECEIVED', 'EXCHANGE_ACCEPTED', 'EXCHANGE_REJECTED', 'PURCHASE_COMPLETED', 'CARD_SOLD', 'CARD_SOLD_OUT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "nickname" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "lastBoxClaimedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photocard" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "imageUrl" VARCHAR(500) NOT NULL,
    "genre" "CardGenre" NOT NULL,
    "grade" "CardGrade" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "minPrice" INTEGER NOT NULL,
    "totalQuantity" INTEGER NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "Photocard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ownership" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "photocardId" TEXT NOT NULL,

    CONSTRAINT "Ownership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopListing" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "remainingQuantity" INTEGER NOT NULL,
    "pricePerUnit" INTEGER NOT NULL,
    "wishGrade" "CardGrade",
    "wishGenre" "CardGenre",
    "wishDescription" TEXT,
    "status" "ListingStatus" NOT NULL DEFAULT 'ON_SALE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "ownershipId" TEXT NOT NULL,

    CONSTRAINT "ShopListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exchange" (
    "id" TEXT NOT NULL,
    "status" "ExchangeStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "shopListingId" TEXT NOT NULL,
    "proposerId" TEXT NOT NULL,
    "photocardId" TEXT NOT NULL,
    "message" TEXT,

    CONSTRAINT "Exchange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" "NotiType" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" VARCHAR(255) NOT NULL,
    "userId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Ownership_userId_photocardId_key" ON "Ownership"("userId", "photocardId");

-- AddForeignKey
ALTER TABLE "Photocard" ADD CONSTRAINT "Photocard_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ownership" ADD CONSTRAINT "Ownership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ownership" ADD CONSTRAINT "Ownership_photocardId_fkey" FOREIGN KEY ("photocardId") REFERENCES "Photocard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopListing" ADD CONSTRAINT "ShopListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopListing" ADD CONSTRAINT "ShopListing_ownershipId_fkey" FOREIGN KEY ("ownershipId") REFERENCES "Ownership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_shopListingId_fkey" FOREIGN KEY ("shopListingId") REFERENCES "ShopListing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_photocardId_fkey" FOREIGN KEY ("photocardId") REFERENCES "Photocard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
