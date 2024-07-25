const express=require('express');
const session = require("express-session");
const router=express.Router();
const path = require("path");
const User=require("../models/userSchema")
const{ loginpage, registerPage, homePage, logout, userRegister, userLogin}= require('../controllers/userController');
const userAuth = require("../middleware/userAuth")
const { userRegisterValidation, validate } = require('../middleware/validation');
const noCacheMiddleware = require('../middleware/noCache');


router.get('/',noCacheMiddleware,loginpage)

router.get('/register',noCacheMiddleware,registerPage)

router.get('/home', userAuth ,noCacheMiddleware,homePage)

router.post('/register',userRegisterValidation,validate,userRegister)
  
router.post('/login',userLogin)

router.get('/logout',logout)  


  


module.exports= router