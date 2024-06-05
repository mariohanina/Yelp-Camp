const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelper")

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
}

main()
    .then(() => console.log("Connection opened!"))
    .catch(err => console.log(err));

const sample = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Campground.deleteMany();
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;

        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://source.unsplash.com/collection/483251",
            price,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui eligendi explicabo autem dolor voluptatum aliquam assumenda obcaecati eos, quam rerum ex pariatur totam maxime impedit voluptatibus perspiciatis inventore odit aspernatur.",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            author: "665c39ec1731759ee4a2812f"
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})