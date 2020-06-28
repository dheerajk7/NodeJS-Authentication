const nodeMailer = require('../config/nodemailer');

exports.sendVerification = (data) =>
{
    //getting verification mail template and passing some data to template
    let htmlString = nodeMailer.renderTemplate({data:data},'/verify-email/verify_email.ejs')
    nodeMailer.transporter.sendMail(
        {
            from:'contact@codial.com',
            to:data.email,
            subject:'Verify Account',
            html:htmlString,
        },
        function(err,info)
        {
            if(err)
            {
                console.log('Error in sending mail',err);
                return;
            }
            return;
        }
    );
}