const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
const session = require("express-session");
const config = require("dotenv").config();
const mongoSessisonStore = require("connect-mongo")(session);
const validator = require("express-validator");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));


//********** Models **********//
const Student = require("./models/studentModel");
// app.use(require("./models/instructorModel"));
// app.use(require("./models/courseModel"));
const Timeline = require("./models/timelineModel");


// parse incoming urlencoded form data in the HTTP Body
// and populate the req.body object
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));




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

    res.render("home", {userId: req.session.userId});

});

//********** Login - Sign Up - Logout **********//
app.get('/login', (req, res) => {

        res.render("login");

});
app.post('/sessions', (req, res) => {

    console.log("Login info in clear text: ")
    console.log("Entered Email: ", req.body.email);
    console.log("Entered Password: ", req.body.password);

    // call authenticate function to check if password user entered is correct
    Student.authenticate(req.body.email, req.body.password, (err, foundUser) => {
        if (err) {
            console.log("authentication error: ", err);
            res.status(500).send(err);
        } else {
            console.log("setting sesstion user id ", foundUser._id);
            req.session.userId = foundUser._id;
            res.redirect("/home");
        }
    }
    );

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
    Student.find()
    .then((users) => {
        Timeline.find().populate('user').sort({content:-1})
            .then((messages) => {
                res.render("timeline", {users, messages, userId: req.session.userId});
            })
    }

    )

});

app.post('/timeline', (req, res) => {
    Timeline.create(
        {user: req.session.userId, content:req.body.timeline})
    .then(timeline =>{
        res.redirect('/timeline')
    }).catch(err =>console.log(err));
});


//**********  Controllers **********//
app.use(require("./controllers/studentCon"));
app.use(require("./controllers/instructorCon"));
app.use(require("./controllers/courseCon"));


//********** Start Server **********//
let Port = 4000;
app.listen(Port, () => console.log(`GA Community Server is Running on Port: ${Port} `));