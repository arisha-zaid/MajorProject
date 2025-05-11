const mongoose=require('mongoose');
const initData=require('./data.js');
const Listing=require('../models/listing.js');
const User = require('../models/user.js'); // ✅ Import your User model
const Review = require('../models/review.js');
const ObjectId = mongoose.Types.ObjectId;

main()
   .then(() => console.log("connected to db"))
   .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// Done insertion
const initDb= async () => {
    await Listing.deleteMany({});
    await User.deleteMany({});
    const userId = new ObjectId('67e68715c08c1c321b2e8cf2');

    //  ✅ Insert dummy user
  await User.create({
    _id: userId,
    username: 'testuser',
    email: 'test@example.com',
    // add password if you're using authentication logic
  });

    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: userId, // Properly assigned ObjectId
      geometry: {
        type: 'Point',
        coordinates: [80.9462, 26.8467] // Replace with actual longitude and latitude
    }
    }));
    
    await Listing.insertMany(initData.data);
    console.log("Data is inserted to Db");
}

initDb();
