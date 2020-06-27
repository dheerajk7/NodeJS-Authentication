const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({
    usernameField:'email',
    },
    function(email,password,done)
    {
        User.findOne({email:email.toLowerCase()},function(err,user)
        {
            if(err)
            {
                console.log('Error in finding user');
                return done(err);
            }

            if(!user)
            {
                console.log('Invalid user name or password');
                return done(null,false);
            }
            bcrypt.compare(password,user.password,function(err,result)
            {
                if(result != true)
                {
                    console.log('Invalid user name or password');
                    return done(null,false);
                }
                return done(null,user);
            });
        });
    }

));

passport.checkAuthentication = function(request,response,next)
{
    if(request.isAuthenticated())
    {
        //if user is authenticated pass on the request to next function(controllers action)
        return next();
    }
    //if user is not signed in
    return response.redirect('/authenticate/sign-in');
}

passport.setAuthenticatedUser = function(request,response,next)
{
    if(request.isAuthenticated())
    {
        //request.user contains the current signed in user from the session cookie and we are just sending this to the locals for views
        response.locals.user = request.user;
    }
    next();
}

//serializing the user to decide which key to keep in cookie
passport.serializeUser(function(user,done){
    done(null,user.id);
});

//deserializing the use from the key in cookie
passport.deserializeUser(function(id,done)
{
    User.findById(id,function(err,user)
    {
        if(err)
        {
            console.log('Error in finding User');
            return done(err);
        }
        return done(null,user);
    });
});


module.exports = passport;