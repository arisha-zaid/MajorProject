const Listing=require('./models/listing.js');
const Review=require('./models/review.js');
// Error handling using Express Error Handler
const ExpressError=require("./utils/ExpressError.js");
// Using Schema Validator "joi" to validate and handle error for server side in Schema
const {listingSchema ,reviewSchema}=require("./schema.js");

module.exports = {
  isLoggedIn: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.redirectUrl = req.originalUrl;
      req.flash("error", "You must be logged in!");
      return res.redirect("/login");
    }
    next();
  },
  
  saveRedirectUrl: (req, res, next) => {
    if (req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl;
      delete req.session.redirectUrl;
    }
    next();
  },

   isOwner: async(req,res,next) =>{
    const {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing || !listing.owner || !listing.owner._id.equals(res.locals.currUser._id)){
      req.flash('error','You are not the owner of this listing!');
      return res.redirect(`/listings/${id}`);
   }
   next();
  },

  // Step 2: Schema Validation Middleware
   SchemaValidate : (req,res,next) => {
       let {error}=listingSchema.validate(req.body.listing);
       if(error){
        console.log("Errors:",error);
        console.log("Request body:", req.body);
         let errmsg=error.details.map(el=>el.message);
          throw new ExpressError(error,400)
       }
       else{
           next();
       }
  },

  // Review Schema validate
   ReviewValidate : (req,res,next) => {
      let {error}=reviewSchema.validate(req.body);
      if(error){
        let errmsg=error.details.map(el=>el.message);
         throw new ExpressError(error,400)
      }
      else{
          next();
      }
    },

    isReviewAuthor: async(req,res,next) =>{
      const {id, reviewsId}=req.params;
      let review=await Review.findById(reviewsId);

      if(!review.author.equals(res.locals.currUser._id)){
        req.flash('error','You are not the owner of this listing!');
        return res.redirect(`/listings/${id}`);
     }
     next();
    },
    
};