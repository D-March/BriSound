const express 		= require('express'),
	  router  		= express.Router({mergeParams: true}),
	  Campground 	= require('../models/campground'),
	  Comment 		= require('../models/comment'),
	  middleware	= require('../middleware');


//COMMENTS NEW
router.get('/new', middleware.isLoggedIn, (req, res) => {
	//find campground by ID
	Campground.findById(req.params.id, (err, campground) => {
		if(err || !campground){
			req.flash('error', 'No campground found.');
			return res.redirect('back');
		} else {
			res.render('comments/new', {campground: campground});
		}
	});
});

//COMMENTS CREATE
router.post('/', middleware.isLoggedIn, (req, res) => {
	//Look up campground using id
	Campground.findById(req.params.id, (err, campground) => {
		if(err){
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err){
					req.flash('error', 'Something went wrong.');
					console.log(err);
				} else {
					//Add username and ID to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash('success', 'Successfully added new comment.');
					res.redirect('/campgrounds/' + campground._id);
				}
			})
		}
	});
});

//COMMENTS EDIT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentsOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if(err || !foundCampground){
			req.flash('error', 'No campground found.');
			return res.redirect('back');
		}
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if(err || !foundComment){
				req.flash('error', 'Comment not found.');
				res.redirect('back');
			} else {
				res.render('comments/edit', {campground_id: req.params.id, comment : foundComment});
			}
		});
	})
});

//COMMENTS UPDATE
router.put('/:comment_id', middleware.checkCommentsOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if(err || !updatedComment){
			req.flash('error', 'Comment not found.');
			res.redirect('back');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

//COMMENTS DESTROY ROUTE
router.delete('/:comment_id', middleware.checkCommentsOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if(err){
			res.redirect('back');
		} else {
			req.flash('success', 'Comment successfully deleted.');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

module.exports = router;