const express=require('express');
const session = require("express-session");
const router=express.Router();
const path = require("path");
const User=require("../models/userSchema")
const{ loginpage, registerPage, homePage, logout, userRegister, userLogin}= require('../controllers/userController');
const userAuth = require("../middleware/userAuth")

// router.get('/',(req,res)=>{
//     res.send('sdcvbnm')

// })

router.get('/',loginpage)

router.get('/register',registerPage)

router.get('/home', userAuth ,homePage)

router.post('/register',userRegister)
  
router.post('/login',userLogin)

router.get('/logout',logout)  


  


module.exports= router