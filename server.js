const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
const session = require("express-session");
const config = require("dotenv").config();
const mongoSessisonStore = require("connect-mongo")(session);
const validator = require("express-validator");


//Session
app.use(
    session({
      store: new mongoSessisonStore({ mongooseConnection: mongoose.connection }),
      saveUninitialized: true,
      resave: true,
      secret: "SuperSecretCookie",
      cookie: { maxAge: 30 * 60 * 1000 },
    })
  );
app.set('view engine' , 'ejs');


// connect to database and pull in model(s)
mongoose.connect(
    process.env.mongodb,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log(`MongoDb is Connected`)
);

// use css an js on ejs file
app.use(express.static("public"));
app.use(expressLayouts);

app.get('/' , (req ,res ) => {

res.send("Main Page");

})

//Start Server
let Port = 4000;
app.listen(Port , () => console.log(`GA Community Server is Running on Port: ${Port} `));