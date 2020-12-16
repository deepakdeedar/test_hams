const handleContactUs = (req, res, sgMail) => {
    sgMail.setApiKey(process.env.API_KEY);

    const msg = {
        to: "thehams24@gmail.com", // Change to your recipient
        from: "thehams24@gmail.com", // Change to your verified sender
        subject: "Feedback",
        text: "feedback",
        html: "Name: " + req.body.name + "<br>" + "Email: " + req.body.email + "<br>" + "Subject: " + req.body.subject + "<br>" + "Message: " + req.body.message
      };
    
      sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

      res.redirect('/');

}

module.exports = {
    handleContactUs: handleContactUs
}