import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

// Get all todos for logged in user
router.get("/", async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: { userId: req.userID },
  });
  res.json(todos);
});

// Post / add todo
router.post("/", async (req, res) => {
  const { task } = req.body;
  const todo = await prisma.todo.create({
    data: {
      task,
      userId: req.userID,
    },
  });

  res.json({ id: todo.id, task, completed: 0 });
});

// Update a to-do
router.put("/:id", async (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;

  const updatedTodo = await prisma.todo.update({
    where: { id: parseInt(id), userId: req.userID },
    data: {
      completed: !!completed,
    },
  });

  res.json(updatedTodo);
});

// Delete a to-do
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const userID = req.userID;

  await prisma.todo.delete({
    where: { id: parseInt(id), userId: userID },
  });

  res.send({ message: "Todo deleted." });
});

export default router;
