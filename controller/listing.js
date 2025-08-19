const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };


module.exports.renderNewForm=(req,res)=>{

    res.render("listings/new.ejs");
};


module.exports.showListing=async (req,res)=>{
  let {id}=req.params; 
  const listing=await Listing.findById(id).populate({path:"reviews",
  populate:{
    path:"author"
  },
  }).populate("owner");
  if (!listing) {
    req.flash("error","Lisitng you requested for does not exist");
   return res.redirect("/listings");
  }
  
  res.render("listings/show.ejs",{listing,MAP_TOKEN: process.env.MAP_TOKEN }); 
};



module.exports.createListing = async (req, res, next) => {
  try {
    // 1. Validate required fields
    if (!req.body.listing?.category) {
      req.flash('error', 'Category is required');
      return res.redirect('/listings/new');
    }

    // 2. Log incoming data for debugging
    // console.log('Incoming listing data:', {
    //   category: req.body.listing.category,
    //   location: req.body.listing.location,
    //   file: req.file ? true : false
    // });

    // 3. Geocoding
    const response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    }).send();

    if (!response.body.features[0]) {
      req.flash('error', 'Location not found');
      return res.redirect('/listings/new');
    }

    // 4. File validation
    if (!req.file) {
      req.flash('error', 'Image is required');
      return res.redirect('/listings/new');
    }

    // 5. Create listing with ALL fields explicitly set
    const listingData = {
      ...req.body.listing,
      owner: req.user._id,
      image: {
        url: req.file.path,
        filename: req.file.filename
      },
      geometry: response.body.features[0].geometry
    };

    // 6. Create and save
    const newListing = new Listing(listingData);
    const savedListing = await newListing.save();
    
    // 7. Verify saved data
    // console.log('Saved listing with category:', {
    //   id: savedListing._id,
    //   category: savedListing.category
    // });

    req.flash('success', 'New listing created!');
    res.redirect('/listings');

  } catch (err) {
    console.error('Create listing error:', err);
    req.flash('error', 'Failed to create listing');
    res.redirect('/listings/new');
  }
};
// module.exports.createListing = async (req, res, next) => {
//   try {
//     console.log("MAP_TOKEN:", process.env.MAP_TOKEN); // Check if token exists

//     let response = await geocodingClient.forwardGeocode({
//       query: req.body.listing.location,
//       limit: 1,
//     }).send();

//     let url = req.file?.path;
//     let filename = req.file?.filename;

//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;
//     newListing.image = { url, filename };
//     newListing.geometry = response.body.features[0].geometry;

//     let savedListing = await newListing.save();
//     console.log("Saved listing:", savedListing);

//     req.flash("success", "New listing is created");
//     res.redirect("/listings");
//   } catch (err) {
//     console.error("Error in createListing:", err);
//     req.flash("error", "Something went wrong.");
//     res.redirect("/listings");
//   }
// };



  module.exports.renderEditform=async(req,res)=>{
    let {id}=req.params; 
    const listing=await Listing.findById(id);
    if (!listing) {
      req.flash("error","Lisitng you requested for does not exist");
      return res.redirect("/listings");
    }

   let originalimageurl=listing.image.url;
    originalimageurl=originalimageurl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalimageurl});
  };


module.exports.updateListing=async (req,res)=>{
  
    let {id}=req.params;  
   let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});


   if (typeof req.file !=="undefined") {
     
     let url=req.file.path;
     let filename=req.file.filename;
     listing.image={url,filename};
     await listing.save();
   }
   

    req.flash("success"," listings is updated");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing=async(req,res)=>{
    // let {id}=req.params;
    // const deletelistings=await Listing.findByIdAndDelete(id);
    // req.flash("success"," listings is deleted");
    // res.redirect("/listings");
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing not found");
return res.redirect("/listings");
    }
   const isOwner = listing.owner.equals(req.user._id);
   const isAdmin = req.user.role === "admin";

   if (isOwner||isAdmin) {
    await listing.deleteOne();
    req.flash("success","Listing Deleted Successfully");
    return res.redirect("/listings");
   }else{
    req.flash("error", "You are not authorized to delete this listing");
     return res.redirect(`/listings/${id}`);
   }
   
};

module.exports.filterlisting=async (req, res) => {
      const { category } = req.params;
      const listings = await Listing.find({ category });
      console.log(listings);
      if (listings.length==0) {
        req.flash('error', 'There is no listngs for this filter');
       return res.redirect('/listings');
        
      }
      res.render("listings/filter", { listings });
  };


module.exports.indexpage=(req,res)=>{
  res.send("Hiii");
}