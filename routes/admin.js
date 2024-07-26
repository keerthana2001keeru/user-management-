const express=require('express');

const router = express.Router();
const path = require("path");
const adminAuth = require("../middleware/adminAuth");
const userAuth = require("../middleware/userAuth");

const { adminPage, userDelete, searching, userEdit, updateEdit, userAddPage, userAdd,adminLoginpage, adminLogin } = require('../controllers/adminController');
const { userRegisterValidation, validatee, validat,  userUpdateValidate } = require('../middleware/validation');
const noCacheMiddleware = require('../middleware/noCache');


router.get("/adminLogin",adminLoginpage);

router.post('/adminLogin',adminLogin)

 router.get("/",adminAuth,noCacheMiddleware, adminPage);

 router.get("/delete-user/:id",adminAuth, userDelete);

router.post("/search",adminAuth, searching);

 router.get("/editUser/:id",adminAuth, userEdit)

 router.post("/editUser/:id",userUpdateValidate,validat,adminAuth,updateEdit)

router.get("/addUser",adminAuth,userAddPage)

 router.post("/addUser",userRegisterValidation,validatee,adminAuth,userAdd)




module.exports=router