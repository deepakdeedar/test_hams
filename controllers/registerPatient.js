const handlePatient = (req, res, db, bcrypt) => {
  var d = new Date();
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
            res.render("home", {user: user, logedin: true, isdoctor: false, contact: "", about: "", book: "", home: "active", greet: "Welcome, " + user[0].name });
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) =>
    res
      .status(400)
      .render("register", {
        year: d.getFullYear(),
        error: true,
        message: "Unable to register.",
        contact: "", about: "", book: "", home: "active", isdoctor: false
      })
  );
};

module.exports = {
  handlePatient: handlePatient,
};
