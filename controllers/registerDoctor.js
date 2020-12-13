const handleDoctor = (req, res, db, bcrypt) => {
  var d = new Date();
  const { name, email, password, phone, special } = req.body;
  if (!email || !name || !password || !phone || !special) {
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
        return trx("doctors")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            phone: phone,
            special: special,
          })
          .then((user) => {
            res.render("home", {
              doctor: user[0],
              isdoctor: true,
              logedin: true,
              contact: "",
              about: "",
              book: "",
              home: "active",
              greet: "Welcome, Dr." + user[0].name,
            });
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) =>
    res
      .status(400)
      .render("registerDoctor", {
        year: d.getFullYear(),
        error: true,
        message: "Unable to register.",
        contact: "", about: "", book: "", home: "active", isdoctor: false
      })
  );
};

module.exports = {
  handleDoctor: handleDoctor,
};
