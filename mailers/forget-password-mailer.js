const nodeMailer = require('../config/nodemailer');

exports.forgetPassword = (token) =>
{
    //getting template for reset password mail
    //passing data to template such as user name and access token
    let htmlString = nodeMailer.renderTemplate({token:token},'/reset/forget_password.ejs')
    nodeMailer.transporter.sendMail(
        {
            from:'contact@codial.com',      //mail detail
            to:token.email,
            subject:'Reset Password',
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