const Booking = require("../models/booking");
const Listing = require("../models/listing");
const {sendMail}=require("../utils/mailer");
const { bookingConfirmationTemplate } = require("../utils/emailtemplets");
const {bookingCancellationTemplate}=require("../utils/emailtemplets");


module.exports.createBooking = async (req, res) => {
  try {
    const { listingId, startDate, endDate } = req.body;
    const listing=await Listing.findById(listingId);

    if (!listing) {
      req.flash("error","Listing not found");
      return res.redirect("back");
    }

    const start=new Date(startDate);
    const end=new Date(endDate);
    const today=new Date();

    if(start<today.setHours(0,0,0,0)){
      req.flash("error","start date can not be in past");
      return res.redirect("back");
    }
    if(end<=start){
      req.flash("error","End date must be after start date");
      return res.redirect("back");
    }


    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      req.flash("error","invalid dates");
      return  req.redirect("back");
    }

    //nights counting
    const diff=end-start;
    const nights=Math.ceil(diff/(1000*60*60*24));

    if (nights<=0) {
      req.flash("error","end date must be after start date");
      return req.redirect("back");
    }

    //counting price
    const totalPrice=nights*listing.price;

    const booking = new Booking({
      user: req.user._id,
      listing: listingId,
      startDate,
      endDate,
      totalPrice
    });
    await booking.save();
    // TODO: send email after booking

    const html=bookingConfirmationTemplate(req.user.username,listing.title,booking.startDate,booking.endDate);
    await sendMail(req.user.email,"Booking Confirmation - TripWhispers",html);





    req.flash("success", "Booking successful!");
    res.redirect(`/listings/${listingId}`);
  } catch (err) {
    console.log(err);
    req.flash("error", "Failed to create booking");
    res.redirect("back");
  }
};

module.exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("listing");
    res.render("booking/userBooking", { bookings });
  } catch (err) {
    console.log(err);
    req.flash("error", "Cannot load your bookings");
    res.redirect(req.get("Referrer") || "/");

  }
};

module.exports.cancelBooking=async(req,res)=>{
  try{

    const booking=await Booking.findById(req.params.id).populate("listing user");

    if(!booking){
      req.flash("error","booking not found");
      return res.redirect("back");
    }

    const today = new Date();
    if (booking.startDate <= today) {
    req.flash("error", "You cannot cancel a booking that has already started.");
    return res.redirect("booking/mybookings");
    }

    await booking.deleteOne();

    const html=bookingCancellationTemplate(req.user.username,booking.listing.title,booking.startDate);
    await sendMail(req.user.email, "Booking Cancelled - TripWhispers", html);

   

    req.flash("success","Booking cancelled successfully and email sent!");
    res.redirect("/bookings/mybookings");


  }catch(err){
    req.flash("error", "Could not cancel booking.");
    res.redirect("/bookings/mybookings");
  }
};
