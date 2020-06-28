module.exports.home = function(request,response)
{
    //if user has not verified then sending user to verify email page
    if(request.user && request.user.is_varified == false)
    {
        request.flash('error','Verify Email First');
        return response.redirect('/verification-email');
    }
    return response.render('home',{
        title:'Home | Basic Project'
    });
}
