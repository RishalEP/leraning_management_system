const express = require('express')
let router = express.Router();
const User = require('../models/users.model')
const Course = require('../models/course.model')
let { formResponse } = require('../service') 

//------Get a single course using id--------
router.get('/:name',async (req, res, next) => {  
        Course.findOne({ title: req.params.name }, async function (err, doc) {
        if (!err) {
            if (doc === null)
                res.send(formResponse(404,"Course Not Found",{}))
            else {
                res.send(formResponse(200,"Course Succefuly Fetched",{data:doc}))
            }
        }
        else {
            console.log('error',err);
            res.send(formResponse(500,"Internal Server Error",{}))
        }
    });

})

//------Post a Course--------
router.post('/add',async (req, res, next) => {  
    const post = new Course({
        title:req.body.title,
        description: req.body.description,
        createdDate:new Date()
        })

    try {
        var saveCourseData = await post.save()
        if(saveCourseData["_id"]){
             res.send(formResponse(200,"Course Successfully Registered",{id:saveCourseData["_id"]}))
        }
        else{
            res.send(formResponse(400,"Could not Create the Course",{}))
        }
    }
    catch(error) {
        res.send(formResponse(404,"Course already exists",{}))
      }
})

const updateCourse = async (name,toUpdate)=> {
    let doc = await Course.findOneAndUpdate({ title: name }, toUpdate , { upsert: true, useFindAndModify: false }).lean().exec()
}





module.exports = router;

