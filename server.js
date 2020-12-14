const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");
require('dotenv').config();
const sgMail = require('@sendgrid/mail');

const registerPatient = require("./controllers/registerPatient");
const registerDoctor = require("./controllers/registerDoctor");
const signin = require("./controllers/signin");
const signinDoctor = require("./controllers/signinDoctor");
const updateDoctor = require("./controllers/updateDoctor");

const db = knex({
  client: "pg",
  connection: {
    // connectionString: process.env.DATABASE_URL,
    // ssl: { rejectUnauthorized: false }
    host: "127.0.0.1",
    user: "postgres",
    password: "test",
    database: "the-hams",
  },
});

db.select("*")
  .from("users")
  .then((data) => console.log(data));

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");

var d = new Date();

app.get("/", (req, res) => {
  res.render("home", {logedin: false, isdoctor: false, contact: "", about: "", book: "", home: "active", title: "Home"});
});

app.get("/register", (req, res) => {
  res.render("register", { year: d.getFullYear(), error:false, isdoctor: false, contact: "", about: "", book: "", home: "active", title: "Register" });
});


app.get("/registerDoctor", (req, res) => {
  res.render("registerDoctor", { year: d.getFullYear(), error: false, isdoctor: false, contact: "", about: "", book: "", home: "active", title: "Register Doctor" });
});

app.get("/signin", (req, res) => {
  res.render("signin", { year: d.getFullYear(), error: false, isdoctor: false, contact: "", about: "", book: "", home: "active", title: "Sign In"});
});

app.get("/signinDoctor", (req, res) => {
  res.render("signinDoctor", { year: d.getFullYear(), error: false, isdoctor: false, contact: "", about: "", book: "", home: "active", title: "Sign In"});
});

var doctor;
db.select('*').from('doctors').then(data => {
  doctor = data;
});
console.log(doctor)

app.get("/doctor-list", (req, res) => {
  res.render("doctors", {doctor: doctor, isdoctor: false, contact: "", about: "", book: "active", home: "", title: "Doctors List"})
});

app.get("/about", (req, res) => {
  res.render("about", {logedin: false, isdoctor: false, contact: "", about: "active", book: "", home: "", title: "About"})
})

app.get("/contact", (req, res) => {
  res.render("contact", {logedin: false, isdoctor: false, contact: "active", about: "", book: "", home: "", title: "Contact Us"})
})

app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.post("/signinDoctor", (req, res) => {
  signinDoctor.handleSigninDoctor(req, res, db, bcrypt);
});

app.post("/register-as-patient", (req, res) => {
  registerPatient.handlePatient(req, res, db, bcrypt, sgMail);
});

app.post("/register-as-doctor", (req, res) => {
  registerDoctor.handleDoctor(req, res, db, bcrypt);
});

app.post("/updateDoctor", (req, res) => {
  updateDoctor.handleUpdateDoctor(req, res, db);
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started at port 3000.");
});
