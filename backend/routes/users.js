const express = require('express')
let router = express.Router();
const Student = require('../models/students.model');
const Faculty = require('../models/faculty.model');
let { formResponse } = require('../service') 

router.get('/students', async (req, res, next) => {
    Student.find().lean().exec(function (err, doc) {
        if(doc){
            res.send(formResponse(200,"Success Fetching Data",{data:doc}))
        }
        else{
            console.log("error",err)
            res.send(formResponse(500,"internal Server Error",{}))
        }
    });
});

router.get('/faculties', async (req, res, next) => {
    Faculty.find().lean().exec(function (err, doc) {
        if(doc){
            res.send(formResponse(200,"Success Fetching Data",{data:doc}))
        }
        else{
            console.log("error",err)
            res.send(formResponse(500,"internal Server Error",{}))
        }
    });
});



module.exports = router;

