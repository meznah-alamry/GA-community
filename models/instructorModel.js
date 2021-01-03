var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    var InstructorSchema = new Schema({
        Fullname:String,
        HiddenTalent:String,
        Email:String,
        Password:String,
        NumberPhone:Number,
        Description:String,
        Rating:Number

    });

    
var Instructor = mongoose.model('Instructor', InstructorSchema);

module.exports =Instructor ;

