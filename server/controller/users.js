const User = require("../models/users");
const passport = require("passport");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }
    let newuser = new User({ email, username });
    const registereduser = await User.register(newuser, password);
    req.logIn(registereduser, () => {
      req.flash("success", "welcome to wanderlustt");
      return res.status(200).json({
        success: true,
        message: "Signup successful",
        user: registereduser,
      });
    });
  } catch (e) {
    console.log("SIGNUP ERROR:", e);
    res.status(400).json({
      message: "fdsf",
    });
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) return next(err);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    req.login(user, (err) => {
      if (err) return next(err);

      req.session.save((err) => {
        if (err) return next(err);

        return res.status(200).json({
          success: true,
          user,
        });
      });
    });
  })(req, res, next);
};
module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);

    const sessionID = req.sessionID;

    req.session.destroy((err) => {
      if (err) return next(err);

      console.log("Destroyed session:", sessionID);

      res.clearCookie("connect.sid", {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
      });

      res.json({
        success: true,
        message: "Logged out successfully",
      });
    });
  });
};
module.exports.currentUser = (req, res) => {
  if (!req.user) {
    return res.json({
      loggedIn: false,
    });
  } else {
    return res.json({
      loggedIn: true,
      user: req.user,
    });
  }
};
