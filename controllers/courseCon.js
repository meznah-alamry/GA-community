const express = require('express');
const router = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
const session = require("express-session");
const config = require("dotenv").config();
const mongoSessisonStore = require("connect-mongo")(session);
const validator = require("express-validator");
const Course = require("../models/courseModel");

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

// All Courses
router.get('/courses', (req, res) => {

    const userId = req.session.userId;
    const userType = req.session.userType;

    res.render("courses/courses", {userId,userType });

});

// Course Details
router.get('/courses/:id', (req, res) => {

    res.render("courses/courses", {userId: req.session.userId});

});

// Create New Course (GET)
router.get('/courses/new', (req, res) => {

    res.render("courses/new", {userId: req.session.userId});

});





//***************************** Export *****************************//
module.exports = router;