const express = require('express');
const router = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
const session = require("express-session");
const config = require("dotenv").config();
const mongoSessisonStore = require("connect-mongo")(session);
const validator = require("express-validator");
const Instructor = require("../models/instructorModel");
// const Student = require("../models/studentModel");

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

router.get('/instructors', (req, res) => {

        res.render("instructors/instructors", {userId: req.session.userId});
   
});

// Instructors's Profile
router.get('/profile/:id', (req, res) =>{
    
})


//***************************** Export *****************************//
module.exports = router;