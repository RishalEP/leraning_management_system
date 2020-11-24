const mongoose = require('mongoose');

const Schema =  mongoose.Schema;

const studentSchema = new Schema({
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
    },
    courses:{
        type:Array
    },
    isSuspended:{
        type:Boolean,
        required:true
    }
})

const Student = mongoose.model('Student',studentSchema);

module.exports = Student;