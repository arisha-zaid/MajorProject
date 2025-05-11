const Listing=require('../models/listing.js');
const mbxClient = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxClient({ accessToken: mapToken });


module.exports.index =async (req,res) => {
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.createNewListing=async (req,res,next) => {

   let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
    .send()
   
    let url=req.file.path;
    let filename=req.file.filename;
    
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url, filename};

    newListing.geometry=response.body.features[0].geometry;

    let savedListing= await newListing.save();

    console.log(savedListing);
    req.flash("success","Successfully created a new listing");
    res.redirect("/listings");
};

module.exports.showListing= async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id).
    // we are using nested population to get reviews and owner details
    populate({
      path:"reviews",
      populate:{
          path:'author'
      }
    }).
    populate('owner');
    if(!listing){
      req.flash("error","Listing you requested for does not exist");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing})
};

module.exports.createEditListing=async (req,res) => {
  let {id}=req.params;
   const listing=await Listing.findById(id);
   if(!listing){
    req.flash("error","Listing you requested for does not exist");
    return res.redirect("/listings");
  }
    const originalUrl=listing.image.url;
    originalUrl.replace("/upload/","/upload/h_150,w_150")
    res.render("listings/edit.ejs",{listing, originalUrl});
};

module.exports.updateListing=async (req,res) => {
    let {id}=req.params;

    // First, get the original listing to preserve the image if no new one is uploaded
    const originalListing = await Listing.findById(id);
    
    // Create a copy of the listing data from the form
    const updatedData = {...req.body.listing};
    
    // If no new image was uploaded, remove the image property from the update
    // to prevent overwriting the existing image
    if (!req.file) {
        // Delete the image property from the update data to prevent overwriting
        delete updatedData.image;
    }
    
    // Update the listing with the modified data
    let listing = await Listing.findByIdAndUpdate(id, updatedData, {new: true});

    // If a new image was uploaded, update the image property
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }

    req.flash("success","Successfully updated Listing");
    res.redirect(`/listings/${id}`);
  };

module.exports.deleteListing=async (req,res) => {
  let {id}=req.params;
   const listing=await Listing.findByIdAndDelete(id);
 
   req.flash("success","Successfully Deleted listing");
    res.redirect("/listings");
};