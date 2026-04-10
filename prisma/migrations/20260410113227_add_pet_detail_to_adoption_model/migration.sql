/*
  Warnings:

  - Added the required column `petAge` to the `Adoption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `petGender` to the `Adoption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `petGoodWithChildren` to the `Adoption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `petSize` to the `Adoption` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Pet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PetType" AS ENUM ('cat', 'dog', 'bird');

-- AlterTable
ALTER TABLE "Adoption" ADD COLUMN     "petAge" "PetAge" NOT NULL,
ADD COLUMN     "petGender" "PetGender" NOT NULL,
ADD COLUMN     "petGoodWithChildren" BOOLEAN NOT NULL,
ADD COLUMN     "petSize" "PetSize" NOT NULL,
ALTER COLUMN "source" SET DEFAULT 'local';

-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "type",
ADD COLUMN     "type" "PetType" NOT NULL;
