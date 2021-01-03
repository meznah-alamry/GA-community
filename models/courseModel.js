const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({

    Name: String,
    Length: String,
    Location: String,
    Description: String
    
});


var Courses = mongoose.model('Courses', CourseSchema);

module.exports = Courses;