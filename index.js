const express = require('express');
const port = 8000;
const app = express();
const expressLayouts = require('express-ejs-layouts');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');

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


//using router
app.use('/',require('./routes/index.js'));

//using static files
app.use(express.static('./assets'));

//connecting to database
const db = require('./config/mongoose');

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