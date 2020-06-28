const User = require('../models/user');
const bcrypt = require('bcrypt');
const VerificationToken = require('../models/verification-token');
const queue = require('../config/kue');
const verificationEmailWorker = require('../worker/verification-email');

//creating new user
module.exports.addUser = async function(request,response)
{
    try
    {
        let requestEmail = request.body.email.toLowerCase();
        //checking both password in form to be same
        if(request.body.password != request.body.confirm_password)
        {
            request.flash('error','Password Does not Matched');
            return response.redirect('back');
        }
        let user = await User.findOne({email:requestEmail});
        if(!user)
        {
            let salt = 7;
            //encrypting password
            let passwordHash = await bcrypt.hash(request.body.password,salt);
            user =await User.create(
                {
                    email:requestEmail,
                    password:passwordHash,
                    name:request.body.name,
                    is_varified:false,
                    is_password_available:true,
                }
            );
            //creating verification token with the help of these tokens access token user will verify his account
            let verificationToken = await VerificationToken.create({
                user:user.id,
                access_token:Date.now(),
            });

            //sending data in  mail for verification when user is created
            let mailData = {
                token : verificationToken.access_token,
                email:user.email,
                name:user.name,
            };
            //putting verification mail into queue
            let job = queue.create('verificationEmail',mailData).save(function(err)
            {
                if(err)
                {
                    console.log(err);
                    return;
                }
                request.flash('success','User Created and Verification Mail sent');
                return response.redirect('/authenticate/sign-in');
            });
        }
        else
        {
            request.flash('error','User Exist');
            return response.redirect('/authenticate/sign-in');
        }
    }
    catch(err)
    {
        return;
    }
}

//getting profile of user
module.exports.profile = async function(request,response)
{
    if(request.user.is_varified == false)
    {
        request.flash('error','Verify Email First');
        return response.redirect('/verification-email');
    }
    let user = await User.findById(request.user.id);
    return response.render('profile',
    {
        title:'Profile | Authentication',
        user:user,
    })
}

//rendering change password page
module.exports.changePassword = function(request, response)
{
    if(request.user.is_varified == false)
    {
        request.flash('error','Verify Email First');
        return response.redirect('/verification-email');
    }
    return response.render('change-password',{
        title:'Change-Password | Authentication',
    });
}

//updating password
module.exports.updatePassword = async function(request,response)
{
    if(request.body.new_password != request.body.confirm_password)
    {
        request.flash('Password Does not Matched');
        return response.redirect('back');
    }
    let user = await User.findByIdAndUpdate({_id:request.user.id});
    if(!user)
    {
        return response.redirect('authenticate/sign-in');
    }
    // matching old password
    //if user created using google then old password is not available to checking that condition
    if(request.user.is_password_available)
    {
        let result = await bcrypt.compare(request.body.old_password,user.password);
        if(result == true)
        {
            let passwordHash = await bcrypt.hash(request.body.new_password,7);
            user.password = passwordHash;
            user.save();
            request.flash('success','Password Changed Successfully');
        }
        else
        {
            request.flash('error','Old password are incorrect');
        }
    }
    else
    {
        //updating password when user is created using google
        let passwordHash = await bcrypt.hash(request.body.new_password,7);
        user.password = passwordHash;
        user.is_password_available = true;
        user.save();
        request.flash('success','Password Changed Successfully');
    }
    
    return response.redirect('back');
}
