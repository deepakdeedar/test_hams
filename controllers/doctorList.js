const handleDoctorList = (req, res, db) => {
    console.log('done')
    console.log(req.body.user);
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
        user: req.body.user
      });
    });
};

module.exports = {
    handleDoctorList: handleDoctorList
}