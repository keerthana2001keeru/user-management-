
const userHandler = require("../helpers/userHelper");
const adminHandler = require("../helpers/adminHelper");


const bcrypt = require("bcrypt")


const adminLoginpage = function (req, res) {
 
  if (req.session.admin) {
    return res.redirect("/admin");
  } else {
    return res.render("adminLogin");
  }
};
async function adminLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const admin = await adminHandler.findAdminByEmail(email);
   
       if (admin) {
      // Compare the plain text password with the hashed password using bcrypt
      const passwordMatch = await bcrypt.compare( password,admin.password);

      if (passwordMatch) {
        req.session.admin = admin;
        req.session.loggedIn = true;
        req.session.username = admin.fullName;
        return res.redirect( "/admin");
      } else {
        
        return res.render("adminLogin", { errorMessage: "Invalid password" });
      }
    } else {
      
      return res.render("adminLogin", { errorMessage: "Admin not found" });
     
    }
  } catch (err) {
    next(err);
  }
}
async function adminPage(req, res, next) {
  try {
    if (req.session.admin) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
const skip = (page - 1)* limit;
const totalUsers=await userHandler.countUsers({isDeleted:false});
const allUsers=await userHandler.findUsersWithPagination({isDeleted:false}, limit,skip);
     const totalPages = Math.ceil(totalUsers/limit); 

// const { users, totalPages, currentPage } = await userHandler.findAllUsers(page, limit);

      return res.render('admin', {
        user: allUsers,
        totalPages:totalPages,
        currentPage:page,
        previousPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
      });
    } 
  } catch (err) {
    next(err);
  }
}

async function userDelete(req,res,next){
  try{
  const userId = req.params.id
  console.log(userId)
  const deletedUser = await userHandler.deleteUserById(userId,{isDeleted:true})
  console.log(deletedUser);
  if(deletedUser){
    res.redirect('/admin')
  }else{
    res.send('failed to delete')
  }
}catch(err){
  next(err);
}
}

  // async function userDelete(req,res){
  //   const userId = req.params.id
  //  try{
  //   const deletedUser = await User.findByIdAndUpdate({_id:userId,
  //     {isDeleted:true,

  //   })
  //  }
   
   
   

  async function searching(req,res,next){
    try{
    const word = req.body.keyword;
    const allUsers = await userHandler.searchUsers(word);
    
      res.render('admin',{user:allUsers})
  }catch(err){
  next(err);
  }
  }

  // async function userEdit(req,res,next){
  //   try{
    
  //   const userId = req.params.id
  //   const user = await User.findOne({_id:userId}).lean()
  //  res.render("editUser", {data:user});
  //  }catch(err){
  //   next(err)
  //  }
  //  }

  async function userEdit(req,res,next){
      try{
      
       const userId = req.params.id
      const user = await userHandler.findUserById(userId);
      res.render("editUser", {data:user});
      }catch(err){
       next(err)
      }
    
    }
   async function updateEdit(req,res,next){
    try{
    const stringId = req.params.id;
    const userId=new Object(stringId);
    const fullName= req.body.fullName.trim();
    const phone = req.body.phone.trim();
    const email =req.body.email.trim();
    if (!fullName|| !phone|| !email) {
      return res.render("editUser", {errorMessage: "All fields required",formData:req.body})
    }
    const updateUser = await userHandler.updateUserById(userId,{fullName,phone,email})
if(updateUser){
    res.redirect("/admin");
   }}catch(err){
    next(err);
      }   }
   const userAddPage = (req,res)=>{
    res.render("adduser")
    }
    async function userAdd(req,res,next){
      try{
        const { fullName, phone, email, password } = req.body;
       
        if (!fullName  || !phone || !email || !password) {
          return res.render("adduser", {errorMessage: "All fields required",formData:req.body})
        }
    
        const existingUser= await userHandler.findUserByEmail(email);
        if (existingUser){
          return res.render("adduser", {
            errorMessage: "User already exists",
            formData:req.body
          });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userHandler.createUser({
          fullName,
          phone,
          email,
          hashedPassword,
        });
    
        req.session.user = user;
        req.session.loggedIn = true;
        req.session.fullName = fullName;
            if (user){
                console.log("user created");
                req.user=user;
                res.redirect("/admin")
               return res.redirect("/admin")
            }
       
    }catch(err){
      if (err.name === "ValidationError") {
        return res.render("addUser", { errorMessage: err.message,formData:req.body });
      }
      next(err)
    
    }}

  module.exports={adminPage, userDelete,searching,userEdit,updateEdit,userAddPage,userAdd,adminLoginpage,adminLogin}