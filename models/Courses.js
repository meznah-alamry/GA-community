var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    var CourseSchema = new Schema({
        CourseName:String,
        Length:String,
        Location:String,
        Description:String

    });

    
var Courses = mongoose.model('Courses',CourseSchema );

module.exports =Courses ;