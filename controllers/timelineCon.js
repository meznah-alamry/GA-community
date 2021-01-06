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
const Timeline = require("../models/timelineModel");

var bodyParser = require("body-parser");
const e = require('express');
router.use(bodyParser.urlencoded({ extended: true }));


router.use(
    session({
        store: new mongoSessisonStore({ mongooseConnection: mongoose.connection }),
        saveUninitialized: true,
        resave: true,
        secret: "SuperSecretCookie",
        cookie: {maxAge: 30 * 60 * 1000 },
    })
);



router.get('/timeline', (req, res) => {


    Timeline.find()
        .populate('Student')
        .populate('Instructor')
        .populate('user')
        .then((messages) => {
            res.render("timeline", { messages, userId: req.session.userId });
        })


});

router.post('/timeline', (req, res) => {

    Timeline.create(
        { user: req.session.userId, content: req.body.timeline })
        .then(timeline => {
            res.redirect('/timeline')

        }).catch(err => console.log(err));
});

module.exports = router;