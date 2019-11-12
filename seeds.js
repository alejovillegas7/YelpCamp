var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data = [
    {
        name: "crystal lake",
        image: "https://thehardtimes.net/wp-content/uploads/2019/05/crystal-lake.jpg",
        description: "blah blah blah"
    },
    {
        name: "crystal lake 2222",
        image: "https://thehardtimes.net/wp-content/uploads/2019/05/crystal-lake.jpg",
        description: "blah blah blah"
    },
    {
        name: "crystal lake 33333",
        image: "https://thehardtimes.net/wp-content/uploads/2019/05/crystal-lake.jpg",
        description: "blah blah blah"
    }
];

function seedDB() {
    //remove all campgrounds
    Campground.deleteMany({}, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("removed campgrounds!!");
        }
        //add a few campgrounds
        data.forEach((seed) => {
            Campground.create(seed, (err, campground) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("added campground");
                    //creae ac omment on each campground
                    Comment.create({
                        text: "this place is great but I wish there was internet",
                        author: "HOMER"
                    }, (err, commentData) => {
                        if (err) {
                            console.log(err);
                        } else {
                            campground.comments.push(commentData);
                            campground.save();
                            console.log("created new comment");
                        }
                    });
                }
            });
        });
    })

    //add a few comments
}

module.exports = seedDB;