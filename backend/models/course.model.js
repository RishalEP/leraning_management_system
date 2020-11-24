const mongoose = require('mongoose');

const Schema =  mongoose.Schema;

const courseSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String
    },
    description:{
        type:Array
    },
    createdBy:{
        type:String,
    },
    subscribedBy:{
        type:Array
    },
    createdDate:{
        type:Date,
        required:true
    }
})

const Course = mongoose.model('Course',courseSchema);

module.exports = Course;