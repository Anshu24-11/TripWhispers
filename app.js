if (process.env.NODE_ENV !="production") {
  
  require('dotenv').config()
  
}

 


const express=require("express");
const path=require("path");
const app=express();
const mongoose=require("mongoose");
// const Listing=require("./models/listing.js")
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
// const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const cookieParser = require('cookie-parser');
// const {listingschema,reviewSchema}=require("./schema.js");
// const Review=require("./models/reviews.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrtegy=require("passport-local");
const User=require("./models/users.js");


const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


// const { ppid } = require("process");
const cors = require('cors');
const { error } = require('console');
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const bdUrl=process.env.ATLASDB_URL;


const store=MongoStore.create({
  mongoUrl:bdUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24 * 3600,
});

store.on("error",()=>{
  console.log("ERROR in mongo session store",error);
})

const sessionoptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
}

app.use(session(sessionoptions));
app.use(flash());


//setup for passport    notes baki chhe////////////////////
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrtegy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//////////////////////////////////////


main().then(()=>{
    console.log("connected top db");
}).catch(err=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(bdUrl);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method")); 
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;

  next();
})


// app.get("/demouser",async(req,res)=>{
//   let fakeUSer=new User({
//     email:"student@gmail.com",
//     username:"delta-student",
//   });
//   let registereduser= await User.register(fakeUSer,"apnacollege")
//   res.send(registereduser);
// })


app.use("/listings",listingsRouter);
app.use("/",userRouter);
//////////////////////////////////////////////////////////////////////////////////////


app.use("/listings/:id/reviews",reviewsRouter);



// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
//   })

  app.all("*", (req, res, next) => {

    next(new ExpressError(404, "Page not found"));
  });
  


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;

    res.status(statusCode).render("listings/error.ejs",{message});
  });
  

  app.use(express.json());

  // app.get("/getcookies",(req,res)=>{
  //   res.cookie("greet","hello");
  //   res.send("sent you some cookies");
  // })



  
app.listen(8080, () => {
    console.log("server is listening to port 8080");
  });
  