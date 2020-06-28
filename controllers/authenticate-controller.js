//rendering sign in page
module.exports.signIn = function(request,response)
{
    if(request.isAuthenticated())
    {
        return response.redirect('/');
    }
    return response.render('sign-in',{
        title:'Sign In | Authentication'
    });
}

//rendering sign up page
module.exports.signUp = function(request,response)
{
    if(request.isAuthenticated())
    {
        return response.redirect('/');
    }
    return response.render('sign-up',{
        title:'Sign Up | Authentication',
    });
}

//creating session for user
module.exports.createSession = function(request,response)
{
    request.flash('success','Logged In Successfully');
    return response.redirect('/');
};

//signing out user
module.exports.signOut = function(request,response)
{
    request.flash('success','Logged Out Successfully');
    request.logout();
    return response.redirect('/');
}