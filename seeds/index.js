const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Event = require('../models/event');

mongoose.connect('mongodb://localhost:27017/BriSound', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Event.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Event({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/136493/',
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis, repudiandae ipsa culpa quibusdam doloribus ea dolor quasi placeat ad architecto hic quos rerum voluptates iste quod consequuntur et enim quis.',
            price,
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})