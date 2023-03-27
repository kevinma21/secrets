//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true})
.then(() => {
    console.log("connected to mongodb");
})
.catch((err) => {
    console.log("Error connecting to mongodb: ", err);
});
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email:String,
    password:String
});


userSchema.plugin(encrypt, { secret:process.env.SECRET, encryptedFields:["password"]});
const User = mongoose.model("User", userSchema);

//Home Section
app.route("/")
 .get((req,res) => {
    res.render("home");
});


//Login Section
app.route("/login")
 .get((req,res) => {
    res.render("login");
})
 .post((req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    User.findOne({email:username})
    .then((foundUser) => {
        if(foundUser.password === password) {
            res.render("secrets");
        } else {
            res.render("login");
        }
    })
    .catch((err) => {
        console.log(err);
    });
});

// Register Section
app.route("/register")
.get((req,res) => {
    res.render("register");
})
.post((req,res) => {
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    });

    newUser.save()
    .then(() => {
        res.render("secrets");
    })
    .catch((err) => {
        res.render(err);
    });
});

app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
})