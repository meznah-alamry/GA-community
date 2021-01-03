const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
const session = require("express-session");
const config = require("dotenv").config();
const mongoSessisonStore = require("connect-mongo")(session);
const validator = require("express-validator");

//********** Models **********//
// app.use(require("./models/studentModel"));
// app.use(require("./models/instructorModel"));
// app.use(require("./models/courseModel"));

//********** Session **********//
app.use(
    session({
        store: new mongoSessisonStore({ mongooseConnection: mongoose.connection }),
        saveUninitialized: true,
        resave: true,
        secret: "SuperSecretCookie",
        cookie: { maxAge: 30 * 60 * 1000 },
    })
);
app.set('view engine', 'ejs');


//********** Connect to MongoDB **********//
mongoose.connect(
    process.env.mongodb,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log(`MongoDb is Connected`)
);

//********** Using Layouts and "Public Folder" **********/
app.use(express.static("public"));
app.use(expressLayouts);

//********** Index & Home **********//
app.get('/', (req, res) => {

    res.render("index");

});
app.get('/home', (req, res) => {

    res.render("home");

});

//********** Login & Sign Up **********//
app.get('/login', (req, res) => {

    if(req.session.userId){
        res.render("logged")
    }else{
        res.render("login");
    }

});
app.get('/signup', (req, res) => {

    res.render("signup");

});

//********** Other Pages **********//
app.get('/instructors', (req, res) => {

    res.render("instructors/instructors");

});
app.get('/students', (req, res) => {

    res.render("students/students");

});
app.get('/courses', (req, res) => {

    res.render("courses");

});
app.get('/timeline', (req, res) => {

    res.render("timeline");

});

//**********  Controllers **********//
// app.use(require("./controllers/studentCon"));
// app.use(require("./controllers/instructorCon"));
// app.use(require("./controllers/courseCon"));


//********** Start Server **********//
let Port = 4000;
app.listen(Port, () => console.log(`GA Community Server is Running on Port: ${Port} `));