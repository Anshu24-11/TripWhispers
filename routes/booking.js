const express = require("express");
const router = express.Router();
const bookingController = require("../controller/booking");
const { isloggedin } = require("../middleware");

router.post("/", isloggedin, bookingController.createBooking);
router.get("/mybookings", isloggedin, bookingController.getUserBookings);
router.delete("/:id",isloggedin,bookingController.cancelBooking);

module.exports = router;
