const sgMail = require('@sendgrid/mail');
const pug = require('pug');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
exports.sendMail = (form, user) => {
  const message = {
    ...form,
    user,
  };
  const body = pug.renderFile(`${__dirname}/emailTemplate/nominationEmail.pug`, message);
  const msg = {
    to: process.env.TO_RECIPIENT,
    // cc: form.nominee,
    from: 'no-reply@eyrecognitions.com',
    subject: 'You have been nominated',
    html: body,
  };
  sgMail.send(msg, (error, result) => {
    if (error) {
      console.error(`Error sending email: ${error}`);
    }
  }).catch((e) => {
    console.error(e.toString());
  });
};
