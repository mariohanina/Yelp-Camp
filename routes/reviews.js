// Require express and instantiate the router and merge the query parameter
const express = require("express");
const router = express.Router({ mergeParams: true });

// Require reviews controller
const controller = require("../controllers/reviews");

// Require middleware
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

// Error handling
const cathcAsync = require("../utils/catchAsync");


// Create new review
router.post("/", isLoggedIn, validateReview, cathcAsync(controller.createReview))

// Delete review
router.delete("/:reviewID", isLoggedIn, isReviewAuthor, cathcAsync(controller.deleteReview
))


module.exports = router;