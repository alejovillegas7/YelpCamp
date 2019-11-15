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

//requring routes
var commentsRoutes = require('./routes/comments');
var campgroundsRoutes = require('./routes/campgrounds');
var authRoutes = require('./routes/index');

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
});


// Campground.create({ name: "Salmon creek", image: "https://thehardtimes.net/wp-content/uploads/2019/05/crystal-lake.jpg", description: "this is  a huge campground hill, no bathrooms, no nothing" }, (err, campground) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("NEW CREATED CAMPGROUND");
//         console.log(campground);
//     }
// });

app.use("/campgrounds/:id/comments", commentsRoutes);
app.use(authRoutes);
app.use("/campgrounds", campgroundsRoutes);

app.listen(3000, () => {
    console.log("YelpCamp running at port 3000");
})