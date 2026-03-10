if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const chatbotRoute = require("./routes/chatbot.js");
const cors = require("cors");
const { error } = require("console");
app.use(
  cors({
    origin: "http://localhost:5173", // React app URL
    credentials: true, // allow cookies
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const bdUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
  mongoUrl: bdUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR in mongo session store", error);
});

const sessionoptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
  },
};

app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

main()
  .then(() => {
    console.log("connected top db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  mongoose.connect(bdUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;

  next();
});

app.get("/", (req, res) => {
  res.render("listings/home");
});
app.use("/admin", require("./routes/admin"));
app.use("/listings", listingsRouter);
app.use("/bookings", require("./routes/booking"));
app.use("/api/users", userRouter);
app.use("/chatbot", chatbotRoute);

app.use("/listings/:id/reviews", reviewsRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  if (req.originalUrl.startsWith("/api")) {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }

  res.status(statusCode).render("listings/error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
