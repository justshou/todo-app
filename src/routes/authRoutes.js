import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const router = express.Router();

// Register a new user endpoint /auth/register (POST)
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Encrypt the password
  const hashedPassword = bcrypt.hashSync(password, 8);

  // Save new user and hashed password to DB
  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // Create their first user todo
    const defaultTodo = "Hello! Add your first to-do.";

    await prisma.todo.create({
      data: {
        task: defaultTodo,
        userId: user.id,
      },
    });

    // Create token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    // If user does not exist, return user is not found.
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Check if password entered matches hashed password in db
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid password." });
    }
    console.log(user);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

export default router;
