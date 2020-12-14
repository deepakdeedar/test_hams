const handleSignin = (req, res, db, bcrypt) => {
  var d = new Date();
  //sgMail.setApiKey(process.env.API_KEY);
  const { password, email } = req.body;
  if (!email || !password) {
    return res.status(400).render("signin", {
      year: d.getFullYear(),
      error: true,
      message: "incorrect form submission",
      title: "Sign In",
    });
  }
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      console.log(data[0]);
      const isValid = bcrypt.compareSync(password, data[0].hash);
      console.log(isValid);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
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
              greet: "Welcome Back , " + user[0].name,
              title: "Home",
              isPatient: true
            });
          })
          .catch((err) =>
            res.status(400).render("signin", {
              year: d.getFullYear(),
              error: true,
              message: "unable to get user",
              logedin: false,
              isdoctor: false,
              contact: "",
              about: "",
              book: "",
              home: "active",
              title: "Sign In",
              user: '',
              isPatient: false
            })
          );
      } else {
        res.status(400).render("signin", {
          year: d.getFullYear(),
          error: true,
          message: "Wrong Credentials",
          logedin: false,
          isdoctor: false,
          contact: "",
          about: "",
          book: "",
          home: "active",
          title: "Sign In",
          user: '',
          isPatient: false
        });
      }
    })
    .catch((err) =>
      res.status(400).render("signin", {
        year: d.getFullYear(),
        error: true,
        message: "Wrong Credentials",
        logedin: false,
        isdoctor: false,
        contact: "",
        about: "",
        book: "",
        home: "active",
        title: "Sign In",
        user: '',
        isPatient: false
      })
    );
};

module.exports = {
  handleSignin: handleSignin,
};

// const msg = {
//   to: "test@example.com", // Change to your recipient
//   from: "test@example.com", // Change to your verified sender
//   subject: "Sending with SendGrid is Fun",
//   text: "and easy to do anywhere, even with Node.js",
//   html: "<strong>and easy to do anywhere, even with Node.js</strong>",
// };
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log("Email sent");
//   })
//   .catch((error) => {
//     console.error(error);
//   });
