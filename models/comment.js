var mongoose = require('mongoose');

var commentScheme = new mongoose.Schema({
    text: String,
    author: String
});



module.exports = mongoose.model("Comment", commentScheme);