const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

// https://res.cloudinary.com/dvn8e9cgl/image/upload/w_100/v1717651314/Yelp-Camp/g3porpo1artvhvfhmsut.png

const imageSchema = new Schema({
    url: String,
    filename: String
})


imageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200")
});


const opts = { toJSON: { virtuals: true } };


// Campgrounds schema
const CampgroundSchema = new Schema({
    title: String,
    images: [imageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, opts)

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
    return `<a href=/campgrounds/${this._id}>${this.title}</a><p>${this.description.substring(0, 30)}...</p>`
});

// Every time the "findOneAndDelete" method is called on Campground model, we delete all reviews associated with that campground.
CampgroundSchema.post("findOneAndDelete", async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model("Campground", CampgroundSchema);