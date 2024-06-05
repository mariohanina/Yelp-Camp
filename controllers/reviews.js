// Require the mongoose models
const Campground = require("../models/campground");
const Review = require("../models/review");

// Create new review
module.exports.createReview = async (req, res) => {
    // Find the campground in question
    const campground = await Campground.findById(req.params.id);
    // Create the review using the info the user submitted
    const review = new Review(req.body.reviews);
    // Add the author to the review
    review.author = req.user._id;
    // Push the review to the campground, BUT WHY THE WHOLE REVIEW AND NOT JUST THE ID???
    campground.reviews.push(review);

    review.save();
    campground.save();

    req.flash("success", "Successfully created new review!");
    res.redirect(`/campgrounds/${campground._id}`);
}

// Delete review
module.exports.deleteReview = async (req, res) => {
    const { id, reviewID } = req.params;
    // Remove the review ID from the campground
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    // Delete the review
    await Review.findByIdAndDelete(reviewID);

    req.flash("success", "Successfully deleted new review!");
    res.redirect(`/campgrounds/${id}`)
}