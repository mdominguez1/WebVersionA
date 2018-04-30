// @authors Melchor Dominguez & Clinton Bryson
// @version 11/30/2016
// this file will display the web application on the localhost: 3012
// the applicaiton will catch all 404 and 500 handling
var express = require('express');

var makeP = require('./make_poem.js');

var app = express();

// set up handlebars view engine
var handlebars = require('express3-handlebars')
        .create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// set the port to 3012
app.set('port', process.env.PORT || 3012);

//Allows the program to parse the URL-encoded body of the HTTP request 
//message via the req.body variable
app.use(require('body-parser').urlencoded({extended: true}));

//import the credentials into the application
var credentials = require('./credentials.js');

//link the cookie-parser middleware into your app and use the cookieSecret
//value that is in the credentials.js file
app.use(require('cookie-parser')(credentials.cookieSecret));

//link the express-session middleware
//this maintains state across an entire session by storing this state in 
//memory on the serve.
app.use(require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
}));

//link the csurf middleware into the app.
app.use(require('csurf')());
app.use(function(req, res, next){
    res.locals._csrfToken = req.csrfToken();
    next();
});

//app.use(require('body-parser').urlencoded({extended: true}));

// uses the home page in the views/home.handlebars file
app.get('/', function(req, res){
    res.render('home');
});

app.post('/', function(req, res){
    console.log('Form (from querystring): ' + req.query.form);
    console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    req.session.file = req.body.file;
    console.log('Input file (from visible form field): ' + req.body.file);
    req.session.stanzas = req.body.stanzas;
    console.log('# of stanzas (from visible form field): ' + req.body.stanzas);
    req.session.lines = req.body.lines;
    console.log('# of lines (from visible form field): ' + req.body.lines);
    req.session.words = req.body.words;
    console.log('# of words (from visible form field): ' + req.body.words);
    res.redirect(303, '/myPoem');
});

app.get('/myPoem', function(req, res){
    value = makeP.main(req.session.file, req.session.stanzas,
                            req.session.lines, req.session.words);
    res.render('myPoem', {poem: value});
});

// uses the about page in the views/about.handlebars file
app.get('/about', function(req, res){
    res.render('about');
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
    res.status(404);
    res.render('404');
});

// 500 error handler (middleware)
app.use(function(req, res, next){
   console.error(err.stack);
   res.status(500);
   res.render('500'); 
});

// will display the port where the page is active and how to 
// terminate the program
app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});

/*
//Allows the program to parse the URL-encoded body of the HTTP request 
//message via the req.body variable
app.use(require('body-parser').urlencoded({extended: true}));

//import the credentials into the application
var credentials = require('./credentials.js');

//link the cookie-parser middleware into your app and use the cookieSecret
//value that is in the credentials.js file
app.use(require('cookie-parser')(credentials.cookieSecret));

//link the express-session middleware
//this maintains state across an entire session by storing this state in 
//memory on the serve.
app.use(require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cokieSecret,
}));

//link the csurf middleware into the app.
app.use(require('csurf')());
app.use(function(req, res, next){
    res.locals._csrfToken = req.csrfToken();
    next();
});

app.use(require('body-parser').urlencoded({extended: true}));
*/
