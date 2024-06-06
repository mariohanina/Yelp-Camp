// Require express and instantiate the router
const express = require("express");
const router = express.Router();

// Require controller
const campgroundsController = require("../controllers/campgrounds");

// Require middleware
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

// Error handling
const cathcAsync = require("../utils/catchAsync");

// Multer: for uploading files
const multer = require('multer');
// no need to add "/index" to the "../cloudinary" path because node looks for that by default
const { storage } = require("../cloudinary");
const upload = multer({ storage });


// ----------------- ROUTES -----------------
// SHOW all campgrounds -- CREATE new campground
router.route("/")
    .get(cathcAsync(campgroundsController.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, cathcAsync(campgroundsController.createCampground))

// Display form for creating new campground
router.get("/new", isLoggedIn, campgroundsController.renderNewForm);

// SHOW single campground -- UPDATE single campground -- DELETE single campground
router.route("/:id")
    .get(cathcAsync(campgroundsController.showCampground))
    .put(isLoggedIn, upload.array('image'), isAuthor, validateCampground, cathcAsync(campgroundsController.updateCampground))
    .delete(isLoggedIn, isAuthor, cathcAsync(campgroundsController.deleteCampground));

// Display form for updating campground
router.get("/:id/edit", isLoggedIn, isAuthor, cathcAsync(campgroundsController.renderEditForm));


module.exports = router;