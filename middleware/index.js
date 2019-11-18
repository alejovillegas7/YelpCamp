//all the middlewares goes here!

var Campground = require('../models/campground');
var Comment = require('../models/comment');

var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                console.log(err);
                return res.redirect("back");
            }
            //Does the user own the campground?
            if (foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
        });
    } else {
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
                res.redirect("back");
            }
        })
    } else {
        res.redirect("back");//redirects the user to the previous page
    }
}

module.exports = middlewareObj;