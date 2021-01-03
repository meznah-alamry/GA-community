const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
const session = require("express-session");
const config = require("dotenv").config();
const mongoSessisonStore = require("connect-mongo")(session);
const validator = require("express-validator");

// Session
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


// Connect to MongoDB
mongoose.connect(
    process.env.mongodb,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log(`MongoDb is Connected`)
);

// use css and js on ejs file
app.use(express.static("public"));
app.use(expressLayouts);

//******* Index & Home *******//
app.get('/', (req, res) => {

    res.render("index");

});
app.get('/home', (req, res) => {

    res.render("home");

});

//******* Login & Sign Up *******//
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

//******* Other Pages *******//
app.get('/instructors', (req, res) => {

    res.render("instructors");

});
app.get('/courses', (req, res) => {

    res.render("courses");

});
app.get('/students', (req, res) => {

    res.render("students");

});
app.get('/timeline', (req, res) => {

    res.render("timeline");

});

//Start Server
let Port = 4000;
app.listen(Port, () => console.log(`GA Community Server is Running on Port: ${Port} `));