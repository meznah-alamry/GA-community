const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
const session = require("express-session");
const config = require("dotenv").config();
const mongoSessisonStore = require("connect-mongo")(session);
const validator = require("express-validator");
const path = require('path');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));


//********** Models **********//
const Student = require("./models/studentModel");
 //const IInstructor =require("./models/instructorModel");
  //app.use(require("./models/courseModel"));

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
app.use(express.static(path.join(__dirname, '/public')));
app.use(expressLayouts);

//********** Index & Home **********//
app.get('/', (req, res) => {

    res.render("index");

});
app.get('/home', (req, res) => {

    res.render("home", {userId: req.session.userId});

});

//********** Login - Sign Up - Logout **********//
app.get('/login', (req, res) => {

        res.render("login");

});
app.get('/signup', (req, res) => {

    res.render("signup");

});
app.get('/logout', (req, res) => {

    req.session.userId = null;
    res.render("login");

});

//********** Other Pages **********//

app.get('/timeline', (req, res) => {

    res.render("timeline", {userId: req.session.userId});

});

//**********  Controllers **********//
app.use(require("./controllers/studentCon"));
app.use(require("./controllers/instructorCon"));
app.use(require("./controllers/courseCon"));


//********** Start Server **********//
let Port = 4000;
app.listen(Port, () => console.log(`GA Community Server is Running on Port: ${Port} `));