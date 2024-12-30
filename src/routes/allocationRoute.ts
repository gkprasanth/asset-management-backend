import express from "express";
import {
  search,
  allocateAsset,
  getAllocatedAssets,
  fetchStatus
} from "../controllers/allocation";

const router = express.Router();

// Route to search employees based on employee ID
router.post("/search", search);

// Route to allocate an asset to an employee
router.post("/allocate", allocateAsset);

// Route to deallocate an asset from an employee by asset code
// router.patch("/deallocate/:assetCode", deallocateAsset);

// Route to get all allocated assets
router.get("/allocated", getAllocatedAssets);
router.post("/fetchStatus", fetchStatus)

export default router;
