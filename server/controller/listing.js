const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.json({ allListings });
  // res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Lisitng you requested for does not exist");
    return res.redirect("/listings");
  }
  res.json({ listing });

  // res.render("listings/show.ejs", {
  //   listing,
  //   MAP_TOKEN: process.env.MAP_TOKEN,
  // });
};

module.exports.createListing = async (req, res) => {
  try {
    if (!req.body.listing?.category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    const response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    if (!response.body.features[0]) {
      return res.status(400).json({
        success: false,
        message: "Location not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const listingData = {
      ...req.body.listing,
      owner: req.user._id,
      image: {
        url: req.file.path,
        filename: req.file.filename,
      },
      geometry: response.body.features[0].geometry,
    };

    const newListing = new Listing(listingData);
    await newListing.save();

    res.status(201).json({
      success: true,
      listing: newListing,
    });
  } catch (err) {
    console.error("Create listing error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to create listing",
    });
  }
};
module.exports.renderEditform = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Lisitng you requested for does not exist");
    return res.redirect("/listings");
  }

  let originalimageurl = listing.image.url;
  originalimageurl = originalimageurl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalimageurl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  return res
    .status(200)
    .json({ success: true, messsage: "Listing edited successfully" });
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  const isOwner = listing.owner.equals(req.user._id);
  const isAdmin = req.user.role === "admin";

  if (isOwner || isAdmin) {
    await listing.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "You are not authorized to delete the listing",
    });
  }
};

module.exports.filterlisting = async (req, res) => {
  const { category } = req.params;
  const listings = await Listing.find({ category });

  if (listings.length == 0) {
    req.flash("error", "There is no listngs for this filter");
    return res.redirect("/listings");
  }
  res.render("listings/filter", { listings });
};

module.exports.indexpage = (req, res) => {
  res.send("Hiii");
};

module.exports.searchListings = async (req, res) => {
  const { query } = req.query;

  const listings = await Listing.find({
    title: { $regex: query, $options: "i" },
  });

  res.json({ listings });
};
