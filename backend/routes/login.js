const express = require('express')
let router = express.Router();
const User = require('../models/users.model')
let { formResponse } = require('../service') 

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { secretKey, tokenExp } = require('../appconfig')
const saltRounds = 10;

router.post('/', async (req, res, next) => {
    User.findOne({ userName: req.body.userName }, async function (err, doc) {
        if (!err) {
            if (doc === null)
                res.json({ "status_message": "User Not Found", status_code: 404 })
            else {
                let password_compare = await bcrypt.compare(req.body.password, doc.password)
                if (doc.userName === req.body.userName && password_compare) {
                    let payload = {
                        "userName": doc.userName,
                        "user_id": doc["_id"]
                    }
                    const accessToken = generateAccessToken(payload);
                    res.send(formResponse(200,"Login Successfull",{token:accessToken,userName:doc.userName}))
                }
                else {
                    res.send(formResponse(404,"Incorrect Password",{}))
                }
            }
        }
        else {
            console.log('error', err);
            res.send(formResponse(500,"Internal Server Error",{}))
        }
    });
});


generateAccessToken = (payload) => {
    // expires after half and hour (1800 seconds = 30 minutes)
    return jwt.sign(payload, secretKey, { expiresIn: tokenExp });
}

module.exports = router;
