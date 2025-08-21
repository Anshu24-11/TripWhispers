const { number, required, boolean } = require("joi");
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  totalPrice:{type:Number,required:true},
  email:{type:Boolean,default:false}
});

module.exports = mongoose.model("Booking", bookingSchema);
