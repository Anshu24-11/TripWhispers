const mongoose = require('mongoose');
const Listing = require('../models/listing'); // path to your model
const { data: seedData } = require('./data');
// your seed data file

mongoose.connect('mongodb://127.0.0.1:27017/wanderlustt')
  .then(() => {
    console.log("Database connected ✅");
  })
  .catch((err) => {
    console.log("Database connection error ❌");
    console.log(err);
  });

  const seedDB = async () => {
    // Delete all existing listings
    await Listing.deleteMany({});
    console.log("Old listings removed 🗑️");
  
    // Optional log to check images
    seedData.forEach(item => {
      console.log("Inserting image:", item.image);
    });
  
    // Add custom fields like 'owner' and 'createdAt'
    const modifiedData = seedData.map(obj => ({
      ...obj,
      owner: "680747caf7469b077de5ba35", // fix key name
      createdAt: new Date() // optional extra field
    }));
  
    // Insert new data
    await Listing.insertMany(modifiedData);
    console.log("New data seeded ✅");
  };
  
  seedDB().then(() => {
    mongoose.connection.close();
  });
  

seedDB().then(() => {
  mongoose.connection.close(); // close connection after done
});
