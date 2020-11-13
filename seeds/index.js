const mongoose = require('mongoose');
const cities = require('./cities');
const { genres, descriptors } = require('./seedHelpers');
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
        const event = new Event({
            author: '5faa853a43b163092cdc69fd',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(genres)}`,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis, repudiandae ipsa culpa quibusdam doloribus ea dolor quasi placeat ad architecto hic quos rerum voluptates iste quod consequuntur et enim quis.',
            price,
            geometry: {
                type: 'Point',
                coordinates: [  
                                cities[random1000].longitude,
                                cities[random1000].latitude,
                ]
            },
            images: [
                    {
                        url: 'https://res.cloudinary.com/brisounddev/image/upload/v1605025334/BriSound/ojip4syk3jfbeoig6kkc.jpg',
                        filename: 'BriSound/ojip4syk3jfbeoig6kkc'
                    },
                    {
                        url: 'https://res.cloudinary.com/brisounddev/image/upload/v1605025334/BriSound/rhm526uxl1telq4xryxl.jpg',
                        filename: 'BriSound/rhm526uxl1telq4xryxl'
                    },
                    {
                        url: 'https://res.cloudinary.com/brisounddev/image/upload/v1605025334/BriSound/dnlxbsx5i1lab6trzwdt.jpg',
                        filename: 'BriSound/dnlxbsx5i1lab6trzwdt'
                    }
                ]
        })
        await event.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})