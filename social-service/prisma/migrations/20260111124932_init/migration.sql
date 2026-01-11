-- CreateEnum
CREATE TYPE "friendshipStatus" AS ENUM ('PENDING', 'FRIENDS', 'BLOCKED');

-- CreateTable
CREATE TABLE "friendship" (
    "id" BIGSERIAL NOT NULL,
    "requesterId" BIGINT NOT NULL,
    "addresseeId" BIGINT NOT NULL,
    "status" "friendshipStatus" NOT NULL,

    CONSTRAINT "friendship_pkey" PRIMARY KEY ("id")
);
