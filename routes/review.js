const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js")
const {validatereview, isloggedin, isauthor}=require("../middleware.js");

const reviewcontroller=require("../controller/review.js");


//Reviews

//post review route
router.post("/",isloggedin,validatereview,wrapAsync(reviewcontroller.createReview));


//Delete review route
router.delete("/:reviewId",isauthor,isloggedin,wrapAsync(reviewcontroller.destroyReview));




module.exports=router;