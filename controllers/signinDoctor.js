const handleSigninDoctor = (req, res, db, bcrypt) => {
  var d = new Date();
  const { password, email } = req.body;
  if (!email || !password) {
    return res.status(400).render("signinDoctor", {
      year: d.getFullYear(),
      error: true,
      message: "incorrect form submission",
      title: "Sign In"
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
          .from("doctors")
          .where("email", "=", email)
          .then((user) => {
            res.render("home", {
              doctor: user[0],
              isdoctor: true,
              logedin: true,
              contact: "",
              about: "",
              book: "",
              home: "active",
              greet: "Welcome Back, Dr. " + user[0].name,
              title: "Home"
            });
          })
          .catch((err) =>
            res.status(400).render("signinDoctor", {
              year: d.getFullYear(),
              error: true,
              message: "unable to get user",
              contact: "",
              about: "",
              book: "",
              home: "active",
              isdoctor: false,
              title: "Sign In"
            })
          );
      } else {
        res.status(400).render("signinDoctor", {
          year: d.getFullYear(),
          error: true,
          message: "Wrong Credentials",
          contact: "",
          about: "",
          book: "",
          home: "active",
          isdoctor: false,
          title: "Sign In"
        });
      }
    })
    .catch((err) =>
      res.status(400).render("signinDoctor", {
        year: d.getFullYear(),
        error: true,
        message: "Wrong Credentials",
        contact: "",
        about: "",
        book: "",
        home: "active",
        isdoctor: false,
        title: "Sign In"
      })
    );
};

module.exports = {
  handleSigninDoctor: handleSigninDoctor,
};
