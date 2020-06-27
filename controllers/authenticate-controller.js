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
    return response.redirect('/');
};

module.exports.signOut = function(request,response)
{
    request.logout();
    return response.redirect('/');
}