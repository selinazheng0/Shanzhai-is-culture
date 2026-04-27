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
    if (description === ""){
        return new Promise((resolve, reject) => {
            Image.find().then((images) => {
                console.log('found')
                console.log(images)
                resolve(images);
            }).catch((error) => {
                console.log('err')
                console.log(error)
                reject("getImage: " + JSON.stringify(error));
            });
        });
    } else {
        return new Promise((resolve, reject) => {
            Image.find({description : val}).then(images => {
                resolve(images);
            }).catch(error => {
                reject("getImage: " + JSON.stringify(error));
            });
        });
    }
}

module.exports = {createImage, getImages}