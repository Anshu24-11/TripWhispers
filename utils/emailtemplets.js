// utils/emailTemplates.js

const bookingConfirmationTemplate = (userName, listingName, startDate, endDate) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #2c3e50;">Booking Confirmed 🎉</h2>
      <p>Hi <b>${userName}</b>,</p>
      <p>Your booking for <b>${listingName}</b> has been confirmed.</p>
      <p><b>Check-in:</b> ${new Date(startDate).toDateString()} <br>
         <b>Check-out:</b> ${new Date(endDate).toDateString()}</p>
      <p style="margin-top: 20px;">We can’t wait to host you!</p>
      <hr>
      <p style="font-size: 12px; color: #777;">TripWhispers Team</p>
    </div>
  `;
};

const bookingCancellationTemplate = (userName, listingName, startDate) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #e74c3c;">Booking Cancelled ❌</h2>
      <p>Hi <b>${userName}</b>,</p>
      <p>Your booking for <b>${listingName}</b> starting on <b>${new Date(startDate).toDateString()}</b> has been cancelled.</p>
      <p>We hope to see you again soon!</p>
      <hr>
      <p style="font-size: 12px; color: #777;">TripWhispers Team</p>
    </div>
  `;
};

module.exports = { bookingConfirmationTemplate, bookingCancellationTemplate };
