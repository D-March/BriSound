const express = require('express');
const router = express.Router();
const events = require('../controllers/events');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateEvent} = require('../middleware');

router.route('/')
    .get(catchAsync(events.index))
    .post(
        isLoggedIn, 
        validateEvent, 
        catchAsync(events.createEvent))

router.get('/new', isLoggedIn, events.renderNewForm);

router.route('/:id')
    .get(catchAsync(events.showEvent))
    .put(
        isLoggedIn, 
        isAuthor, 
        validateEvent, 
        catchAsync(events.updateEvent))
    .delete(isLoggedIn, isAuthor, catchAsync(events.destroyEvent))

router.get('/:id/edit', 
    isLoggedIn, 
    isAuthor, 
    catchAsync(events.renderEditForm));

module.exports = router;