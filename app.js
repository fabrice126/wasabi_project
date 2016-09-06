var config          = require('./routes/conf/conf.json');
var login           = require('./routes/conf/login.json');
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
var basicAuth       = require('basic-auth-connect');
var elasticsearch   = require('elasticsearch');
var sanitizeHtml    = require('sanitize-html');
var db              = require('mongoskin').db(config.database.mongodb_connect);
var elasticsearchClient = new elasticsearch.Client({ host: config.database.elasticsearch_connect});
var search          = require('./routes/search');
var MT5             = require('./routes/MT5');
var updatedb        = require('./routes/updatedb');
// var mergedb         = require('./routes/mergedb');
var createdb        = require('./routes/createdb');
// var extractdbpedia  = require('./routes/extractdbpedia');


app.disable('x-powered-by');
// view cache
app.set('view cache', true); // désactivation du cache express
app.set('config', config);
app.use(helmet());
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));//false
app.use(cookieParser());
//permet de s'authentifier, personne ne doit pouvoir accèder au site
app.use(basicAuth(login.login, login.password));

//<start> MT5
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // For Microsoft browsers
    var url = req.originalUrl;
    if(url.endsWith("vtt")) {
        res.header("Content-Type", "text/vtt");
    }
    next();
});
//<end> MT5

app.use(function(req,res,next){
    req.db = db;
    req.sanitize = sanitizeHtml;
    req.escapeHTML = escapeHTML;
    req.elasticsearchClient = elasticsearchClient;
    next();
});
app.use('/',express.static(path.join(__dirname, 'public')));
app.use('/search', search);
app.use('/MT5', MT5);
app.use('/updatedb', updatedb);
// app.use('/mergedb',mergedb);
app.use('/createdb', createdb);
// app.use('/extractdbpedia', extractdbpedia);

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
