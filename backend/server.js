const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "mysecretkey";

// In-memory storage
let users = [];
let tasks = [];

// 🔐 Middleware to verify token
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) return res.status(403).json({ message: "No token" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user;
    next();
  });
}

// 🧾 SIGNUP
app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 8);

  users.push({ username, password: hashedPassword });

  res.json({ message: "User created" });
});

// 🔑 LOGIN
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

  res.json({ token });
});

// 📋 PROTECTED TASK ROUTES
app.get("/api/tasks", authenticateToken, (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", authenticateToken, (req, res) => {
  const newTask = {
    id: Date.now(),
    text: req.body.text,
    user: req.user.username
  };
  tasks.push(newTask);
  res.json(newTask);
});

app.delete("/api/tasks/:id", authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(task => task.id !== id);
  res.json({ message: "Deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));