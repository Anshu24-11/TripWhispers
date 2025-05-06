const express=require("express");
const router=express.Router();
const User=require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { redirectUrl } = require("../middleware.js");

const usercontroller=require("../controller/users.js");

router.route("/signup")
.get(usercontroller.renderSignupForm)
.post(usercontroller.signup);


router.route("/login")
.get(usercontroller.renderLoginForm)
.post(redirectUrl,
    passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),usercontroller.login);



router.get("/logout",usercontroller.logout);


module.exports=router;