/*
  Warnings:

  - Added the required column `provider` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "provider" AS ENUM ('google');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "inrWalletId" INTEGER,
ADD COLUMN     "provider" "provider" NOT NULL,
ADD COLUMN     "solWalletId" INTEGER,
ALTER COLUMN "password" DROP NOT NULL;
