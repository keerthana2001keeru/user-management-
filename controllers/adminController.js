

const User=require("../models/userSchema")

const bcrypt = require("bcrypt")


async function adminPage(req,res){
    if(req.session.admin){
      const allUsers = await User.find({role:"user"}).lean()
      return res.render('admin',{user:allUsers})
    }else{
      res.redirect('/')
    }
  }
  async function adminPage(req,res){
  if(req.session.admin){
    const allUsers = await userSchema.find({role:"user"}).lean()
    return res.render('admin',{users:allUsers})
  }else{
    res.redirect('/')
  }
}
async function userDelete(req,res){
  const userId = req.params.id
  console.log(userId)
  const deletedUser = await userSchema.deleteOne({_id:userId})
  console.log(deletedUser);
  if(deletedUser){
    res.redirect('/admin')
  }else{
    res.send('failed to delete')
  }

  // async function userDelete(req,res){
  //   const userId = req.params.id
  //  try{
  //   const deletedUser = await User.findByIdAndUpdate({_id:userId,
  //     {isDeleted:true,

  //   })
  //  }
   
   
    if(!deletedUser){
      res.redirect('/admin')
    }else{
      res.send('failed to delete')
    }
  }

  async function searching(req,res){
    const word = req.body.keyword
    const allUsers = await User.find({
      fullName: { $regex: `^${word}`, $options: 'i' },role: 'user'}).lean();
      res.render('admin',{user:allUsers})
  }

  async function userEdit(req,res){
    const userId = req.params.id
    const user = await User.findOne({_id:userId}).lean()
   res.render("editUser", {data:user});
   }
   async function updateEdit(req,res){
    const stringId = req.params.id;
    const userId=new Object(stringId);
    const fullName= req.body.fullName.trim();
    const phone = req.body.phone.trim();
    const email =req.body.email.trim();
    const gender = req.body.gender.trim();
    
    if (!fullName ==="" || !phone ==="" || !email===""|| !gender ==="") {
      return res.render("editUser", {errorMessage: "All fields required"})
    }
    if (phone.length < 8 || phone.length > 10) {
      return res.render("editUser",{errorMessage: "phone no. must be 10 to 12 digits"})
    }
    if (gender !== "male" && gender !== "female") {
      return res.render("editUser", {errorMessage: "gender must be male or female" })
    }
    
    const updateUser = await User.findOneAndUpdate({_id:userId},{$set:{
        fullName:fullName,
        phone:phone,
        email:email,
        gender:gender
    },
},{new:true});
if(updateUser){
    res.redirect("/admin");
   }};


   const userAddPage = (req,res)=>{
    res.render("adduser")
    }


    async function userAdd(req,res){
        const fullName=req.body.fullName.trim();
        const phone=req.body.phone.trim();
        const email= req.body.email.trim();
        const password= req.body.password.trim();
        const gender= req.body.gender.trim();
        const role="user"
        if (fullName === "" || phone === "" || email === "" || password === "" || gender === "") {
          return res.render("adduser", {errorMessage: "All fields require"})
        }
        if (phone.length < 8 || phone.length > 10) {
          return res.render("adduser", {errorMessage: "phone no. must be 10 to 12 digits"})
        }
        if (gender !== "male" && gender !== "female") {
          return res.render("adduser", {errorMessage: "gender must be male or female" })
        }
      
       
      
        const hashedPass=await bcrypt.hash(password,10);
    
        
        const Email= await User.findOne({email:email});
        if (Email===null){
            const user = await User.create({
                fullName:fullName,
                phone:phone,
                email:email,
                password:hashedPass,
                gender:gender,
                role:role
            });
       
            if (user){
                console.log("user created");
                req.user=user;
                res.redirect("/admin")
            }
        }else{
            res.render("admin",{
                errorMessage:"user already exist"
            });
        }
    };

  module.exports={adminPage, userDelete,searching,userEdit,updateEdit,userAddPage,userAdd}