// dotenv for cloudinary 
if(process.env.NODE_ENV  != 'production'){
require('dotenv').config()
}

const express = require('express');
const app=express();
const mongoose=require("mongoose");
// step 2:
const path=require("path");
// Step 5: to edit
const methodOverride=require("method-override");
// phase 2:Designing and layout using EJS Mate 
const ejsMate=require("ejs-mate");
// Error handling using Express Error Handler
const ExpressError=require("./utils/ExpressError.js");
// const { wrap } = require('module');
// require listings router
const listingRouter=require("./routes/listing.js");
// require reviews router
const reviewRouter=require('./routes/review.js');
// require user router
const UserRouter=require("./routes/user.js");
// express session npm package for cookies
const session=require("express-session");
// Mongo session store for storing session data in mongodb
const MongoStore = require('connect-mongo');
// connect-flash npm package for flash messages
const flash=require("connect-flash");
// require passport npm package for authentication
const passport=require("passport");
// require local strategy for passport
const LocalStrategy=require("passport-local");
// require user model from models folder
const User=require("./models/user.js");

// Configure Mongoose to use the new URL parser and unified topology
mongoose.set('strictQuery', false);

// Import the database connection module
const { connectDB } = require('./db');

// Connect to MongoDB with fallback options
connectDB().catch(err => console.error('Database connection error:', err));


//step 2: Listing index page
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
// step 3: Show route for particular id
app.use(express.urlencoded({extended:true}));
// step 5:To edit route
app.use(methodOverride("_method"));
// phase 2:Designing and layout using EJS Mate 
app.engine("ejs",ejsMate);
// for css in phase 2
app.use(express.static(path.join(__dirname,'public')));

// Mongo Store for saving session data in mongodb
const store=MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*60*60,// after every day update the last accessed time of a session
})

store.on("error",(e) => {
console.log("session store error",e)
});

// express session middleware
const saveOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expire:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true
  }
}

app.use(session(saveOptions));
// connect-flash middleware
app.use(flash());

// Since passort uses sessions we need to initialize the session first before initializing passport.
// Initializing local strategy with user model
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// serializing and deserializing users
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware for setting up flash messages
app.use((req,res,next) => {
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  // use to check if req.user is undefined means log out and if has an object then..
  // usage in navbar js to show only logout when already login and vice versa
  res.locals.currUser=req.user;
  next();
})

// Using listing routes 
app.use("/listings",listingRouter);
// Using review routes 
app.use("/listings/:id/reviews",reviewRouter);
// using user routes
app.use("/",UserRouter);


// USer Signup Route
app.get("/demoUser", async (req,res) =>{
       const fakeUser=new User({
        username:"DemoUser",
        email:"demo@gmail.com"
   })
    let registeredUser=await User.register(fakeUser,"demopassword");
    res.send(registeredUser);
})

// Error Handling for wrong path
app.all("*",(req,res,next) => {
    next(new ExpressError("Page Not Found",404))
})

// Error Handler Middleware
app.use((err,req,res,next) => {
   const{statusCode=500,message="Something went wrong"}=err;
   res.render("listings/error.ejs",{message});
  //  res.status(statusCode).render("error.ejs",{message});
})

app.listen(8080,() => {
    console.log("server is running on port 8080");
})