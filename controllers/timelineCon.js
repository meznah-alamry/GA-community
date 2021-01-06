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
router.use(bodyParser.urlencoded({ extended: true }));

// Timeline
router.get('/timeline', (req, res) => {

    Timeline.find()  //.sort({content:-1})
    .then(timeline => {
        res.render("timeline", {userId: req.session.userId, timeline: timeline});
    })
    .catch(err => console.log(err))

});

// Posting
router.post('/timeline', (req, res) => {

    const userType = req.session.userType;
    const userId = req.session.userId;

    if(userType==="Student"){
        
        Student.findById({_id: userId})
        .then(student => {
            Timeline.create(
                {userId: req.session.userId, user: student.name, content:req.body.content})
            .then(timeline => {
                res.redirect('/timeline')
            }).catch(err =>console.log(err));
            
        }).catch(err => console.log(err))

    }else if(userType==="Instructor"){

                
        Instructor.findById({_id: userId})
        .then(instructor => {
            Timeline.create(
                {userId: req.session.userId, user: instructor.name, content:req.body.content})
            .then(timeline => {
                res.redirect('/timeline')
            }).catch(err =>console.log(err));
            
        }).catch(err => console.log(err))

    }


})






//********** Export **********//
module.exports = router;