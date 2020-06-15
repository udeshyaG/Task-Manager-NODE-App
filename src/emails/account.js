const sendgridAPIKey = process.env.SEND_GRID_API_KEY;

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(sendgridAPIKey);

function sendWelcomeEmail(email, name) {
  sgMail.send({
    to: email,
    from: "udeshyacoder@gmail.com",
    subject: "Welcome to my Task Manager App",
    text: `${name}, we are proud to have you in our family. Regrads from Udeshya`,
  });
}

function sendCancelationEmail(email, name) {
  sgMail.send({
    to: email,
    from: "udeshyacoder@gmail.com",
    subject: "Your account has been deactivated",
    text: `${name}, we are so sorry that you left 😭😭. - regards Udeshya`,
  });
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
