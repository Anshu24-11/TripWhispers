const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const { validatereview, isloggedin, isauthor } = require("../middleware.js");

const reviewcontroller = require("../controller/review.js");

//Reviews

//post review route
router.post(
  "/",
  isloggedin,
  validatereview,
  wrapAsync(reviewcontroller.createReview),
);

//Delete review route
router.delete(
  "/:reviewId",
  isloggedin,
  isauthor,
  wrapAsync(reviewcontroller.destroyReview),
);

module.exports = router;
