const handleBookAppointment = (req, res, db) => {
  emailDoctor = req.body.doctor;
  emailUser = req.body.user;

  db.select("*")
    .from("users")
    .where("email", "=", emailUser)
    .then((data) => {
        userInfo = data;
      if (data[0].email === "") {
        throw "not found";
      } else {
        db.select("*")
        .from("doctors")
        .where('email', '=', emailDoctor)
        .decrement('avail', 1)
        .then((data) => {
          db.select("*")
          .from("doctors")
          .where("email", "=", emailDoctor)
          .then(doctor => {
            res.render("confirmAppointment", {
              doctor: doctor[0],
              userInfo: userInfo[0],
              isdoctor: false,
              contact: "",
              about: "",
              book: "active",
              home: "",
              title: "Doctors List",
              user: req.body.user,
              error: true,
              logedin: false,
              isPatient: false
            });
          })
        })
        .catch(err => {
            console.log(err)
        });
      }
    })
    .catch((err) => {
      //res.json("User Not Found");
      db.select("*")
    .from("doctors")
    .then((data) => {
      res.render("doctors", {
        doctor: data,
        isdoctor: false,
        contact: "",
        about: "",
        book: "active",
        home: "",
        title: "Doctors List",
        user: req.body.user,
        error: true,
        logedin: false,
        isPatient: false
      });
    });
    });
};

module.exports = {
  handleBookAppointment: handleBookAppointment,
};
