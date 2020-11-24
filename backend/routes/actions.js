const express = require('express')
let router = express.Router();
const User = require('../models/users.model')
const Student = require('../models/students.model');
const Faculty = require('../models/faculty.model');
let { formResponse } = require('../service') 

//------Get a single issue-credential record using id--------
router.get('/profile/:userName',async (req, res, next) => {  
        User.findOne({ userName: req.params.userName }, async function (err, doc) {
        if (!err) {
            if (doc === null)
                res.send(formResponse(404,"User Not Found",{}))
            else {
                const profileInfo = (doc.usertype === 'student') ? getStudentbyName(req.params.userName) : getFacultybyName(req.params.userName)
                res.send(profileInfo)
            }
        }
        else {
            console.log('error',err);
            res.send(formResponse(500,"Internal Server Error",{}))
        }
    });

})

const getStudentbyName = async(userName) => {
    Student.findOne({ userName: userName }, async function (err, doc) {
        if (!err) {
            if (doc === null)
                res.send(formResponse(404,"User Not Found",{}))
            else {
                res.send(formResponse(200,"Successfully Fetched",{data:doc}))
            }
        }
        else {
            console.log('error',err);
            res.send(formResponse(500,"Internal Server Error",{}))
        }
    });
}

const getFacultybyName = async(userName) => {
    Faculty.findOne({ userName: userName }, async function (err, doc) {
        if (!err) {
            if (doc === null)
                res.send(formResponse(404,"User Not Found",{}))
            else {
                res.send(formResponse(200,"Successfully Fetched",{data:doc}))
            }
        }
        else {
            console.log('error',err);
            res.send(formResponse(500,"Internal Server Error",{}))
        }
    });
    
}


router.get('/profile/:', async (req, res, next) => {
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

router.post('/register' , async (req, res) => {

    let password_hash = await bcrypt.hash(req.body.password.toString(), saltRounds);

    const post = new User({
        userName:req.body.userName,
        password: password_hash,
        usertype: req.body.usertype
        })

    try {
        var saveUserData = await post.save()
        if(saveUserData["_id"]){
             const userResponse = (req.body.usertype === 'student') ? await addStudent(req.body) : await addFaculty(req.body);
             res.send(userResponse)
        }
        else{
            res.send(formResponse(400,"Could not Create the user",{}))
        }
    }
    catch(error) {
        res.send(formResponse(404,"User already exists",{}))
      }
})

const addStudent = async(data) => {
    const post = new Student({
        userName:data.userName,
        firstName: data.firstName,
        lastName: data.lastName,
        isSuspended: false
        })

    try {
        let saveUserData = await post.save()
        if(saveUserData["_id"]){
             return(formResponse(200,"Student Successfully Created",{id:saveUserData["_id"]}))
        }
        else{
            return(formResponse(400,"Could not Create the student",{}))
        }
    }
    catch(error) {
        return(formResponse(404,"Student already exists",{}))
      }
}
const addFaculty = async(data) => {
    const post = new Faculty({
        userName:data.userName,
        firstName: data.firstName,
        lastName: data.firstName
        })

    try {
        let saveUserData = await post.save()
        if(saveUserData["_id"]){
             return(formResponse(200,"Faculty Successfully Created",{id:saveUserData["_id"]}))
        }
        else{
            return(formResponse(400,"Could not Create the Faculty",{}))
        }
    }
    catch(error) {
        console.log("ERROR",error)
        return(formResponse(404,"Faculty already exists",{}))
      }
}


module.exports = router;

