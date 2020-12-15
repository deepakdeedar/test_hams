const handlePatient = (req, res, db, bcrypt, sgMail) => {
  var d = new Date();
  sgMail.setApiKey(process.env.API_KEY);
  const { name, email, password, phone } = req.body;
  if (!email || !name || !password || !phone) {
    return res.status(400).json("incorrect form submission");
  }
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            phone: phone,
          })
          .then((user) => {
            res.render("home", {
              user: user,
              logedin: true,
              isdoctor: false,
              contact: "",
              about: "",
              book: "",
              home: "active",
              greet: "Welcome, " + user[0].name,
              title: "Home",
              user: user[0],
              isPatient: true
            });
            const msg = {
              to: user[0].email, // Change to your recipient
              from: "thehams24@gmail.com", // Change to your verified sender
              subject: "Welcome to The Hams",
              text: "welcome mail",
              html:
                "<h1>Welcome, " +
                user[0].name +
                "</h1><br><p>HAMS (Hospital Appointment Management System ) is made solely for people to easily book appointments in hospitals with respective doctors.</p><br><img src='https://i.ibb.co/FVHg1f3/logo-transparent.png' alt='logo' border='0'>",
            };
            sgMail
              .send(msg)
              .then(() => {
                console.log("Email sent");
              })
              .catch((error) => {
                console.error(error);
              });
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) =>
    res.status(400).render("register", {
      year: d.getFullYear(),
      error: true,
      message: "Unable to register.",
      contact: "",
      about: "",
      book: "",
      home: "active",
      isdoctor: false,
      title: "Register",
      logedin: false,
      user: '',
      isPatient: false
    })
  );
};

module.exports = {
  handlePatient: handlePatient,
};
