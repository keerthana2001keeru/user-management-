const mongoose =require("mongoose")
const userSchema = new mongoose.Schema({
  fullName:{
    type:String,
    required: true,
    minlength: [3, "Full name must be at least 3 characters long"],
    maxlength: [64, "Full name cannot be longer than 64 characters"]
  
  },
  phone:{
    type:String,
    required: true,
    trim:true,
     validate: {
      validator: function(v) {
        return /^[0-9]{8,12}$/.test(v) && !/^0+$/.test(v);
      },
      //message: "Phone number must be between 8 to 12 digits and cannot be all zeros"
    }
  },
  email:{
    type:String,
    required:true,
    unique:true,
    trim:true,
   
  },
  password:{
    type:String,
    required:true
  },
  isDeleted: {
     type: Boolean,
     default: false 
  }
})

module.exports = mongoose.model("User", userSchema);
