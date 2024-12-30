import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";

const prisma = new PrismaClient();
const JWT_SECRET = "your_jwt_secret"; // Replace with a secure secret in a production environment

// Register a new user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, role } = req.body;

  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "Email is already in use." });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json({ message: "User registered successfully.", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register user." });
  }
};

// Login user and issue JWT
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid credentials." });
      return;
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful.",token,id:user.id,  username: user.username, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to login." });
  }
};
