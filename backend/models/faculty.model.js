const mongoose = require('mongoose');

const Schema =  mongoose.Schema;

const facultySchema = new Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        minlength:3
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String
    }
})

const Faculty = mongoose.model('Faculty',facultySchema);

module.exports = Faculty;