

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


require("dotenv").config()

const app = express();
const port = process.env.PORT || 5000 ;

app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://admin:1234@cluster0.tbr6c.mongodb.net/<dbname>?retryWrites=true&w=majority';
mongoose.connect(uri, {useNewUrlParser:true,useCreateIndex:true });

const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB Database established");
})

const course = require('./routes/course')
const users = require('./routes/users')
const login = require('./routes/login')


app.use('/users',users)
app.use('/course',course)
app.use('/login',login)



app.listen(port, () => {
    console.log(`Server Listening to port : ${port}`);
})
