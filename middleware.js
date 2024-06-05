const { campgroundSchema, reviewSchema } = require("./schemas");
const Campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require("./utils/expressError");


// Check that info is valid using "joi", 
// if NOT, throw custom ExpressError. otherwise, call next()
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


// Check that info is valid using "joi", 
// if NOT, throw custom ExpressError. otherwise, call next()
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


// Middleware that checks if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // if not logged in, save the url they were trying to access in a session
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in.");
        return res.redirect("/login")
    } else {
        next();
    }
}

// store the url the user was trying to access in res.locals
// DO WE REALLY NEED THIS EXTRA STEP?
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

// This will check if the user is the same person who created the campground(the author)
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    // If not, flash an error and redirect to the campground
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "This campground doesn't belong to you!");
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

// This will check if the user is the same person who created the review(the author)
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewID } = req.params;
    const review = await Review.findById(reviewID);

    // If not, flash an error and redirect to the campground
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "This review doesn't belong to you!");
        return res.redirect(`/campgrounds/${id}`)
    }

    next();
}