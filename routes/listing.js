const express = require('express');
const router = express.Router();
// Step 1: Listing Schema preps
const Listing=require('../models/listing.js');
const wrapAsync=require("../utils/wrapAsync.js");
// requiring isOwner middleware for authorization through routes or hoppscotch requests
const { isLoggedIn ,isOwner, SchemaValidate } = require("../middleware.js");
// Controller -> listing callbacks
const listingController= require('../controller/listing.js');
// cloudinary is used to store images in cloud storage
const {storage}=require("../cloudconfig.js");
// Multer is use for uploading files
const multer  = require('multer')
const upload = multer({ storage }) // multer will store image in storage in cloud


router
    .route('/')
    .get(wrapAsync(listingController.index))
    .post(
      isLoggedIn,
      SchemaValidate,
      upload.single('listing[image][url]'),
      wrapAsync(listingController.createNewListing));

 

// step 4: New Route for Creating a new listing
// Note! we are kepping step 4 above 3 cuz otherwise , its taking new as id and showing the error
router.get("/new",
        isLoggedIn,
        (req,res) =>{
       res.render("listings/new.ejs")
       })
// app.post("/listings",async (req,res,next) => {
//   try{
//     const newListing=new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
//     // console.log(req.body.listing);
//   }
//   catch(err){
//     next(err);
//   }   
// })
// OR
     
// step 3: listing show page, Show route for particular id
router
    .route('/:id')
    .get(wrapAsync(listingController.showListing))
    // Step 6: Delete Route
    .delete(isLoggedIn,
      isOwner, // after checking login status, check owner of the listing
     wrapAsync(listingController.deleteListing))
     .put(isLoggedIn,
          isOwner,// after checking login status, check owner of the listing
          upload.single('listing[image][url]'), //multer will parse the file from request body and save it into req.file
          SchemaValidate, 
          wrapAsync(listingController.updateListing))

// Step 5: Edit Route and Update Route
router.get("/:id/edit",
     isLoggedIn,
     isOwner, // after checking login status, check owner of the listing
    wrapAsync(listingController.createEditListing));


module.exports=router;