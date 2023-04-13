let mongoose = require('mongoose');
let dbConnect = require('./dbConnect');
dbConnect();  //for creating connection between mongoose and node.js

let Schema = mongoose.Schema({
    name: {
        type: String,
        unique: false,
    },
    phone: {
        type: String,
        unique: [true, "Must Be Unique"],
    },
    image:{
        type: String
    }
});

module.exports = Schema;