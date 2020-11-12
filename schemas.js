const Joi = require('joi');

module.exports.eventSchema = Joi.object({
    event: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        description: Joi.string().required(),
        // image: Joi.string().required(),
        time: Joi.string().required(),
        date: Joi.date().required().min('now'),
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required(),
    }).required()
});