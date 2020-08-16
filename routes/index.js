const express = require('express'),
	  router  = express.Router(),
	  passport = require('passport'),
	  User = require('../models/user');

//ROOT ROUTE
router.get('/', (req, res) => {
	res.render('landing');
});

//REGISTER FORM ROUTE
router.get('/register', (req, res) => {
	res.render('register');
});

//SIGN UP LOGIC
router.post('/register', (req, res) => {
	const newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) => {
		if(err){
			req.flash('error', err.message);
			return res.redirect('/register')
		}
		passport.authenticate('local')(req, res, () => {
			req.flash('success', 'Welcome to YelpCamp ' + user.username);
			res.redirect('/campgrounds');
		});
	});
});

//LOGIN FORM ROUTE
router.get('/login', (req, res) => {
	res.render('login');
});

//HANDLE LOGIN LOGIC
router.post("/login", (req, res, next) => {
	passport.authenticate("local",
        {
          successRedirect: "/campgrounds",
          failureRedirect: "/login",
          failureFlash: true,
          successFlash: "Successfully signed in as " + req.body.username + "!"
        })(req, res);
    });


//LOGOUT ROUTE
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'Successfully logged out.');
	res.redirect('/campgrounds');
});

module.exports = router;