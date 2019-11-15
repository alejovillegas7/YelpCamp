var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

//INDEX- SHOW ALL CAMPGROUNDS
router.get("/", (req, res) => {
    //get all campgrounds from our db
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log("Somtehing went wrong");
        } else {
            res.render("campgrounds/index", { campgrounds: campgrounds });
        }
    })
})

//NEW-SHOW FORM TO CREATE A NEW CAMPGROUND
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

//CREATE- ADD A NEW CAMPGROUND TO OUR DB
router.post("/", isLoggedIn, (req, res) => {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var author = { id: req.user._id, username: req.user.username }
    var description = req.body.description;
    var newCampground = { name: name, image: image, description: description, author: author };
    //createa new campground and save to database
    Campground.create(newCampground, (err, newlyCamp) => {
        if (err) {
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    })
});

//SHOOW- shows more info about one campground
router.get("/:id", (req, res) => {
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //render and show the template with that campground
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;