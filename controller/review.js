const Listing=require('../models/listing.js');
const Review=require('../models/review.js')

module.exports.createReview= async (req,res) => {
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let newreview=new Review(req.body.review);
  
    newreview.author=req.user._id;
    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();
  
    console.log("review added successfully");
    req.flash("success","review added successfully");
    res.redirect(`/listings/${listing._id}`);
  };

module.exports.deleteReview=async (req,res) => {
    let {id,reviewsId}=req.params;
    
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewsId}});
    await Review.findByIdAndDelete(reviewsId);
   
    req.flash("success","Successfully deleted the review");
    res.redirect(`/listings/${id}`);
  }