const config          = require('./routes/conf/conf.json');
const login           = require('./routes/conf/login.json');
const express         = require('express');
const app             = express();
const querystring       = require('querystring');
const path              = require('path');
const favicon           = require('serve-favicon');
const logger            = require('morgan');
const cookieParser      = require('cookie-parser');
const bodyParser        = require('body-parser');
const helmet            = require('helmet');
const escapeHTML        = require('escape-html');
const errorHandler      = require('errorhandler');
const basicAuth         = require('basic-auth-connect');
const elasticsearch     = require('elasticsearch');
const sanitizeHtml      = require('sanitize-html');
const db                = require('mongoskin').db(config.database.mongodb_connect);
const elasticsearchClient = new elasticsearch.Client({ host: config.database.elasticsearch_connect});
const search            = require('./routes/search');
const MT5               = require('./routes/MT5');
const updatedb          = require('./routes/updatedb');
// const mergedb         = require('./routes/mergedb');
const createdb          = require('./routes/createdb');
const extractdbpedia    = require('./routes/extractdbpedia');
const COLLECTIONARTIST  = config.database.collection_artist;
const COLLECTIONALBUM   = config.database.collection_album;
const COLLECTIONSONG    = config.database.collection_song;

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
    req.COLLECTIONARTIST = COLLECTIONARTIST;
    req.COLLECTIONALBUM = COLLECTIONALBUM;
    req.COLLECTIONSONG = COLLECTIONSONG;
    req.elasticsearchClient = elasticsearchClient;
    next();
});
app.use('/',express.static(path.join(__dirname, 'public')));
app.use('/search', search);
app.use('/MT5', MT5);
app.use('/updatedb', updatedb);
// app.use('/mergedb',mergedb);
app.use('/createdb', createdb);
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
