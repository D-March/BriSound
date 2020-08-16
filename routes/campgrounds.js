const express 		= require('express'),
	  router  		= express.Router(),
	  Campground 	= require('../models/campground'),
	  Comment 		= require('../models/comment'),
	  middleware	= require('../middleware');

// INDEX ROUTE
router.get('/', (req, res) => {
	//Get all campgrounds from DB
	Campground.find({}, (err, allCampgrounds) => {
					if(err){
						console.log(err);
					} else {
						res.render('campgrounds/index', {campgrounds:allCampgrounds});
					}
				});
});

//CREATE NEW CAMPGROUND ROUTE
router.post('/', middleware.isLoggedIn, (req, res) => {
	//get data from form and add to campgrounds array
	const name = req.body.name;
	const image = req.body.image;
	const desc = req.body.description;
	const price = req.body.price;
	const author = {
		id: req.user._id,
		username: req.user.username
	};
	const newCampground = {name: name, image: image, description: desc, author:author, price:price};
	//Create new campground and add to DB
	Campground.create(newCampground, (err, newlyCreated) => {
		if(err){
			console.log(err);
		} else {
			//redirect back to campgrounds page, default is to redirect as get request
			res.redirect('/campgrounds');
		}
	});	
});

//NEW CAMPGROUND ROUTE
router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});

//SHOW
router.get('/:id', (req, res) => {
	//find campground with provided ID
	Campground.findById(req.params.id).populate('comments').exec((err, foundCampground)=> {
		if(err || !foundCampground){
			req.flash('error', 'Campground not found');
			res.redirect('back');
		} else {
			console.log(foundCampground);
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});
	//render show template
	
});

//EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
			Campground.findById(req.params.id, (err, foundCampground) => {
				if(err){
					req.flash('error', 'Campground not found.');
				}
				res.render('campgrounds/edit', {campground: foundCampground});
			});	
});

//UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if(err){
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, async(req,res)=>{ 
        try { 
            let foundCampground = await Campground.findById(req.params.id); 
            await foundCampground.comments.forEach(async(comment)=>
        { 
            await Comment.findByIdAndDelete(comment._id) 
        }) 
         await foundCampground.remove(); 
        res.redirect("/campgrounds"); } 
        catch (error) { 
            res.redirect("/campgrounds"); 
        } 
});

module.exports = router;