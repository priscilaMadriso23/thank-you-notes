const sgMail = require('@sendgrid/mail');
const pug = require('pug');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
exports.sendMail=(category,project,description,nominee,nominatedBy) =>{
    const body = pug.renderFile(`${__dirname}/emailTemplate/nominationEmail.pug`,
    {
        category,
        project,
        description,
        nominee,
        nominatedBy
    }
    );
    console.log(body);
    const msg = {
        to:nominee,
        from:'no-reply@recognitions.com',
        subject:'You have been nominated',
        html:body
    }
    sgMail.send(msg, (error, result) => {
        if (error) {
            success = 'false';
        }
        console.log(`Email sent: ${success}`);
    }).catch((e) => {
        console.error(e.toString());
    });
}