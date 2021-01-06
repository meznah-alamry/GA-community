const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({

    name: String,
    length: String,
    location: String,
    description: String
    
});


var Course = mongoose.model('Course', CourseSchema);

module.exports = Course;