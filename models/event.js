const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const moment = require("moment");

const ImageSchema = new Schema ({
    url: String,
    filename: String,
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const EventSchema = new Schema({
    title: String,
    images: [ImageSchema],
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
    price: Number,
    description: String,
    location: String,
    date: String,
    time: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        }
    ]
}, opts);

EventSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <strong><a href='/events/${this._id}'>${this.title}</a><strong>
    <p>${this.location}<br>${moment(this.date).format('Do MMMM, YYYY')} at ${this.time}</p>`;
});

EventSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model("Event", EventSchema);
