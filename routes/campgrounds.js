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
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })


// ----------------- ROUTES -----------------
// SHOW all campgrounds -- CREATE new campground
router.route("/")
    .get(cathcAsync(campgroundsController.index))
    // .post(isLoggedIn, validateCampground, cathcAsync(campgroundsController.createCampground))
    .post(upload.array('image'), (req, res) => {
        console.log(req.body, req.files);
        res.send("It worked!");
    })

// Display form for creating new campground
router.get("/new", isLoggedIn, campgroundsController.renderNewForm);

// SHOW single campground -- UPDATE single campground -- DELETE single campground
router.route("/:id")
    .get(cathcAsync(campgroundsController.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, cathcAsync(campgroundsController.updateCampground))
    .delete(isLoggedIn, isAuthor, cathcAsync(campgroundsController.deleteCampground));

// Display form for updating campground
router.get("/:id/edit", isLoggedIn, isAuthor, cathcAsync(campgroundsController.renderEditForm));


module.exports = router;