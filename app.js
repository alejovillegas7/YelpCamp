var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

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
            res.render("index", { campgrounds: campgrounds });
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
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            //render and show the template with that campground
            res.render("show", { campground: foundCampground });
        }
    });
})

app.listen(3000, () => {
    console.log("YelpCamp running at port 3000");
})