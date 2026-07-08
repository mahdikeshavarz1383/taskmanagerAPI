const express = require("express")
const port = 3000
const app = express()
const Task = require("./taskModel")
const User = require("./userModel")
const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")
const mongoose = require("mongoose")
const AppError = require("./error")
require("dotenv").config()

const SECRET = "mahdi_secret_key"
app.use(express.json())

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB! ✅"))
  .catch((err) => console.log("Error:", err))

// Register
app.post("/register", async (req, res, next) => {
  try {
    const {username, password} = req.body
    if(!username || !password) throw new AppError("please fill up", 400)
    const hashedPassword = await bcryptjs.hash(password, 10)
    const newUser = new User({username, password: hashedPassword})
    await newUser.save()
    res.status(201).json({message: "successfully"})
  } catch(err) {
    next(err)
  }
})

// Login
app.post("/login", async (req, res, next) => {
  try {
    const {username, password} = req.body
    const user = await User.findOne({username})
    if(!user) throw new AppError("user not found", 404)
    const isMatch = await bcryptjs.compare(password, user.password)
    if(!isMatch) throw new AppError("password is wrong", 400)
    const token = jwt.sign({id: user._id, username: user.username}, SECRET, {expiresIn: "1h"})
    res.json({message: "logged in", token})
  } catch(err) {
    next(err)
  }
})

// Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]
  if(!token) return next(new AppError("no token", 401))
  try {
    const decoded = jwt.verify(token, SECRET)
    req.user = decoded
    next()
  } catch(err) {
    next(new AppError("token is not valid", 401))
  }
}

// GET tasks
app.get("/tasks", verifyToken, async (req, res, next) => {
  try {
    const tasks = await Task.find({user: req.user.id})
    res.json({tasks})
  } catch(err) {
    next(err)
  }
})

// POST task
app.post("/tasks", verifyToken, async (req, res, next) => {
  try {
    const {taskname, completed} = req.body
    if(!taskname) throw new AppError("enter taskname", 400)
    const newTask = new Task({title: taskname, completed, user: req.user.id})
    await newTask.save()
    res.status(201).json({message: "added", newTask})
  } catch(err) {
    next(err)
  }
})

// PUT task
app.put("/tasks/:id", verifyToken, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if(!task) throw new AppError("task not found", 404)
    res.json({message: "updated", task})
  } catch(err) {
    next(err)
  }
})

// DELETE task
app.delete("/tasks/:id", verifyToken, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if(!task) throw new AppError("task not found", 404)
    res.json({message: "deleted"})
  } catch(err) {
    next(err)
  }
})

// Error Middleware — باید آخر باشه!
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"
  res.status(statusCode).json({
    success: false,
    message
  })
})

app.listen(port, () => {
  console.log("the program is running on port:3000")
})