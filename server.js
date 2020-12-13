const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");

const registerPatient = require("./controllers/registerPatient");
const registerDoctor = require("./controllers/registerDoctor");
const signin = require("./controllers/signin");
const signinDoctor = require("./controllers/signinDoctor");
const updateDoctor = require("./controllers/updateDoctor");

const db = knex({
  client: "pg",
  connection: {
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
  res.render("home", {logedin: false, isdoctor: false, contact: "", about: "", book: "", home: "active"});
});

app.get("/register", (req, res) => {
  res.render("register", { year: d.getFullYear(), error:false, isdoctor: false, contact: "", about: "", book: "", home: "active" });
});


app.get("/registerDoctor", (req, res) => {
  res.render("registerDoctor", { year: d.getFullYear(), error: false, isdoctor: false, contact: "", about: "", book: "", home: "active" });
});

app.get("/signin", (req, res) => {
  res.render("signin", { year: d.getFullYear(), error: false, isdoctor: false, contact: "", about: "", book: "", home: "active"});
});

app.get("/signinDoctor", (req, res) => {
  res.render("signinDoctor", { year: d.getFullYear(), error: false, isdoctor: false, contact: "", about: "", book: "", home: "active"});
});

var doctor;
db.select('*').from('doctors').then(data => {
  doctor = data;
});
console.log(doctor)

app.get("/doctor-list", (req, res) => {
  res.render("doctors", {doctor: doctor, isdoctor: false, contact: "", about: "", book: "active", home: ""})
});

app.get("/about", (req, res) => {
  res.render("about", {logedin: false, isdoctor: false, contact: "", about: "active", book: "", home: ""})
})

app.get("/contact", (req, res) => {
  res.render("contact", {logedin: false, isdoctor: false, contact: "active", about: "", book: "", home: ""})
})

app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.post("/signinDoctor", (req, res) => {
  signinDoctor.handleSigninDoctor(req, res, db, bcrypt);
});

app.post("/register-as-patient", (req, res) => {
  registerPatient.handlePatient(req, res, db, bcrypt);
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
