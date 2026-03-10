const Listing = require("../models/listing");
const Review = require("../models/reviews");

module.exports.createReview = async (req, res) => {
  console.log("controller hit");
  console.log(req.user);
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  newReview.author = req.user._id;

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  // 💡 If the request came from React (axios), respond with JSON.
  //    If it came from the old EJS form, redirect as before.
  // if (req.accepts("json") && !req.accepts("html")) {
  //   return res.json({ success: true, message: "Review created" });
  // }
  // req.flash("success", "new review is created");
  // res.redirect(`/listings/${listing._id}`);
  return res.status(200).json({
    message: "review added successfully",
    review: newReview,
  });
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  //use of mongo pull function
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  const deletedReview = await Review.findByIdAndDelete(reviewId);

  return res.status(200).json({
    message: "review deleted successfully",
    deletedReview: deletedReview,
  });
};
