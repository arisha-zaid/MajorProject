const express = require('express');
// router of express
const router = express.Router({mergeParams:true}); 
// Requiring Review Model
const Review=require("../models/review.js");
// Error handing using Wrapper Function
const wrapAsync=require("../utils/wrapAsync.js");
// Step 1: Listing Schema preps
const Listing=require('../models/listing.js');
// Error handling using Express Error Handler
const ExpressError=require("../utils/ExpressError.js");
// Validation Middleware
const {ReviewValidate ,isLoggedIn, isReviewAuthor}=require("../middleware.js");
// review controller
const reviewController=require('../controller/review.js');

  // Review Routes
  // post
  router.post("/",
    isLoggedIn,
    ReviewValidate,
    wrapAsync(reviewController.createReview));
  
  // Delete Reviews
  router.delete("/:reviewsId",
     isLoggedIn,
     isReviewAuthor,
     wrapAsync(reviewController.deleteReview));

  module.exports =router;
  