var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');
var seedDB = require('./seeds');

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

seedDB();

//PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "this is the yelpcamp secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//to manage the logged user information and manipulate the navbar
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})


// Campground.create({ name: "Salmon creek", image: "https://thehardtimes.net/wp-content/uploads/2019/05/crystal-lake.jpg", description: "this is  a huge campground hill, no bathrooms, no nothing" }, (err, campground) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("NEW CREATED CAMPGROUND");
//         console.log(campground);
//     }
// });

app.get("/", (req, res) => {
    res.render("landing");
})

//INDEX- SHOW ALL CAMPGROUNDS
app.get("/campgrounds", (req, res) => {
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
app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

//CREATE- ADD A NEW CAMPGROUND TO OUR DB
app.post("/campgrounds", (req, res) => {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = { name: name, image: image, description: description };
    //createa new campground and save to database
    Campground.create(newCampground, (err, newCamp) => {
        if (err) {
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    })
});

//SHOOW- shows more info about one campground
app.get("/campgrounds/:id", (req, res) => {
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //render and show the template with that campground
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
})

//COMMENTS ROUTES
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
    //find campground by id
    Campground.findById(req.params.id, (err, campgroundFound) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campgroundFound });
        }
    })
})

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
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

//AUTH ROUTES

//show register form
app.get("/register", (req, res) => {
    res.render("register");
})

//handl sign up logic
app.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/campgrounds");
        })
    });
})

//show login form
app.get("/login", (req, res) => {
    res.render("login");
});

//handling login logic
//schema = app.post("/login", middleware, callback)
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res) => {

    });

//logout route
app.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


app.listen(3000, () => {
    console.log("YelpCamp running at port 3000");
})