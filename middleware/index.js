//all the middlewares goes here!

var Campground = require('../models/campground');
var Comment = require('../models/comment');

var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "you need to be logged in to do that!");
    res.redirect("/login");
};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                req.flash("error", "Campground not found");
                return res.redirect("back");
            }
            //Does the user own the campground?
            if (foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don´t have permission to do that...");
                res.redirect("back");
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");//redirects the user to the previous page
    }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                console.log(err);
                return res.redirect("back");
            }
            if (foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don´t have permission to do that...");
                res.redirect("back");
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");//redirects the user to the previous page
    }
}

module.exports = middlewareObj;