
const User=require("../models/userSchema")
const bcrypt = require("bcrypt")

const loginpage=function(req,res){
    if(req.session.user){
      return res.redirect('/home')
    }
    if(req.session.admin){
     return res.redirect('/admin')
    }
    else{
     return res.render('login')
    }
  }

  const registerPage=function(req,res){
    if(req.session.loggedIn){
     return res.redirect('/home')
    }else{
     return res.render('register')
    }
  }

  async function userRegister(req,res){
    try{
    
     const fullName = req.body.fullName.trim();
     const phone = req.body.phone.trim();
     const email= req.body.email.trim();
     const password= req.body.password.trim();
     const gender= req.body.gender.trim();
   
     if (fullName==="" || phone==="" || email==="" || password==="" || gender===""){
       return res.render("register", {
         errorMessage: "All fields required"
       })
     }
     if(phone.length <8|| phone.length >12){
       return res.render("register",{
         errorMessage:"phone number length should be between 8 to 12 digits"
       })
     }
   
   
     if (gender!=="male"&& gender !=="female"){
       return res.render("register",{
         errorMessage:"gender should be male or female"
       })
     }
     const dbEmail= await User.findOne({email:email});
     if (dbEmail===null){
   
       const hashedPass=await bcrypt.hash(password, 10);
   
       const user = await User.create({
         fullName: fullName,
         phone:phone,
         email: email,
         password:hashedPass,
         gender:gender,
         role: "user"
       });
       if(user){
         console.log("account created")
  req.session.user = user;
   req.session.loggedIn = true;
  req.session.fullName=fullName;
  // console.log("user created and signuped");
         return res.redirect("/home")
       
       }
     }else{
       
       return res.render("register",{
         errorMessage: "user already exist, kindly login"});
     }
    }catch(err){
     console.log(err);
     return res.render("register", { errorMessage: "An error occurred during registration" });
    }
   }
   async function userLogin(req, res) {
    try{
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email, role: "user" });
    const admin = await User.findOne({ email: email, role: "admin" });
  
    if (user || admin) {
      const currentUser = user || admin;
      // Compare the plain text password with the hashed password using bcrypt
      const passwordMatch = await bcrypt.compare(password, currentUser.password);
  
      if (passwordMatch) {
        console.log(currentUser.role + " login successful");
        req.session.user = user;
        req.session.admin = admin;
        req.session.loggedIn = true;
        req.session.username=currentUser.username
        if (req.session.user) {
          console.log("user authentication successs");
         return res.redirect("/home")
        } else if (req.session.admin) {
          console.log("admin authentication successs");
         return res.redirect("/admin")
        }
      } else {
        console.log("Invalid password");
        return res.render("login", { errorMessage: "Invalid password" });
      }
    } else {
      console.log("User not found");
      return res.render("login", { errorMessage: "User not found" });
    }
  } catch (err) {
    console.log(err);
  }}
  const homePage=function(req,res){
    if (req.session.loggedIn){
          res.render("home");
           }else{
             res.redirect("/")
            }
    
  }


  
const logout=function(req,res){
    req.session.destroy()
    res.redirect('/');
  }
  
  module.exports = { userRegister, userLogin ,loginpage,registerPage,logout,homePage}