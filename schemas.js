// Require joi, to validate the data that is being recieved from the user
const baseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");


// Define the extension
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

// Extend Joi
const Joi = baseJoi.extend(extension);


// Export the function that validates the data for campgrounds
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        description: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
    }).required(),

    deleteImages: Joi.array()
})

// Export the function that validates the data for reviews
module.exports.reviewSchema = Joi.object({
    reviews: Joi.object({
        body: Joi.string().required().escapeHTML(),
        rating: Joi.number().required()
    }).required()
})