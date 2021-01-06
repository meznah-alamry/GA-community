const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
const session = require("express-session");
const config = require("dotenv").config();
const mongoSessisonStore = require("connect-mongo")(session);
const validator = require("express-validator");
const path = require('path');
const methodOverride = require('method-override');
let port = process.env.PORT || 4000;
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));


//********** Models **********//
const Student = require("./models/studentModel");
const Instructor = require('./models/instructorModel');
const Course = require('./models/courseModel');
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
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, '/public')));
app.use(expressLayouts);

//********** Home **********//
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
    req.session.userType = null;
    res.render("login");

});

//********** Other Pages **********//
app.get('/profile/', (req, res) =>{

    const userId = req.session.userId
    const userType = req.session.userType

    if(userType==="Instructor"){
        Instructor.findById(userId)
        .then(instructor => {
            res.render('profile-instructor',{instructor, userId});
        }).catch((err) =>{
            console.log(err);
            res.status(500).send("Error!")
        });
    }else if(userType==="Student"){
        Student.findById(userId)
        .then(student => {
            res.render('profile-student',{student, userId});
        }).catch((err) =>{
            console.log(err);
            res.status(500).send("Error!")
        });
    }
    console.log("userType: ",userType);
});

// Profile
app.get('/profile/', (req, res) =>{

    const userId = req.session.userId
    const userType = req.session.userType

    if(userType==="Instructor"){
        Instructor.findById(userId)
        .then(instructor => {
            res.render('profile-instructor',{instructor, userId});
        }).catch((err) =>{
            console.log(err);
            res.status(500).send("Error!")
        });
    }else if(userType==="Student"){
        Student.findById(userId)
        .then(student => {
            res.render('profile-student',{student, userId});
        }).catch((err) =>{
            console.log(err);
            res.status(500).send("Error!")
        });
    }
    console.log("userType: ",userType);
});

// Edit Profile (GET)
app.get('/profile/:id/edit', (req, res) =>{

    let id = req.params.id;
    const userId = req.session.userId
    const userType = req.session.userType

    if(userType==="Instructor"){
        Course.find()
        .then(courses => {
            Instructor.findById(userId)
            .then(instructor => {
                res.render('instructors/edit',{instructor, userId, courses});
            }).catch((err) =>{
                console.log(err);
                res.status(500).send("Error!")
            });
        })

    }else if(userType==="Student"){
        Student.findById(userId)
        .then(student => {
            res.render('students/edit',{student, userId});
        }).catch((err) =>{
            console.log(err);
            res.status(500).send("Error!")
        });
    }
    console.log(userType);
});

// Edit Profile (PUT)
app.put('/profile/:id', (req, res) => {
    
    let id = req.params.id;
    const userId = req.session.userId
    const userType = req.session.userType

if(userType==="Instructor"){

    let updateProfile = {
        name: req.body.name,
        talent: req.body.talent,
        email: req.body.email,
        number: req.body.number,
        course: req.body.course,
        role: req.body.role
    }
    console.log(req.body);
    Instructor.findByIdAndUpdate(userId, updateProfile)
    .then(() =>{
        res.redirect("/profile")
    }).catch(err => console.log(err))

}else if(userType==="Student"){

    let updateProfile = {
        name: req.body.name,
        email: req.body.email,
        number: req.body.number
    }
    console.log("req.body recieved");
    Student.findByIdAndUpdate(userId, updateProfile)
    .then(() =>{
        res.redirect("/profile")
    }).catch(err => console.log(err))
}

});

// Index (Should always be the last)
app.get('/', (req, res) => {

    res.render("index");

});

//**********  Controllers **********//
app.use(require("./controllers/studentCon"));
app.use(require("./controllers/instructorCon"));
app.use(require("./controllers/courseCon"));
app.use(require("./controllers/timelineCon"));

//********** Start Server **********//

app.listen(port, () => console.log(`GA Community Server is Running on Port: ${port} `));
