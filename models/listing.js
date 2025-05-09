const mongoose=require("mongoose");
const reviews = require("./reviews");
const Schema=mongoose.Schema;
const Review=require("./reviews");
const { ref } = require("joi");



const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  category: {  // ← MOVE HERE
    type: String,
    enum: [
      "Trending",
      "Rooms",
      "Iconic cities",
      "Mountains",
      "Castles",
      "Amazing Pools",
      "Camping",
      "Farm",
      "Arctic",
      "Domes",
      "Boats"
    ],
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});


  listingSchema.post("findOneAndDelete",async(listing)=>{
    if (listing) {
      await Review.deleteMany({_id:{$in:listing.reviews}});
      
    }
  })

const Listing =mongoose.model("Listing",listingSchema);
module.exports=Listing;
