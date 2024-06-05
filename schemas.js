// Require joi, to validate the data that is being recieved from the user
const Joi = require("joi");

// Export the function that validates the data for campgrounds
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        image: Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string().required(),
        location: Joi.string().required()
    }).required()
})

// Export the function that validates the data for reviews
module.exports.reviewSchema = Joi.object({
    reviews: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required()
    }).required()
})