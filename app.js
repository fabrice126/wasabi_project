var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var search          = require('./routes/search');
//var createdb        = require('./routes/createdb');
//var updatedb        = require('./routes/updatedb');
var extractdbpedia  = require('./routes/extractdbpedia');
var basicAuth       = require('basic-auth-connect');
var app             = express();


// view cache
app.set('view cache', false); // désactivation du cache express
// uncomment after placing your favicon in /public
//app.set('view engine', 'html'); 
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//permet de s'authentifier, personne ne doit pouvoir accèder au site
app.use(basicAuth('michel', 'michelbuffa'));
app.use('/',express.static(path.join(__dirname, 'public')));
app.use('/search', search);

//Permet d'utiliser les fonctions de créations et updates de la base de données
//app.use('/createdb', createdb);
//app.use('/updatedb', updatedb);
app.use('/extractdbpedia', extractdbpedia);
// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//    
//  next(err);
//});

// error handlers

app.get('*', function(req, res){
    console.log(path.join(__dirname ,'public/my_components',  'page-404.html'));
    res.sendFile(path.join(__dirname ,'public/my_components',  'page-404.html'));
});



//// development error handler
//// will print stacktrace
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) {
//    res.status(err.status || 500 || 404);
//    res.render('error', {
//      message: "messages d'erreurs : \n\n"+err.message,
//      error: err
//    });
//  });
//}
//
//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: {}
//  });
//});


module.exports = app;
