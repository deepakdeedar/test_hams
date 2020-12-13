const handleSignin = (req, res, db, bcrypt) => {

        var d = new Date();
        const {password , email} = req.body;
        if (!email || !password) {
          return res.status(400).render('signin', {year: d.getFullYear(), error: true, message: 'incorrect form submission'});
        }
        db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            console.log(data[0])
          const isValid = bcrypt.compareSync(password, data[0].hash);
          console.log(isValid)
          if (isValid) {
            return db.select('*').from('users')
            .where('email', '=', email)
              .then(user => {
                console.log(user)
                res.render("home", {user: user, logedin: true, isdoctor: false, contact: "", about: "", book: "", home: "active", greet: "Welcome Back , " + user[0].name});
              })
              .catch(err => res.status(400).render('signin', {year: d.getFullYear(), error: true, message: 'unable to get user', logedin: true, isdoctor: false, contact: "", about: "", book: "", home: "active"}))
          } else {
            res.status(400).render('signin', {year: d.getFullYear(), error: true, message: 'Wrong Credentials', logedin: true, isdoctor: false, contact: "", about: "", book: "", home: "active"})
          }
        })
        .catch(err => res.status(400).render('signin', {year: d.getFullYear(), error: true, message: 'Wrong Credentials', logedin: true, isdoctor: false, contact: "", about: "", book: "", home: "active"}))
}

module.exports = {
    handleSignin: handleSignin
}