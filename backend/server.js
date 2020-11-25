

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var jwt = require("jsonwebtoken");
var url = require('url');

var { secretKey, apiRules } = require('./appconfig')
require('dotenv').config();

const course = require('./routes/course')
const users = require('./routes/users')
const login = require('./routes/login')
const register = require('./routes/register')


const app = express();
const port = process.env.PORT || 5000 ;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(authenticateToken)


app.use('/users',users)
app.use('/course',course)
app.use('/login',login)
app.use('/register',register)

const uri = 'mongodb+srv://admin:1234@cluster0.tbr6c.mongodb.net/<dbname>?retryWrites=true&w=majority';
mongoose.connect(uri, {useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB Database established");
})

app.use(function (req, res, next) {
    next(createError(404));
  });
  
  // error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
  });
  

function authenticateToken(req, res, next) {
    // Gather the jwt access token from the request header
    var urlObject = url.parse(req.originalUrl, true);
    console.log("[APPP JS URL] ",urlObject)

    const requestedUrl = urlObject.pathname
    console.log("[app js req]",requestedUrl)

    if((requestedUrl == '/login') || (requestedUrl == '/register'))
        next()
    else {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
        if (token == null) {
            return res.json({
                status_message: "Unauthenticated request",
                status_code: 401
            })
        }
        else{
            jwt.verify(token, secretKey, (err, user) => {
                if (err) {
                    return res.json({
                        status_message: "Unauthenticated request Session Expired",
                        status_code: 401
                    })
                }
                else{
                    const payload = {
                        userName: user.userName,
                        user_id: user.user_id
                    }
                    req["userInfo"] = payload
                    next()
                }
            });
        }     
    }
  }



app.listen(port, () => {
    console.log(`Server Listening to port : ${port}`);
})
