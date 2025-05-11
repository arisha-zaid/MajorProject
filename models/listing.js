const mongoose = require('mongoose');
const Review = require('./review');

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    } ,
    description: String,
    image: {
        filename: {
             type: String,
             default:'listing_name',
              },
        url:{
             type: String,
             default:"https://media.istockphoto.com/id/501386854/photo/tropical-modern-villa.jpg?s=612x612&w=0&k=20&c=791hJ7BkqtFRvqqu7Ke6Hourkfg3lkNy5OQWrCz76UY=",
        set:(v) => v===''? "https://media.istockphoto.com/id/501386854/photo/tropical-modern-villa.jpg?s=612x612&w=0&k=20&c=791hJ7BkqtFRvqqu7Ke6Hourkfg3lkNy5OQWrCz76UY=":v
     }
    },
    price: Number,
    location:String,
    country:String,
    reviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      },
   ],
   owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
   },

   
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
    
});

listingSchema.post('findOneAndDelete', async (listing) =>{
    if (listing) {
        await Review.deleteMany({ _id: {$in : listing.reviews} });
    }
});

const Listing = mongoose.model("Listing", listingSchema); // Capitalize 'Listing'
module.exports = Listing;
