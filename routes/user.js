const express = require('express');
const router = express.Router();
const User=require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync');
// Passport is a flexible authentication middleware for Node.js. It provides an interface that allows you to plug in different strategies for authenticating users.
const passport = require('passport');
const { isLoggedIn, saveRedirectUrl } = require("../middleware.js");
const userController=require('../controller/user.js');

router
     .route('/signup')
     // GET /signup
     .get( (req, res) => {
     res.render("user/signup.ejs");
     })
     // POST /signup
    .post(wrapAsync(userController.signup));

router
     .route('/login')
     // GET /login
     .get( (req,res) => {
     res.render("user/login.ejs");
     })
     // POST /login
    .post(saveRedirectUrl,
         passport.authenticate("local",{
             failureRedirect: "/login",
             failureFlash:true,
         }),
         userController.login);

// In your routes file
console.log(saveRedirectUrl); // Should show [Function: saveRedirectUrl]

// logout
router.get('/logout',userController.logout);

module.exports = router;