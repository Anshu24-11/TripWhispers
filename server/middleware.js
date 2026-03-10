const Listing = require("./models/listing");
const Review = require("./models/reviews.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingschema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");

module.exports.isloggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    return res.status(400).json({
      success: false,
      message: "Please log in",
    });
  }
  next();
};

module.exports.redirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    return res.status(400).json({
      success: false,
      message: "You are not owener of this lisitng",
    });
  }

  next();
};

module.exports.validatelisting = (req, res, next) => {
  let { error } = listingschema.validate(req.body);

  if (error) {
    let errormsg = error.details.map((el) => el.message).join(",");
    return res.status(400).json({
      success: false,
      message: errormsg,
    });
  } else {
    next();
  }
};

module.exports.validatereview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errormsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errormsg);
  } else {
    next();
  }
};

module.exports.isauthor = async (req, res, next) => {
  let { reviewId } = req.params;

  const review = await Review.findById(reviewId).populate("author");
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You did not create this review");
    // throw new ExpressError(400, "you did not created this review");
    return res.status(400).json({
      error: "you did not created this review",
    });
  }
  next();
};

module.exports.isAdmin = async (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == "admin") {
    return next();
  }
  req.flash("error", "you are not authorized to access this page");
  return res.redirect("/login");
};
