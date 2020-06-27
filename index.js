const express = require('express');
const port = 8000;
const app = express();
const expressLayouts = require('express-ejs-layouts');
const sassMiddleware = require('node-sass-middleware');
//connecting to database
const db = require('./config/mongoose');
//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
//mongo store for storing session
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const flashMiddleware = require('./config/flash-middleware');

//using sass or scss for styling 
app.use(sassMiddleware({
    src:'./assets/scss',
    dest:'./assets/css',
    debug:true,
    outputStyle:'compressed',
    prefix:'/css',
}));


app.use(express.urlencoded());

//setting up view engine to ejs
app.set('view engine', 'ejs');
app.set('views', './views');

//using express ejs layout
app.use(expressLayouts);
//extracting styles and sheets at top in head tag
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


//mongo store is used to store session cookie in DB
app.use(session(
    {
        name:'authentication-nodeJS',
        //todo change the secret before deployment in production
        secret:'kushwah-dheeraj',
        saveUninitialized:false,
        resave:false,
        cookie:
        {
            maxAge:(1000*60*100),  //number of milinutes in miliseconds
        },
        store: new MongoStore(
            {
                mongooseConnection:db,
                autoRemove:'disabled',
            },
            function(err)
            {
                if(err)
                {
                    console.log('Error in storing session');
                }
                console.log('Mongo Store Connected');
            }),
    }
));

app.use(passport.initialize());
app.use(passport.session());

//setting flash messages
app.use(flash());
app.use(flashMiddleware.setFlash);
app.use(passport.setAuthenticatedUser);
//using router
app.use('/',require('./routes/index.js'));

//using static files
app.use(express.static('./assets'));


app.listen(port,function(err)
{
    if(err)
    {
        console.log('Error in running server');
        return;
    }
    console.log('Server is running and up at port ',port);
    return;
});