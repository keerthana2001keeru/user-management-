const express = require("express");
const cookieParser = require("cookie-parser");

const session = require("express-session");
const hbs = require("express-handlebars")
const path = require("path");
const app = express();
const mongoose=require('mongoose');
require("dotenv").config();
const port = process.env.PORT ||3000;
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
require('./config/connection')
// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 600000 },
}));

app.engine("hbs", hbs.engine({
  extname:"hbs",
  defaultLayout: "layout",
  layoutsDir: __dirname+ "/views/layouts"
}));


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname,"public")));

app.use("/admin", adminRouter);
app.use("/", userRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
