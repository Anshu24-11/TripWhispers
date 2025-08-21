const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use App Password if Gmail
  },
});

const sendMail = async (to, subject, html = null) => {
  try {
    await transporter.sendMail({
      from: `"TripWhispers" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully ✅");
  } catch (error) {
    console.log("Error sending email ❌", error);
  }
};

module.exports = { sendMail };
