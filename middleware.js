const Listing=require("./models/listing");
const Review=require("./models/reviews.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingschema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");



module.exports.isloggedin = (req, res, next) => {
    // console.log(req.originalUrl);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl;
      req.flash('error', "You must be logged in to create listings");
      return res.redirect("/login"); // ✅ Added return here
    }
    next(); // ✅ Only runs if user is authenticated
  };

  module.exports.redirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;

    }
    next();
  };
  

module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params;  
  let listing=await Listing.findById(id);
if (!listing.owner.equals(res.locals.currUser._id)) {
  req.flash("error","You are not owener of this lisitng");
  return res.redirect(`/listings/${id}`);

} 
next();
};



module.exports.validatelisting=(req,res,next)=>{
 let {error}=listingschema.validate(req.body);

    if (error) {
      let errormsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errormsg);
    }else{
      next();
    }
  };


  module.exports.validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
   
       if (error) {
         let errormsg=error.details.map((el)=>el.message).join(",");
         throw new ExpressError(400,errormsg);
       }else{
         next();
       }
     };


     module.exports.isauthor = async (req, res, next) => {
      let { id, reviewId } = req.params;
      let review = await Review.findById(reviewId).populate('author'); // populate author
  
      if (!review.author.equals(res.locals.currUser._id)) {
          req.flash("error", "You did not create this review");
          return res.redirect(`/listings/${id}`);
      }
      next();
  };

  module.exports.isAdmin=async(req,res,next)=>{
    if (req.isAuthenticated()&&req.user.role=="admin") {
      return next();

    }
    req.flash("error","you are not authorized to access this page");
    return res.redirect("/login");
  }
  