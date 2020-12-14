const { compareSync } = require("bcrypt-nodejs");
const e = require("express");

const handleBookAppointment = (req, res, db) => {
  emailDoctor = req.body.doctor;
  emailUser = req.body.user;

  db.select("*")
    .from("users")
    .where("email", "=", emailUser)
    .then((data) => {
      if (data[0].email === "") {
        throw "not found";
      } else {
        db.select("*")
        .from("doctors")
        .where('email', '=', emailDoctor)
        .decrement('avail', 1)
        .then((data) => {
            console.log(data)
        })
        .catch(err => {
            console.log(err)
        });
      }
    })
    .catch((err) => {
      res.json("User Not Found");
    });
};

module.exports = {
  handleBookAppointment: handleBookAppointment,
};
