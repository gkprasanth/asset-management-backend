-- CreateEnum
CREATE TYPE "AssetClassification" AS ENUM ('Laptop', 'Desktop', 'Peripherals', 'Server', 'Storage', 'TableLibraries', 'SanSwitches', 'Firewall', 'L3Switches', 'L2SwitchesManaged', 'L2SwitchesUnmanaged', 'POEManaged', 'POEUnmanaged');

-- CreateEnum
CREATE TYPE "AllocationStatus" AS ENUM ('InUse', 'InStore', 'Scrap', 'InRepair');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- CreateTable
CREATE TABLE "Asset" (
    "id" SERIAL NOT NULL,
    "classification" "AssetClassification" NOT NULL,
    "make" TEXT NOT NULL,
    "assetModel" TEXT NOT NULL,
    "purchaseDate" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "serviceTag" TEXT NOT NULL,
    "assetCode" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "costCenterCode" TEXT NOT NULL,
    "allocationStatus" "AllocationStatus" NOT NULL,
    "empId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "empId" TEXT NOT NULL,
    "empName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "manager" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "hod" TEXT NOT NULL,
    "empPhone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_serviceTag_key" ON "Asset"("serviceTag");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_empId_key" ON "Employee"("empId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_empId_fkey" FOREIGN KEY ("empId") REFERENCES "Employee"("empId") ON DELETE SET NULL ON UPDATE CASCADE;
