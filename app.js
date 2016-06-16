var config          = require('./routes/conf/conf.json');
var express         = require('express');
var app             = express();
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var helmet          = require('helmet');
var escapeHTML      = require('escape-html');
var errorHandler    = require('errorhandler');
var db              = require('mongoskin').db(config.database.mongodb_connect);
var escapeElastic   = require('elasticsearch-sanitize');
var search          = require('./routes/search');
//var createdb        = require('./routes/createdb');
//var updatedb        = require('./routes/updatedb');
var extractdbpedia  = require('./routes/extractdbpedia');
var basicAuth       = require('basic-auth-connect');
var elasticsearch   = require('elasticsearch');
var elasticsearchClient = new elasticsearch.Client({ host: config.database.elasticsearch_connect});

app.disable('x-powered-by');
// view cache
app.set('view cache', false); // désactivation du cache express
// uncomment after placing your favicon in /public
app.set('config', config); 
app.use(helmet());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));//false
app.use(cookieParser());
//permet de s'authentifier, personne ne doit pouvoir accèder au site
app.use(basicAuth('michel', 'michelbuffa'));
app.use(function(req,res,next){
    req.db = db;
    req.escapeHTML = escapeHTML;
    req.escapeElastic = escapeElastic;
    req.elasticsearchClient = elasticsearchClient;
    next();
});
app.use('/',express.static(path.join(__dirname, 'public')));
app.use('/search', search);

//Permet d'utiliser les fonctions de créations et updates de la base de données
//app.use('/createdb', createdb);
//app.use('/updatedb', updatedb);
app.use('/extractdbpedia', extractdbpedia);

// catch 404 and forward to error handler
//Return la page-404.html via <app-router> dans index.html 
app.get('*', function(req, res){
    //On renvoie le chemin tapé par l'utilisateur, ce chemin ne correspondra à rien pour <app-router> ce qui renverra la page 404
     res.status(404).redirect('/#'+req.path);
});
// error handlers
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//    
//  next(err);
//});
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(errorHandler());
}
//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error test', {
//    message: err.message,
//    error: {}
//  });
//});


module.exports = app;
