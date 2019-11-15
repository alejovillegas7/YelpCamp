var express = require('express');
var router = express.Router({ mergeParams: true });
var Campground = require('../models/campground');
var Comment = require('../models/comment');

//COMMENTS ROUTES
router.get("/new", isLoggedIn, (req, res) => {
    //find campground by id
    Campground.findById(req.params.id, (err, campgroundFound) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campgroundFound });
        }
    })
})

router.post("/", isLoggedIn, (req, res) => {
    //lookup camground using ID
    Campground.findById(req.params.id, (err, camfroundFound) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    //connect new comment to camground
                    camfroundFound.comments.push(comment);
                    camfroundFound.save();
                    //redirect to the campground show page
                    res.redirect("/campgrounds/" + camfroundFound._id);
                }
            });
        }
    });
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;