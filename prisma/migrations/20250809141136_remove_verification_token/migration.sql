/*
  Warnings:

  - You are about to drop the column `verificationToken` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Store" DROP COLUMN "verificationToken";

-- DropTable
DROP TABLE "public"."VerificationToken";
