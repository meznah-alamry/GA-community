const express = require('express');
const router = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
const session = require("express-session");
const config = require("dotenv").config();
const mongoSessisonStore = require("connect-mongo")(session);
const validator = require("express-validator");
const Student = require('../models/studentModel');

var bodyParser = require("body-parser");
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

// Students List
router.get('/students', (req, res) => {

    // Student.find()
    // .then(students => {
    //     res.render('students/students',{ userId: req.session.userId }, { students: students })
    // })
    // .catch((err) => console.log(err));

    res.render("students/students",{ userId: req.session.userId });

});

// Create New Student
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

// User's Profile
router.get('/profile',(req, res) =>{

    // Student.find()
    // .then(student => {
    //     res.render('profile',{userId : req.session.userId},{student : student});
    // }).catch(err => console.log(err));

    res.render("profile", { userId: req.session.userId });

})



//***************************** Export *****************************//
module.exports = router;