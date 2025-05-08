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



module.exports.createListing=async (req,res,next)=>{

  console.log("FILE RECEIVED:", req.file);
console.log("BODY RECEIVED:", req.body);


    let response=await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
     limit:1,
    })
      .send()
      


  let url=req.file.path;
  let filename=req.file.filename;
  

    const newListing=new Listing(req.body.listing)
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    let savedlisting=await newListing.save();
    console.log(savedlisting);
  req.flash("success","new listings is created");
   res.redirect("/listings");
   
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
    let {id}=req.params;
    const deletelistings=await Listing.findByIdAndDelete(id);
    req.flash("success"," listings is deleted");
    res.redirect("/listings");
};

