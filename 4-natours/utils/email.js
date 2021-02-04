const nodemailer = require('nodemailer');

/*
  In order to test this functionality I have created a new account on mailtrap.io.
  Mailtrap allows to send email avoiding them to reach the final users.
*/
const sendEmail = async (options) => {
  // 1) Create a transporter
  // const transporter = nodemailer.createTransport({
  //   service: 'Gmail',
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  //   // Activate in gmail "less secure app" option
  // });
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
    // Activate in gmail "less secure app" option
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Ivan Pavic <ivan96jp@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
