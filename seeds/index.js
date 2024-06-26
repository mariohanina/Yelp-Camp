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
    for (let i = 0; i < 1000; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;

        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            price,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui eligendi explicabo autem dolor voluptatum aliquam assumenda obcaecati eos, quam rerum ex pariatur totam maxime impedit voluptatibus perspiciatis inventore odit aspernatur.",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            author: "665c39ec1731759ee4a2812f",
            images: [{
                url: 'https://res.cloudinary.com/dvn8e9cgl/image/upload/v1717539666/cld-sample-2.jpg',
                filename: 'Yelp-Camp/blxnpnb4skdemdurc95t',
            },
            {
                url: 'https://res.cloudinary.com/dvn8e9cgl/image/upload/v1717539663/samples/coffee.jpg',
                filename: 'Yelp-Camp/ysofxpwddp2ymn8a56i3',
            }],
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})