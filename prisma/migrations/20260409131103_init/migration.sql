-- CreateEnum
CREATE TYPE "PetGender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "PetSize" AS ENUM ('small', 'medium', 'large', 'xlarge');

-- CreateEnum
CREATE TYPE "PetAge" AS ENUM ('baby', 'young', 'adult', 'senior');

-- CreateEnum
CREATE TYPE "PetSource" AS ENUM ('local', 'petfinder');

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "gender" "PetGender" NOT NULL,
    "size" "PetSize" NOT NULL,
    "age" "PetAge" NOT NULL,
    "good_with_children" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetPhoto" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "petId" TEXT NOT NULL,

    CONSTRAINT "PetPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Adoption" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "petType" TEXT NOT NULL,
    "source" "PetSource" NOT NULL,
    "localPetId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Adoption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");

-- CreateIndex
CREATE INDEX "Adoption_created_at_idx" ON "Adoption"("created_at");

-- CreateIndex
CREATE INDEX "Adoption_source_created_at_idx" ON "Adoption"("source", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "Adoption_customerId_petId_key" ON "Adoption"("customerId", "petId");

-- AddForeignKey
ALTER TABLE "PetPhoto" ADD CONSTRAINT "PetPhoto_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adoption" ADD CONSTRAINT "Adoption_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adoption" ADD CONSTRAINT "Adoption_localPetId_fkey" FOREIGN KEY ("localPetId") REFERENCES "Pet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
