const express = require("express");
const router = express.Router();

const usercontroller = require("../controller/users.js");

router.post("/signup", usercontroller.signup);

router
  .route("/login")
  .get(usercontroller.renderLoginForm)
  .post(usercontroller.login);

router.get("/logout", usercontroller.logout);

router.get("/me", (req, res) => {
  res.json({ user: req.user || null });
});

router.get("/currUser", usercontroller.currentUser);

module.exports = router;
