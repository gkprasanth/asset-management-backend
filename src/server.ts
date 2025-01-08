import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import allocationRoutes from "./routes/allocationRoute"; // Adjust the path as necessary
import authRoutes from "./routes/authRoutes";
import 'dotenv/config';
import cors from "cors";

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;



// {
//   "username": "Admin",
//   "email": "admin@email.com",
//   "password": "test@123",
//   "role": "admin"
// {
//   "username": "user",
//   "email": "user@email.com",
//   "password": "test@123",
//   "role": "user"
// }
// }

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())


app.use("/api/auth", authRoutes);
app.use("/api/assets", allocationRoutes);

// Get all assets
app.get("/assets", async (req: Request, res: Response): Promise<void> => {
  try {
    const assets = await prisma.asset.findMany();
    res.json(assets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch assets." });
  }
});

app.get("/", (req: Request, res: Response)=>{
  res.json({
    "message": "server working"
  })
})

// Create a new asset
app.post("/assets", async (req: Request, res: Response): Promise<void> => {
  const {
    classification,
    make,
    assetModel,
    purchaseDate,
    warranty,
    serviceTag,
    assetCode,
    location,
    costCenterCode,
    allocationStatus,
    empId,
  } = req.body;

  try {
    const newAsset = await prisma.asset.create({
      data: {
        classification,
        make,
        assetModel,
        purchaseDate: new Date(purchaseDate),
        warranty,
        serviceTag,
        assetCode,
        location,
        costCenterCode,
        allocationStatus,
        empId,
      },
    });

    res.status(201).json(newAsset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create asset." });
  }
});

// Create a new employee
app.post("/emp", async (req: Request, res: Response): Promise<void> => {
  const {
    empId,
    empName,
    department,
    manager,
    managerId,
    hod,
    empPhone,
    location,
  } = req.body;

  try {
    const newEmployee = await prisma.employee.create({
      data: {
        empId,
        empName,
        department,
        manager,
        managerId,
        hod,
        empPhone,
        location,
      },
    });

    res.status(201).json(newEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create employee." });
  }
});



// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

