const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Image = mongoose.model("Image", {
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
});

module.exports= {
    Image
}