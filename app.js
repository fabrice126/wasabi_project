import config from './routes/conf/conf';
import login from './routes/conf/login.json';
//Import express
import express from 'express';
import RateLimit from 'express-rate-limit';
import session from 'express-session';
import helmet from 'helmet';
//Import DB
import elasticsearch from 'elasticsearch';
import mongoose from 'mongoose';
import {
    db as dbMongo
} from 'mongoskin';
//Import server
import querystring from 'querystring';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';
//Import JWT
import basicAuth from 'basic-auth-connect';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import bcrypt from 'bcrypt-nodejs';
//Import routes
import confPassport from './routes/conf/passport';
import search from './routes/search';
import api_v1 from './routes/api/v1/api_v1';
import MT5 from './routes/MT5';
import updatedb from './routes/updatedb';
import mergedb from './routes/mergedb';
import createdb from './routes/createdb';
import extractdbpedia from './routes/extractdbpedia';
import jwt_api from './routes/jwt'; //a supprimer après les tests JWT
const app = express();
/**
 * -------------------------------------------------------------------------------------------------------
 * ----------------------------------OPTION DE L'ENVIRONNEMENT NODE JS------------------------------------
 * -------------------------------------------------------------------------------------------------------
 */
config.launch.env.dev_mode ? app.set('env', config.launch.env.dev) : app.set('env', config.launch.env.prod);
/**
 * -------------------------------------------------------------------------------------------------------
 * -----------------------CONNEXION A LA BASE DE DONNEES MONGODB ET ELASTICSEARCH-------------------------
 * -------------------------------------------------------------------------------------------------------
 */
const server = app.get('env') === config.launch.env.dev ? {
    server: {
        socketOptions: {
            socketTimeoutMS: 160000
        }
    }
} : {};
mongoose.Promise = global.Promise;
const dbMongoose = mongoose.connect(config.database.mongodb_connect);
const db = dbMongo(config.database.mongodb_connect, server);
const elasticsearchClient = new elasticsearch.Client({
    host: config.database.elasticsearch_connect
});

/**
 * -------------------------------------------------------------------------------------------------------
 * ----------------------------------INITIALISATION DE CERTAINS CHAMPS------------------------------------
 * -------------------------------------------------------------------------------------------------------
 */
// view cache
app.set('view cache', app.get('env') === config.launch.env.dev ? true : false); // désactivation du cache express
app.set('config', config);
app.use(helmet());
// const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
// app.use(session({
//     secret: '2C44-4D44-WppQ38S',
//     resave: true,
//     cookie: {
//         secure: true,
//         expires: expiryDate
//     },
//     saveUninitialized: true
// }));
String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
//initialisation de passport permettant la connexion via JWT
confPassport(passport);
app.use(passport.initialize());
app.use((req, res, next) => {
    req.db = db;
    req.dbMongoose = dbMongoose;
    req.jwt = jwt;
    req.COLLECTIONARTIST = config.database.collection_artist;
    req.COLLECTIONALBUM = config.database.collection_album;
    req.COLLECTIONSONG = config.database.collection_song;
    req.elasticsearchClient = elasticsearchClient;
    //<start> pour MT5
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // For Microsoft browsers
    var url = req.originalUrl;
    if (url.endsWith("vtt")) {
        res.header("Content-Type", "text/vtt");
    }
    //</start> pour MT5
    next();
});

/**
 * -------------------------------------------------------------------------------------------------------
 * --------------------------------------DEFINITION DES ROUTES D'API--------------------------------------
 * -------------------------------------------------------------------------------------------------------
 */
app.use('/jwt', jwt_api);
app.use('/api/v1', new RateLimit(config.http.limit_request.api), api_v1);
//permet de s'authentifier, personne ne doit pouvoir accèder au site
app.use(basicAuth(login.login, login.password));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/apidoc', express.static(path.join(__dirname, 'apidoc')));
app.use('/search', search);
app.use('/MT5', MT5);
//Placer ici les routes utile uniquement pour le développement
if (app.get('env') === config.launch.env.dev) {
    console.error("/!\\-----------------------------------------------------------------------------------------------------------------/!\\");
    console.error("/!\\ Projet executé en mode: " + app.get('env') + " veuillez le mettre en mode production avant de push sur le git (dans app.js)/!\\");
    console.error("/!\\-----------------------------------------------------------------------------------------------------------------/!\\");
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
if (app.get('env') === config.launch.env.dev) {
    app.use(errorHandler());
}
// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error test', {
        message: err.message,
        error: {}
    });
});


module.exports = app;