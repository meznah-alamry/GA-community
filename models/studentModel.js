const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const StudentSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    index: { unique: true } // uniqueness constraint
  },
  passwordDigest: {
    type: String,
    required: true
  },
  number: Number,
  course: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Courses' }]


});

// create a new user with secure (hashed) password (for sign up)
StudentSchema.statics.createSecure = (body, callback) => {
  
  console.log("I received this email, password:");
  console.log("Email: "+body.email+"\nPassword: "+body.password);

  // generate some salt
  bcrypt.genSalt(function (err, salt) {
    console.log("bcrypt salt: ",salt)
    // hash the password with the salt
    bcrypt.hash(body.password, salt, (err, hash) => {
      console.log("hash: ",hash)

      // create a new user in the db with hashed password and execute the callback when done
      Student.create({
        email: body.email,
        passwordDigest: hash,
        name: body.name,
        number: body.number,
        course: body.course
      },callback);
    });
  });
};

// authenticate user (for login)
StudentSchema.statics.authenticate = function (email, password, cb) {
  // find user by email entered at log in
  this.findOne({ email: email }, function (err, user) {
    // throw error if can't find user
    console.log("Password: ", password);
    if (user === null) {
      cb("Can\'t find user with that email", null);
      // if found user, check if password is correct
    } else if (user.checkPassword(password)) {
      // the user is found & password is correct, so execute callback
      // pass no error, just the user to the callback
      cb(null, user);
    } else {
      // user found, but password incorrect
      cb("password incorrect", user);
    }
  });
};

// compare password user enters with hashed password (`passwordDigest`)
StudentSchema.methods.checkPassword = function (password) {
  // run hashing algorithm (with salt) on password to compare with stored `passwordDigest`
  // `compareSync` is like `compare` but synchronous
  // returns true or false
  return bcrypt.compareSync(password, this.passwordDigest);
};


var Student = mongoose.model('Student', StudentSchema);

module.exports = Student;