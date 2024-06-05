const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

// User schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

// passportLocalMongoose will add username, password, and some methods.
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);