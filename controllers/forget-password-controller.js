const ResetToken = require('../models/reset-token');
const User = require('../models/user');
const queue = require('../config/kue');
const forgetPasswordMailerWorker = require('../worker/forget-passsword-email');
const bcrypt = require('bcrypt');

//rendering reset password page to get the email of user
module.exports.home = function(request,response)
{
    return response.render('forget-password',
    {
        title:'Reset Password | Authentication',
    })
}

//function to find user and send mail on registered mail
module.exports.resetMail = async function(request,response)
{
    try{
        let user = await User.findOne({email:request.body.email.toLowerCase()});
        //getting the reset token if already created by user and deleting it
        await ResetToken.findOneAndDelete({email:request.body.email.toLowerCase()});
        if(user)
        {
            //creating new token using current time
            let token = await ResetToken.create(
                {
                    email:request.body.email.toLowerCase(),
                    access_token:Date.now(),
                    is_valid:true,
                }
            );
            //using delayed jobs to send mail
            let mailData = {email:user.email, name:user.name, access_token:token.access_token};
            let job = queue.create('forgetPasswordEmails',mailData).save(function(err){
                if(err)
                {
                    console.log(err);
                    return;
                }
            });
            request.flash('success','Mail sent check and verify');
            return response.redirect('/authenticate/sign-in');
        }
        else
        {
            request.flash('error','Email Not Found Create New Account');
            return response.redirect('back');
        }
    }
    catch(err)
    {
        console.log('Error in creating reset token');
        return;
    }
}

//rendering set password page to get new password
module.exports.setPassword = async function(request,response)
{
    try
    {
        let token = await ResetToken.findOne({access_token:request.params.token});
        if(token && token.is_valid)
        {
            return response.render('set-password',
            {
                title:'Set Password | JAIVIK JAAYAKA',
                token:token.access_token,
            });
        }
        else
        {
            request.flash('error','Link Expired');
            return response.redirect('/reset-password');
        }
    }
    catch(err)
    {
        console.log('Error in reseting Password');
        return;
    }
}

//function to save password from set password form
module.exports.savePassword = async function(request, response)
{
    try
    {
        if(request.body.new_password == request.body.confirm_password)
        {
            //checing if token exist or not to reset password
            let token = await ResetToken.findOne({access_token:request.params.token});
            if(token && token.is_valid)
            {
                await token.updateOne({is_valid:false});
                let user = await User.findOneAndUpdate({email:token.email});
                if(user)
                {
                    //generating password hash
                    let passwordHash = await bcrypt.hash(request.body.new_password,7);
                    user.password = passwordHash;
                    //as user set password then password are available to login without google login so setting it to true
                    user.is_password_available = true;
                    user.save();
                    request.flash('success','Password Changed Successfully');
                    await ResetToken.deleteOne({access_token:request.params.token});
                    return response.redirect('/authenticate/sign-in');
                }
                else
                {
                    request.flash('error','Link Expired');
                    return response.redirect('/reset-password');
                }
            }
            else
            {
                request.flash('error','Link Expired');
                return response.redirect('/reset-password');
            }
        }
        else
        {
            request.flash('error','Password does not matched');
            return response.redirect('back');
        }
            
    }
    catch(err)
    {
        console.log('Error in saving password',err);
        return;
    }
}