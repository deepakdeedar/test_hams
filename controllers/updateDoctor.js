const handleUpdateDoctor = (req, res, db) => {

    var d = new Date();
    const {avail, email} = req.body;
    if (!avail) {
      return res.status(400).render('signin', {year: d.getFullYear(), error: true, message: 'incorrect form submission'});
    }
    db.select('*').from('doctors').where('email', '=', email).update('avail', avail).then(user => {
        return db.select('*').from('doctors')
          .where('email', '=', email)
          .then(user => {
            res.render('update', {doctor: user[0], isdoctor: true, contact: "", about: "", book: "", home: ""});
          })
          .catch(err => res.status(400).render('signin', {year: d.getFullYear(), error: true, message: 'unable to get user'}))
        //res.render('update', {doctor: user[0]});
      });
}

module.exports = {
handleUpdateDoctor: handleUpdateDoctor
}