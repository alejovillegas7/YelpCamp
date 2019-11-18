var express = require('express');
var router = express.Router({ mergeParams: true });
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

//COMMENTS ROUTES
router.get("/new", middleware.isLoggedIn, (req, res) => {
    //find campground by id
    Campground.findById(req.params.id, (err, campgroundFound) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campgroundFound });
        }
    })
});

router.post("/", middleware.isLoggedIn, (req, res) => {
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
                    //add username and id to comments
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //connect new comment to camground
                    camfroundFound.comments.push(comment);
                    camfroundFound.save();
                    //redirect to the campground show page
                    res.redirect("/campgrounds/" + camfroundFound._id);
                }
            });
        }
    });
});

//COMMENTS EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
    });
})

//COMMENTS UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            console.log(err);
            return res.redirect("back");
        }
        res.redirect("/campgrounds/" + req.params.id);
    })
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            console.log(err);
            return res.redirect("back");
        }
        res.redirect("/campgrounds/" + req.params.id);
    })
})

module.exports = router;