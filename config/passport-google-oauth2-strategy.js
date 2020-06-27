const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

passport.use(new googleStrategy({
        clientID:'725473833505-44c0ol63u20j0rhv8o70kht5vi8m1htk.apps.googleusercontent.com',
        clientSecret:'bhBcJUiPPOmdUrTVLwTM9u1y',
        callbackURL:'http://localhost:8000/users/auth/google/callback',
    },
    function(accessToken, refreshToken, profile, done)
    {
        User.findOne({email:profile.emails[0].value}).exec(function(err,user)
        {
            if(err)
            {
                console.log('Error in google strategy-passport');
                return;
            }
            console.log(profile);
            if(user)
            {
                //if user found then set these user to request.user
                return done(null,user);
            }
            else
            {
                //if user not found create it and then sign in it
                User.create(
                    {
                        name:profile.displayName,
                        email:profile.emails[0].value,
                        password:crypto.randomBytes(20).toString('hex'),
                        is_varified:true,
                    },
                    function(err,user)
                    {
                        if(err)
                        {
                            console.log('Error in google strategy');r
                            return;
                        }
                        if(user)
                        {
                            return done(null,user);
                        }
                        else
                        {
                            return done(null,false);
                        }
                    }
                );
            }
        });
    }
));

module.exports = passport;