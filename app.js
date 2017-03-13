import config from './routes/conf/conf.json';
import login from './routes/conf/login.json';
import express from 'express';
import {
    db as dbMongo
} from 'mongoskin';
import querystring from 'querystring';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import session from 'express-session';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import errorHandler from 'errorhandler';
import basicAuth from 'basic-auth-connect';
import elasticsearch from 'elasticsearch';
import search from './routes/search';
import api_v1 from './routes/api/v1/api_v1';
import MT5 from './routes/MT5';
import updatedb from './routes/updatedb';
import mergedb from './routes/mergedb';
import createdb from './routes/createdb';
import extractdbpedia from './routes/extractdbpedia';
const app = express();
const db = dbMongo(config.database.mongodb_connect);
const elasticsearchClient = new elasticsearch.Client({
    host: config.database.elasticsearch_connect
});
// view cache
app.set('view cache', true); // désactivation du cache express
app.set('config', config);
// app.set('env', 'development');
app.set('env', 'production'); //Utiliser ce mode avant d'envoyer sur le serveur
app.use(helmet());
const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    cookie: {
        secure: true,
        expires: expiryDate
    },
    saveUninitialized: true
}));
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
})); //false
//<start> MT5
String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // For Microsoft browsers
    var url = req.originalUrl;
    if (url.endsWith("vtt")) {
        res.header("Content-Type", "text/vtt");
    }
    next();
});
//<end> MT5
app.use((req, res, next) => {
    req.db = db;
    req.COLLECTIONARTIST = config.database.collection_artist;
    req.COLLECTIONALBUM = config.database.collection_album;
    req.COLLECTIONSONG = config.database.collection_song;
    req.elasticsearchClient = elasticsearchClient;
    next();
});
app.use('/api/v1', api_v1);
//permet de s'authentifier, personne ne doit pouvoir accèder au site
app.use(basicAuth(login.login, login.password));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/apidoc', express.static(path.join(__dirname, 'apidoc')));
app.use('/search', search);
app.use('/MT5', MT5);
if (app.get('env') === 'development') {
    console.log("Projet executé en mode: " + app.get('env'));
    app.use('/updatedb', updatedb);
    app.use('/mergedb', mergedb);
    app.use('/createdb', createdb);
    app.use('/extractdbpedia', extractdbpedia);
}
// catch 404 and forward to error handler
//Return la page-404.html via <app-router> dans index.html 
app.get('*', (req, res) => {
    //On renvoie le chemin tapé par l'utilisateur, ce chemin ne correspondra à rien pour <app-router> ce qui renverra la page 404
    res.status(404).redirect('/#' + req.path);
});
// error handlers
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(errorHandler());
}
//// production error handler
//// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error test', {
        message: err.message,
        error: {}
    });
});


module.exports = app;