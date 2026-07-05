const mongoose = require("mongoose")
const taskSchema = new mongoose.Schema({
     taskname: {
    type: String,
    required: true
  }
   ,
   completed : {
    type : Boolean ,
    required:true,
    default:false
  }
})
module.exports = mongoose.model("user", taskSchema)