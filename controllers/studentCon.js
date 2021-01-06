const express = require('express');
const router = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
const session = require("express-session");
const config = require("dotenv").config();
const mongoSessisonStore = require("connect-mongo")(session);
const validator = require("express-validator");
const Student = require('../models/studentModel');
const Instructor = require("../models/instructorModel");
const Course = require("../models/courseModel");

var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));

//***************************** Routes *****************************//

// Students List
router.get('/students', (req, res) => {

    var userId = req.session.userId;

    Student.find()
    .then(students => {
        res.render('students/students',{students, userId});
        console.log("Session ID: ",req.session.userId);
    }).catch((err) =>{
        console.log(err);
        res.status(500).send("Error!")
    });

    // res.render("students/students",{ userId: req.session.userId });

});

// Student Sign Up (GET)
router.get('/students/signup', (req, res) => {

    Course.find()
    .then(courses => {
        res.render("students/signup", {courses});
    }).catch(err => console.log(err));


});
// Student Sign Up (POST)
router.post(
    "/students",
    validator.body('email').isEmail(),
    validator.body('password').isLength({ min: 5 }),

    (req, res) => {

        const validationError = validator.validationResult(req);
        console.log(req.body);
        if (!validationError.isEmpty()) {
            return res.status(500).send("Validation Errors");
        }
        Student.createSecure(req.body, (err, newUser) => {
            console.log("New User: ", newUser);
            //req.session.userId = newUser._id;
            res.redirect("/login");
        });
    }
);

// Student Login (GET)
router.get('/students/login', (req, res) => {

    res.render("students/login");

});

// Student Login (POST)
router.post('/students/sessions', (req, res) => {

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
            req.session.userType = "Student";
            res.redirect("/home");
        }
    }
    );
});

// Students Profile
router.get('/students/:id', (req, res) =>{
    
    const id = req.params.id
    Student.findById(id)
    .then(students => {
        res.render('students/profile',{students, userId: req.session.userId});
    }).catch((err) =>{
        console.log(err);
        res.status(500).send("Error!")
    });
});



//***************************** Export *****************************//
module.exports = router;