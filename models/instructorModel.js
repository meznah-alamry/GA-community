const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InstructorSchema = new Schema({

    Fullname: String,
    HiddenTalent: String,
    Email: String,
    Password: String,
    NumberPhone: Number,
    Description: String,
    Rating: Number

});


const instructor = mongoose.model('Instructor', InstructorSchema);

module.exports = instructor;

