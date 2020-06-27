const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports.addUser = async function(request,response)
{
    try
    {
        let requestEmail = request.body.email.toLowerCase();
        if(request.body.password != request.body.confirm_password)
        {
            return response.redirect('back');
        }
        let user = await User.findOne({email:requestEmail});
        if(!user)
        {
            let salt = 7;
            //encrypting password
            let passwordHash = await bcrypt.hash(request.body.password,salt);
            user =await  User.create(
                {
                    email:requestEmail,
                    password:passwordHash,
                    name:request.body.name,
                    is_varified:false,
                }
            );

            return response.redirect('/authenticate/sign-in');
        }
        else
        {
            console.log("User exist");
            return response.redirect('/authenticate/sign-in');
        }
    }
    catch(err)
    {
        console.log('Error in adding User',err);
        return;
    }
}

module.exports.profile = async function(request,response)
{
    let user = await User.findById(request.user.id);
    return response.render('profile',
    {
        title:'Profile | Authentication',
        user:user,
    })
}

module.exports.changePassword = function(request, response)
{
    return response.render('change-password',{
        title:'Change-Password | Authentication',
    });
}

module.exports.updatePassword = async function(request,response)
{
    if(request.body.new_password != request.body.confirm_password)
    {
        return response.redirect('back');
    }
    let user = await User.findById(request.user.id);
    if(!user)
    {
        return response.redirect('authenticate/sign-in');
    }
    // matching old password
    let result = await bcrypt.compare(request.body.old_password,user.password);
    if(result == true)
    {
        let passwordHash = await bcrypt.hash(request.body.new_password,7);
        await user.updateOne({password:passwordHash});
        console.log('password changed');
    }
    else
    {
        console.log('Password Does not matched');
    }
    return response.redirect('back');
}
