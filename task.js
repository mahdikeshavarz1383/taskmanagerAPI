const express=require("express")
const port=3000;
const app=express();
const Task=require("./taskModel")
const User=require("./userModel")
const dotenv=require("dotenv")
const jwt=require("jsonwebtoken")
const bcryptjs=require("bcryptjs")
const SECRET="mahdi_secret_key";
//@@@@@@@@@@@@@@@@@@@@@@@
let Tasks=[];
let tasks=[];
app.use(express.json())
// join to mongodb
const mongoose = require("mongoose")
require("dotenv").config()
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB! ✅"))
  .catch((err) => console.log("Error:", err))
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
app.post("/register",async(req,res)=>{
    const{id,username,password}=req.body
    if(!username ||!password){return res.status(400).json({message:"please fil up "})}
     const hashedPassword=await bcryptjs.hash(password,10)
    const newUser = new User({username, password: hashedPassword})
  await newUser.save()
    
    return res.status(201).json({message:"seccsfully"})
})
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
app.post("/login",async(req,res)=>{
    const {username,password}=req.body
    
    const user = await User.findOne({username})
    if(!user){return res.status(400).json({message:"user not found"})}
    const isMatch=await bcryptjs.compare(password,user.password)
    if(!isMatch){return res.status(400).json({message:"password is wrong"})}
     const token = jwt.sign({id: user._id, username: user.username}, SECRET, {expiresIn: "1h"})
  res.json({message: "logged in", token})
})
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  //Authuntication
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]
  if(!token) {
    return res.status(401).json({message: "you dont have any token"})
  }

  try {
    const decoded = jwt.verify(token, SECRET)
    req.user = decoded
    next()
  } catch(err) {
    return res.status(401).json({message: "toke is not valid"})
  }
}
app.post("/tasks",verifyToken,async(req,res)=>{
  const {taskname,completed}=req.body
  if(!taskname){return res.status(400).json({message:"you must enter taskname"})}
  const newTask={
        id:tasks.length+1,
       taskname:req.body.name,
        completed:req.body.completed,
        user: req.user.id
    }
    const newTasks=new Task({title:taskname,completed,user:req.user.id})
    await newTasks.save()
    return res.status(201).json({message:"added",newTasks,user:req.user.id})
})
app.put("/tasks/:id",verifyToken,async(req,res)=>{
    const id=parseInt(req.params.id)
    if(isNaN(id)){return res.status(400).json({message:"please enter a number"})}
     const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new: true}
  )
  if(!task){return res.status(404).json({message:"id not found"})}
    const{taskname,completed} = req.body

  if(!taskname){return res.json({message:"enter taskname"})}
  
  return res.json({message:"updated",task})
})
app.get("/tasks",verifyToken,async(req,res)=>{
    const tasks = await Task.find({user:req.user.id})
  return res.json({message: tasks})
})

app.delete("/tasks/:id",verifyToken,async(req,res)=>{
  const id=parseInt(req.params.id)
  if(isNaN(id)){return res.status(400).json({message:"please enter a number"})}
  const task=await Task.findByIdAndDelete(req.params.id)
  if(!task){return res.status(404).json({message:"not found"})}
   
  return res.json({message:"deleted"})

})
 



app.listen(port,()=>{
    console.log("the program is running on port:3000")
})