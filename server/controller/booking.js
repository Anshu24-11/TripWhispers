const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { sendMail } = require("../utils/mailer");
const { bookingConfirmationTemplate } = require("../utils/emailtemplets");
const { bookingCancellationTemplate } = require("../utils/emailtemplets");

module.exports.createBooking = async (req, res) => {
  try {
    const { listingId, startDate, endDate } = req.body;
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(400).json({
        success: false,
        message: "listing not found",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    if (start < today.setHours(0, 0, 0, 0)) {
      return res.status(400).json({
        success: false,
        message: "start date can not be in past",
      });
    }
    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "invalid dates",
      });
    }

    const diff = end - start;
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    //counting price
    const totalPrice = nights * listing.price;

    const booking = new Booking({
      user: req.user._id,
      listing: listingId,
      startDate,
      endDate,
      totalPrice,
    });
    await booking.save();

    const html = bookingConfirmationTemplate(
      req.user.username,
      listing.title,
      booking.startDate,
      booking.endDate,
    );
    await sendMail(req.user.email, "Booking Confirmation - TripWhispers", html);

    return res.status(200).json({
      messsage: "Booking created successfully",
      booking: booking,
    });
  } catch (err) {
    console.log(err);

    return res
      .status(400)
      .json({ success: false, message: "Failed to create booking" });
  }
};

module.exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate(
      "listing",
    );
    return res.status(200).json({
      success: true,
      message: "Your bookings",
      bookings: bookings,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      success: false,
      message: "Could not load your bookings",
    });
  }
};

module.exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "listing user",
    );

    if (!booking) {
      req.flash("error", "booking not found");
      return res.redirect("back");
    }

    const today = new Date();
    if (booking.startDate <= today) {
      req.flash(
        "error",
        "You cannot cancel a booking that has already started.",
      );
      return res.redirect("booking/mybookings");
    }

    await booking.deleteOne();

    const html = bookingCancellationTemplate(
      req.user.username,
      booking.listing.title,
      booking.startDate,
    );
    await sendMail(req.user.email, "Booking Cancelled - TripWhispers", html);

    req.flash("success", "Booking cancelled successfully and email sent!");
    res.redirect("/bookings/mybookings");
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    req.flash("error", "Could not cancel booking.");
    res.redirect("/bookings/mybookings");
  }
};
