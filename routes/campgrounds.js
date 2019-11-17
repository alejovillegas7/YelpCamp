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

//EDIT campground route
router.get("/:id/edit", checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        //we dont check 
        //if we have an error because if we achieve this point is because we already find the correct campground
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

//UPDATE campground route
router.put("/:id", checkCampgroundOwnership, (req, res) => {
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            console.log(err);
            return res.redirect("/campgrounds");
        }
        //redirect somewhere
        res.redirect("/campgrounds/" + req.params.id)
    });
});

//DESTROYCAMPGROUND ROUTE
router.delete("/:id", checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
            return res.redirect("/campgrounds")
        }
        res.redirect("/campgrounds");
    })
})

//middlewares
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

//check campgorund ownership
function checkCampgroundOwnership(req, res, next) {
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
}

module.exports = router;