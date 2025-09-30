// Import express.js
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

// create express app and port
const app = express();
const PORT = process.env.PORT || 5003;

// Get file path from URL of current module
const __filename = fileURLToPath(import.meta.url);
// Get directory name from file path
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());

// Serve html file from /public directory
// Tells express to serve all files from the public folder as static files
app.use(express.static(path.join(__dirname, "../public")));

// Serving up the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Routes
app.use("/auth", authRoutes);
app.use("/todos", authMiddleware, todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
