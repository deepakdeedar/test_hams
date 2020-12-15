const handleConfirm = (req, res, db, sgMail) => {
  userMail = req.body.userMail;
  doctorMail = req.body.docMail;
  sgMail.setApiKey(process.env.API_KEY);

  const msg = {
    to: userMail, // Change to your recipient
    from: "thehams24@gmail.com", // Change to your verified sender
    subject: "Appointment Related Mail",
    text: "date and time will be shared by doctor",
    html:
      "<p>Your Date and time for appointment will be shared by doctor(" +
      doctorMail +
      " )</p><br>" +
      "<p>HAMS (Hospital Appointment Management System ) is made solely for people to easily book appointments in hospitals with respective doctors.</p><br>" +
      "<img src='https://i.ibb.co/FVHg1f3/logo-transparent.png' alt='logo' border='0'>",
  };

  const msg2 = {
    to: doctorMail, // Change to your recipient
    from: "thehams24@gmail.com", // Change to your verified sender
    subject: "Appointment Related Mail",
    text: "please share date and time to the patient",
    html:
      "<p>Please share Date and time of appointment to the patient (" +
      userMail +
      " )</p><br>" +
      "<p>HAMS (Hospital Appointment Management System ) is made solely for people to easily book appointments in hospitals with respective doctors.</p><br>" +
      "<img src='https://i.ibb.co/FVHg1f3/logo-transparent.png' alt='logo' border='0'>",
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
  sgMail
    .send(msg2)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });

  db.select("*")
    .from("users")
    .where("email", "=", userMail)
    .then((user) => {
      console.log(user);
      res.render("home", {
        user: user[0],
        logedin: true,
        isdoctor: false,
        contact: "",
        about: "",
        book: "",
        home: "active",
        greet: "Book Another Appointment, " + user[0].name,
        title: "Home",
        isPatient: true,
      });
    });
};

module.exports = {
  handleConfirm: handleConfirm,
};
