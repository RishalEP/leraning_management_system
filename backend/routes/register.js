const express = require('express')
let router = express.Router();
const User = require('../models/users.model')
const Student = require('../models/students.model');
const Faculty = require('../models/faculty.model');
let { formResponse } = require('../service') 

const bcrypt = require('bcrypt');
const saltRounds = 10;



router.post('/' , async (req, res) => {

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

module.exports = router