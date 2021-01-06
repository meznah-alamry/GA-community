const express = require('express');
const router = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
const session = require("express-session");
const config = require("dotenv").config();
const mongoSessisonStore = require("connect-mongo")(session);
const validator = require("express-validator");
const Course = require("../models/courseModel");
const methodOverride = require('method-override');

var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));

router.use(methodOverride("_method"));


//***************************** Routes *****************************//

// All Courses
router.get('/courses', (req, res) => {

    const userId = req.session.userId;
    const userType = req.session.userType;

    Course.find()
    .then(courses => {
        res.render("courses/courses", {courses, userId, userType});
    }).catch(err => console.log(err));

});

// Create New Course (GET)
router.get('/courses/new', (req, res) => {

    const userId = req.session.userId;
    const userType = req.session.userType;

    res.render("courses/new", {userId,userType});

});

// Create New Course (POST)
router.post('/courses', (req, res) => {

    let newCourse = {
        name: req.body.name,
        length: req.body.length,
        location: req.body.location,
        type: req.body.type,
        hours: req.body.hours,
        description: req.body.description
    }

    Course.create(newCourse)
    .then(()=>{
        res.redirect('/courses')
    }).catch(err => console.log(err));

})

// Course Details
router.get('/courses/:id', (req, res) => {

    let id = req.params.id;
    const userId = req.session.userId;
    const userType = req.session.userType;

    Course.findById(id)
    .then(course => {
        res.render("courses/profile", {course, userId, userType});
    }).catch(err => console.log(err));

});

// Edit Course (GET)
router.get('/courses/:id/edit', (req, res) => {

        let id = req.params.id
        const userId = req.session.userId;
        const userType = req.session.userType;

    Course.findById(id)
    .then(course =>{
       
        res.render('courses/edit' , {course, userId, userId})
    })
});

// Edit Course (PUT)
router.put('/courses/:id', (req, res) => {

    let id = req.params.id
    const userId = req.session.userId;
    const userType = req.session.userType;

    let updatedCourse = {
        name: req.body.name,
        length: req.body.length,
        location: req.body.location,
        type: req.body.type,
        hours: req.body.hours,
        description: req.body.description
    }


    Course.findByIdAndUpdate(id, updatedCourse)
.   then(() =>{
   
    res.redirect(`/courses/${id}`);
    }).catch(err => console.log(err));
});

// Delete Course
router.delete('/courses/:id', (req, res) => {

    let id = req.params.id
    const userId = req.session.userId;
    const userType = req.session.userType;

    Course.findByIdAndDelete(id)
    .then(() => {
        res.redirect('/courses');
    }).catch(err => console.log(err))

});

// Create New Course (GET)
router.get('/courses/new', (req, res) => {

    res.render("courses/new", {userId: req.session.userId});

});





//***************************** Export *****************************//
module.exports = router;