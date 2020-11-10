const mongoose = require("mongoose");
const Review = require("./review");
const { schema } = require("./review");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    date: String,
    time: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        }
    ]
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
