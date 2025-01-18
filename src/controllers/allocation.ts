import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Allocate an asset to an employee
 */

export const fetchStatus = async (req: Request, res: Response): Promise<void> => {
  const { assetCode } = req.body;

  try {
     if (!assetCode) {
      res.status(400).json({ error: "Asset Code is required for search" });
      return;
    }

 
    const status = await prisma.asset.findFirst({
      where: {
        assetCode: assetCode,
      },
    });

    
    if (!status) {
      res.status(404).json({ message: "Asset not found" });
      return;
    }

    // Return the asset status
    res.status(200).json(status.allocationStatus);
  } catch (err) {
    console.error("Error fetching asset status:", err);
    res.status(500).json({ message: "Error fetching asset status", error: err });
  }
};


export const search = async (req: Request, res: Response): Promise<void> => {
  const { empId } = req.body;
  
  try {
    // Ensure empId is provided
    if (!empId) {
      res.status(400).json({ error: "Employee ID is required for search" });
      return;
    }
  
    const employees = await prisma.employee.findMany({
      where: {
        empId: {
          contains: empId,  
          mode: "insensitive", 
        },
      },
      select: {
        empId: true,
        empName: true,
        department: true,
        location: true,
      },
    });
  
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error searching employees:", error);
    res.status(500).json({ error: "Error searching for employees" });
  }
};

export const allocateAsset = async (req: Request, res: Response): Promise<any> => {
  const { assetCode, empId } = req.body;
  
  try {
    // Use findFirst if assetCode is not unique
    const asset = await prisma.asset.findFirst({
      where: { assetCode: assetCode }, // Use assetCode instead of id
    });
  
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }
  
    // Check if the asset is in "In Store" status
    if (asset.allocationStatus === "InStore") {
      const updatedAsset = await prisma.asset.update({
        where: { id: asset.id }, // Use asset's id here instead of assetCode
        data: {
          empId,
          allocationStatus: "InUse",
        },
      });
  
      return res.status(200).json({ message: "Asset allocated successfully", asset: updatedAsset });
    } else {
      return res.status(400).json({
        message: `Asset cannot be allocated as it is currently ${asset.allocationStatus}`,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error allocating asset", error });
  }
};

/**
 * Deallocate an asset from an employee
 */
// export const deallocateAsset = async (req: Request, res: Response) => {
//   const { assetCode } = req.params;

//   try {
//     // Use findFirst to locate the asset by assetCode
//     const asset = await prisma.asset.findFirst({
//       where: { assetCode: assetCode },
//     });

//     if (!asset) {
//       return res.status(404).json({ message: "Asset not found" });
//     }

//     const updatedAsset = await prisma.asset.update({
//       where: { id: asset.id }, // Use asset's id here instead of assetCode
//       data: {
//         empId: null,
//         allocationStatus: "InStore",
//       },
//     });

//     res.status(200).json({ message: "Asset deallocated successfully", asset: updatedAsset });
//   } catch (error) {
//     res.status(500).json({ message: "Error deallocating asset", error });
//   }
// };



/**
 * Get all allocated assets
 */
export const getAllocatedAssets = async (_req: Request, res: Response) => {
  try {
    const assets = await prisma.asset.findMany({
      where: {
        allocationStatus: "InUse",
      },
      include: {
        employee: true, // Include employee details if needed
      },
    });

    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching allocated assets", error });
  }
};
