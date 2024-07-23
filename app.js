const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const session = require("express-session");
const hbs = require("express-handlebars")
const path = require("path");

require('./helpers/handlebarsHelpers');
const app = express();

require("dotenv").config();
const port = process.env.PORT ||3000;
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const errorHandler = require('./middleware/errorHandler'); // Import the error handler
require('./config/connection')
// Middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 600000 },
}));
// app.engine('hbs', exphbs({ extname: '.hbs' }));
app.engine("hbs", exphbs.engine({
  extname:'.hbs',
  defaultLayout: "layout",
  layoutsDir: __dirname+ "/views/layouts"
}));


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use('/',express.static(path.join(__dirname,"public")));
app.use('/admin',express.static(path.join(__dirname,"public")));

app.use("/admin", adminRouter);
app.use("/", userRouter);
// Use the error handler middleware
app.use(errorHandler);
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
