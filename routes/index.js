var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/user');

router.get("/", (req, res) => {
    res.render("landing");
})

//AUTH ROUTES

//show register form
router.get("/register", (req, res) => {
    res.render("register");
})

//handl sign up logic
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        })
    });
})

//show login form
router.get("/login", (req, res) => {
    res.render("login");
});

//handling login logic
//schema = router.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res) => {

    });

//logout route
router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});
module.exports = router;