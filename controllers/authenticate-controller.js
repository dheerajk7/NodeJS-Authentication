module.exports.signIn = function(request,response)
{
    return response.render('sign-in',{
        title:'Sign In | Authentication'
    });
}

module.exports.signUp = function(request,response)
{
    return response.render('sign-up',{
        title:'Sign Up | Authentication',
    });
}

module.exports.createSession = function(request,response)
{
    request.flash('success','Logged In Successfully');
    return response.redirect('/');
};

module.exports.signOut = function(request,response)
{
    request.flash('success','Logged Out Successfully');
    request.logout();
    return response.redirect('/');
}