const Event = require('../models/event');

module.exports.index = async (req, res) => {
    const events = await Event.find({});
    res.render('events/index', {events});
};

module.exports.renderNewForm = (req, res) => {
    res.render('events/new');
};

module.exports.createEvent = async (req, res, next) => {
    const event = new Event(req.body.event);
    event.author = req.user._id;
    await event.save();
    req.flash('success', 'Successfully added a new event!');
    res.redirect(`/events/${event._id}`);
};

module.exports.showEvent = async(req, res,) => {
    const event = await Event.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!event){
        req.flash('error', 'Event not found.');
        return res.redirect('/events');
    }
    res.render('events/show', { event });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    if(!event){
        req.flash('error', 'Event not found.');
        return res.redirect('/events');
    }
    res.render('events/edit', { event });
};

module.exports.updateEvent = async(req, res) => {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, {...req.body.event });
    req.flash('success', 'Successfully updated event information.');
    res.redirect(`/events/${event._id}`);
};

module.exports.destroyEvent = async(req, res) => {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted event.');
    res.redirect('/events');
};