//middleware to set flash message form request into response
module.exports.setFlash = function(request, response, next)
{
    response.locals.flash = {
        success: request.flash('success'),
        error:request.flash('error'),
    };
    next();
}