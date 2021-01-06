const express = require('express');
const router = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
const session = require("express-session");
const config = require("dotenv").config();
const mongoSessisonStore = require("connect-mongo")(session);
const validator = require("express-validator");
const Instructor = require("../models/instructorModel");
const Student = require("../models/studentModel");
const Course = require("../models/courseModel");


var bodyParser = require("body-parser");
const { body } = require('express-validator');
router.use(bodyParser.urlencoded({ extended: true }));

router.use(
    session({
        store: new mongoSessisonStore({ mongooseConnection: mongoose.connection }),
        saveUninitialized: true,
        resave: true,
        secret: "SuperSecretCookie",
        cookie: { maxAge: 30 * 60 * 1000 },
    })
);



//***************************** Routes *****************************//

// Instructors List
router.get('/instructors', (req, res) => {

    var userId = req.session.userId;

    Instructor.find()
        .then(instructors => {
            res.render('instructors/instructors', { instructors, userId });
            console.log("Session ID: ", req.session.userId);
        }).catch((err) => {
            console.log(err);
            res.status(500).send("Error!")
        });
});

// Instructors Sign Up (GET)
router.get('/instructors/signup', (req, res) => {

    Course.find()
    .then(courses => {
        res.render("instructors/signup", {courses});
    }).catch(err => console.log(err));


});
// Instructors Sign Up (POST)
router.post(
    "/instructors",
    validator.body('email').isEmail(),
    validator.body('password').isLength({ min: 5 }),

    (req, res) => {

        const validationError = validator.validationResult(req);
        console.log(req.body);
        if (!validationError.isEmpty()) {
            return res.status(500).send("Validation Errors");
        }
        Instructor.createSecure(req.body, (err, newUser) => {
            console.log("New User: ", newUser);
            //req.session.userId = newUser._id;
            res.redirect("/login");
        });
    }
);


// Instructor Login (GET)
router.get('/instructors/login', (req, res) => {

    res.render("instructors/login");

});
// Instructor Login (POST)
router.post('/instructors/sessions', (req, res) => {

    console.log("Login info in clear text: ")
    console.log("Entered Email: ", req.body.email);
    console.log("Entered Password: ", req.body.password);

    // call authenticate function to check if password user entered is correct
    Instructor.authenticate(req.body.email, req.body.password, (err, foundUser) => {
        if (err) {
            console.log("authentication error: ", err);
            res.status(500).send(err);
        } else {
            console.log("setting sesstion user id ", foundUser._id);
            req.session.userId = foundUser._id;
            req.session.userType = "Instructor"
            res.redirect("/home");
        }
    }
    );
});

// Instructor Rating (POST)
router.post('/instructors/:id/rate', (req, res) => {
    const id = req.params.id
    const newRating = req.body.rating

    //Rating.find({student: req.session.userId})

    Instructor.findByIdAndUpdate(id , {$push:{rating:newRating }})
    .then((updatedInstructor)=>{
     res.redirect("/instructors/") // maybe redirect to a specific Instructor's Id. Maybe also check for double rating
    }).catch(err =>console.log(err))

});

// Instructors Profile
router.get('/instructors/:id', (req, res) => {

    const id = req.params.id
    Instructor.findById(id)
        .then(instructors => {
            res.render('instructors/profile', { instructors, userId: req.session.userId });
        }).catch((err) => {
            console.log(err);
            res.status(500).send("Error!");
        });
});

// Instructors's Profile
router.get('/profile/:id', (req, res) =>{
    
})


//***************************** Export *****************************//
module.exports = router;