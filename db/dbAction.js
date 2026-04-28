const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const { Image } = require('./model.js');


// Connect to mongo database.
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Shanzhai'
mongoose.connect(mongoURI);

function createImage(name, description) {
    const newImage = new Image({name, description})
    return newImage.save();
}

function getImages(description) {
    var val = new RegExp(".*"+description+".*");
    console.log(description)
    if (description === undefined || description === ""){
        return Image.find();
    } else {
        return Image.find({description : val});
    }
}

module.exports = {createImage, getImages}