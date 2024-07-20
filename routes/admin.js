const express=require('express');
const session = require("express-session");
const router = express.Router();
const path = require("path");
const adminAuth = require("../middleware/adminAuth");
const User=require("../models/userSchema");
const bcrypt = require('bcrypt');
const { adminPage, userDelete, searching, userEdit, updateEdit, userAddPage, userAdd } = require('../controllers/adminController');



 router.get("/",adminAuth, adminPage);

 router.get("/delete-user/:id",adminAuth, userDelete);

router.post("/search",adminAuth, searching);

 router.get("/editUser/:id",adminAuth, userEdit)

 router.post("/editUser/:id",adminAuth,updateEdit)

router.get("/addUser",adminAuth,userAddPage)

 router.post("/addUser",adminAuth,userAdd)




module.exports=router