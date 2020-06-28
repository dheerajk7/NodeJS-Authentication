const VerificationToken = require('../models/verification-token');
const User = require('../models/user');
const queue = require('../config/kue');
const verificationEmailWorker = require('../worker/verification-email');

//render page for verification of emai;
module.exports.home = function(request,response)
{
    if(request.user.is_varified)
    {
        return response.redirect('/');
    }
    return response.render('verify-email',{
        title:'Verify Email | Authentication',
    })
}

//sending verification mail function
module.exports.sendVerificationMail = async function(request, response)
{
    //if user is already verified returning it to home page
    if(request.user.is_varified)
    {
        return response.redirect('/');
    }

    //finding token
    //if token already created then using that token again and sending mail
    let token = await VerificationToken.findOne({user:request.user.id});
    if(token)
    {
        let mailData = {
            token:token.access_token,
            email:request.user.email,
            name:request.user.name,
        }

        //putting verification mail into queue
        let job = queue.create('verificationEmail',mailData).save(function(err)
        {
            if(err)
            {
                console.log(err);
                return;
            }
        });
        request.flash('success','Verification Email Sent');
        return response.redirect('back');
    }
    else
    {
        //creating token if token is not there and sending mail
        token = await VerificationToken.create({
            user:request.user.id,
            access_token:Date.now(),
        });

        //data to be send in mail
        let mailData = {
            token:token.access_token,
            email:request.user.email,
            name:request.user.name,
        }

        //putting verification mail into queue
        let job = queue.create('verificationEmail',mailData).save(function(err)
        {
            if(err)
            {
                console.log(err);
                return;
            }
        });
        request.flash('success','Verification Email Sent');
        return response.redirect('back');
    }
}

//verifying email
module.exports.verifyEmail = async function(request, response)
{
    let token = await VerificationToken.findOne({access_token:request.params.token});
    //finding token and updating it to true for verification
    if(token)
    {
        let user = await User.findByIdAndUpdate(token.user).populate();
        user.is_varified = true;
        user.save();
        await VerificationToken.findByIdAndDelete(token.id);
        request.flash('success','Email Verified Successfully');
        return response.redirect('/');
    }
    else
    {
        request.flash('error','Link Expired...Send Verification Mail Again');
        return response.redirect('/verification-email');
    }
}