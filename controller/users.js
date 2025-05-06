const User=require("../models/users");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};


module.exports.signup=async(req,res)=>{

    try{
        
        let{username,email,password}=req.body;
        let newuser=new User({email,username});
        const registereduser=await User.register(newuser,password);
        // console.log(registereduser);
        req.logIn(registereduser,()=>{

            req.flash("success","welcome to wanderlustt");
            return res.redirect("/listings");
        })
    }catch(e){
        req.flash("error",e.message);
      return  res.redirect("/signup");
    }

};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome To WANDERLUST! You Are Loggedin");
    let redirectUrl=res.locals.redirectUrl || "/listings";
   
    res.redirect(redirectUrl);
};


module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are loggedout!");
        res.redirect("/listings");
    })
};