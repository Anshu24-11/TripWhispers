const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {listingschema}=require("../schema.js");
const {reviewschema}=require("../schema.js");
const {isloggedin, isOwner,validatelisting}=require("../middleware.js");
const multer  = require('multer')
const{storage}=require("../cloudConfig.js");
const upload = multer({storage});

const listingcontroller=require("../controller/listing.js");

router.get("/new",isloggedin,listingcontroller.renderNewForm);

//edit route
router.get("/:id/edit",isloggedin,isOwner,wrapAsync(listingcontroller.renderEditform));

router.get("/category/:category", wrapAsync(listingcontroller.filterlisting));


router.route("/") //index route 
.get(wrapAsync(listingcontroller.index))
//create route 
.post(isloggedin,upload.single("listing[image]"),validatelisting,wrapAsync(listingcontroller.createListing)); 

 


 router.route("/:id") 
 //update route 
.put(isloggedin,isOwner,upload.single("listing[image]"),validatelisting,wrapAsync(listingcontroller.updateListing)) 
 //show 
.get(wrapAsync(listingcontroller.showListing)) 
 //delete route
.delete(isloggedin,isOwner,wrapAsync(listingcontroller.destroyListing)); 



module.exports=router;