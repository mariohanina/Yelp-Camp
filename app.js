// If app is not deployed yet, require dotenv
if (process.env.NODE_ENV !== "production") require("dotenv").config();
// Express
const express = require("express");
// Routing
const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
// Templating
const path = require("path");
const ejsMate = require("ejs-mate");
// Database related
const mongoose = require("mongoose");
// Models
const User = require("./models/user");
// Authentication
const passport = require("passport");
const localStrategy = require("passport-local");
// Error Handling
const ExpressError = require("./utils/expressError");
// Other
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");


// Initialize express
const app = express();

// set the view engine to ejs
app.set("view engine", "ejs");
// Use ejsMate to allow template injections and that kinda stuff
app.engine("ejs", ejsMate);
// Using path.join and __dirname avoids problems if app is being run from a different location
app.set("views", path.join(__dirname, "views"));


// Help reading data being submitted in post and put requests
app.use(express.urlencoded({ extended: true }));
// allows us to submit put and delete requests using forms
app.use(methodOverride("_method"));
// Designate certain files as public so that they can be accessed by the user's computer
app.use(express.static(path.join(__dirname, "public")));


// Sessions related stuff ----------------------------- MORE DOCUMENTATION NEEDED
const sessionConfig = {
    secret: "heheboi",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));


// Authentication related stuff, must come after session ------ MORE DOCUMENTATION NEEDED
app.use(passport.initialize());
// The line below allows us to stay signed in instead of having to sign in every time
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Flash related stuff -------------------------------- MORE DOCUMENTATION NEEDED
app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})


// Connect to the database
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
}

main()
    .then(() => console.log("Connection opened!"))
    .catch(err => console.log(err));


// Front page
app.get("/", (req, res) => {
    res.render("index");
})

// Use routers
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

// If any other routes are being accessed
app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404));
})


// If an error is thrown:
app.use((err, req, res, next) => {
    // If there is NO error message, set a default one
    if (!err.message) { err.message = "Something went wrong!" }
    // Render the error template
    res.render("error", { err });
})


// Start the server
app.listen("3000", () => {
    console.log("Server running on Port 3000");
})