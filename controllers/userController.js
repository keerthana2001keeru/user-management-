const adminHandler = require("../helpers/adminHelper");

const userHandler = require("../helpers/userHelper");

const bcrypt = require("bcrypt");

const loginpage = function (req, res) {
  res.setHeader("Cache-Control", "no-cache, no-store , must-revalidate");
  if (req.session.user) {
    return res.redirect("/home");
  }
  // if (req.session.admin) {
  //   return res.redirect("/admin");
  // }
   else {
    return res.render("login",{formData:{}});
  }
  
};

const registerPage = function (req, res) {
  res.setHeader("Cache-Control", "no-cache, no-store , must-revalidate");
  if (req.session.loggedIn) {
    return res.redirect("/home");
  } else {
    return res.render("register",{formData:{}});
  }
};

async function userRegister(req, res, next) {
  try {
    const { fullName, phone, email, password } = req.body;

    if (!fullName || !phone || !email || !password) {
      return res.render("register", {
        // errorMessage: "All fields are required",
        formData:req.body
      });
    }

    const existingUser = await userHandler.findUserByEmail(email);
    if (existingUser) {
      return res.render("register", {
        errorMessage: "User already exists, kindly login",
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
    // console.log("user created and signuped");
    return res.redirect("/home");
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.render("register",
         { errorMessage: err.message, formData :req.body});
    }
    next(err);
  }
}
async function userLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await userHandler.findUserByEmail(email);
    
    const currentUser = user;
    if (currentUser) {
      // Compare the plain text password with the hashed password using bcrypt
      const passwordMatch = await bcrypt.compare(
        password,
        currentUser.password
      );

      if (passwordMatch) {
        req.session.user = user ;
        req.session.loggedIn = true;
        req.session.username = currentUser.fullName;
        return res.redirect( "/home");
      } else {
        
        return res.render("login", { errorMessage: "Invalid password",formData:req.body });
      }
    } else {
      
      return res.render("login", { errorMessage: "User not found" , formData:req.body});
     
    }
  } catch (err) {
    next(err);
  }
}
const homePage = function (req, res) {
  res.setHeader("Cache-Control", "no-cache, no-store , must-revalidate");
  if (req.session.loggedIn) {
    res.render("home");
  } else {
    res.redirect("/");
  }
};

const logout = function (req, res) {
  res.setHeader("Cache-Control", "no-cache, no-store , must-revalidate");
  req.session.destroy();
  res.redirect("/");
};

module.exports = {
  userRegister,
  userLogin,
  loginpage,
  registerPage,
  logout,
  homePage,
};
