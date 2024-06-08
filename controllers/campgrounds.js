// Require the mongoose campgrounds model
const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary/index");

// MAPBOX
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });

// SHOW all campgrounds
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds })
}

// Display form for creating new campground
module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
}

// CREATE new campground
module.exports.createCampground = async (req, res, next) => {

    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    // Create campground instance
    const campground = new Campground(req.body.campground);
    // Associate author with campground
    campground.author = req.user._id;
    // Add images to the campground
    campground.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    // Add geometry to campground
    campground.geometry = geoData.body.features[0].geometry;

    await campground.save();
    req.flash("success", "Successfully made a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
}

// SHOW single campground
module.exports.showCampground = async (req, res) => {
    // Find campground, populate its reviews, and populate reviews' author
    const campground = await Campground.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");

    // If campground does not exist, flash an error message and redirect to all campgrounds
    if (!campground) {
        req.flash("error", "No campground with that name.");
        return res.redirect("/campgrounds")
    }

    // if campground exists, display it
    res.render("campgrounds/show", { campground });
}

// Display form for updating campground
module.exports.renderEditForm = async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);

    // If campground does not exist, flash an error message and redirect to all campgrounds
    if (!campground) {
        req.flash("error", "No campground with that name.");
        return res.redirect("/campgrounds")
    }

    res.render("campgrounds/edit", { campground });
}

// UPDATE single campground
module.exports.updateCampground = async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });

    // Add more images to current campground
    const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }))
    campground.images.push(...imgs);
    await campground.save();

    // Delete images from campground
    if (req.body.deleteImages) {

        for (const image of req.body.deleteImages) {
            await cloudinary.uploader.destroy(image);
        }

        await campground.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } }
        })
    }

    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${id}`)
}

// DELETE single campground
module.exports.deleteCampground = async (req, res) => {
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}