import config from './routes/conf/conf';
import configLogin from './routes/conf/login.json';
//Import express
import express from 'express';
import RateLimit from 'express-rate-limit';
import session from 'express-session';
import helmet from 'helmet';
import compression from 'compression';
//Import DB
import elasticsearch from 'elasticsearch';
import mongoose from 'mongoose';
import graphqlHTTP from 'express-graphql';
import schema from './graphql';
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
import search from './routes/api_search/search';
import api_v1 from './routes/api/v1/api_v1';
import MT5 from './routes/api_MT5/MT5';
import updatedb from './routes/api_updatedb/updatedb';
import mergedb from './routes/api_mergedb/mergedb';
import createdb from './routes/api_createdb/createdb';
import extractdbpedia from './routes/api_extractdbpedia/extractdbpedia';
import jwt_api from './routes/api_jwt/jwt';
import download from './routes/api_download/download';
const app = express();
app.enable('trust proxy');
/**
 * -------------------------------------------------------------------------------------------------------
 * ----------------------------------OPTION DE L'ENVIRONNEMENT NODE JS------------------------------------
 * -------------------------------------------------------------------------------------------------------
 */

config.launch.env.dev_mode ? process.env.NODE_ENV = config.launch.env.dev : process.env.NODE_ENV = config.launch.env.prod;
/**
 * -------------------------------------------------------------------------------------------------------
 * -----------------------CONNEXION A LA BASE DE DONNEES MONGODB ET ELASTICSEARCH-------------------------
 * -------------------------------------------------------------------------------------------------------
 */


const server = process.env.NODE_ENV === config.launch.env.dev ? config.database.mongodb_option : {};
mongoose.Promise = global.Promise;
const dbMongoose = mongoose.connect(config.database.mongodb_connect_v2, server, (err) => {
    if (err) console.error(err);
});
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
app.set('view cache', process.env.NODE_ENV === config.launch.env.dev ? true : false); // désactivation du cache express
app.use(helmet());
app.use(compression());

String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use((req, res, next) => {
    //initialisation des variables de l'objet req
    req.db = db;
    req.dbMongoose = dbMongoose;
    req.jwt = jwt;
    req.config = config;
    req.COLLECTIONARTIST = config.database.collection_artist;
    req.COLLECTIONALBUM = config.database.collection_album;
    req.COLLECTIONSONG = config.database.collection_song;
    req.elasticsearchClient = elasticsearchClient;
    //initialisation de passport permettant la connexion via JWT
    passport.initialize();
    confPassport(passport);
    //<start> pour MT5
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
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
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/AmpSimFA', express.static(path.join(__dirname, 'public/AmpSimFA')));
app.use('/AmpSim3', express.static(path.join(__dirname, 'public/AmpSim3')));
app.use('/MT5', MT5);
app.use('/search', search);
app.use('/api/v1', new RateLimit(config.http.limit_request.api), api_v1);
app.use('/jwt', jwt_api);
//permet de s'authentifier, personne ne doit pouvoir accèder à la doc
app.use(basicAuth(configLogin.login, configLogin.password));
app.use('/apidoc', express.static(path.join(__dirname, 'apidoc')));
app.use('/download', download);
//Placer ici les routes utile uniquement pour le développement
if (process.env.NODE_ENV === config.launch.env.dev) {
    console.error("/!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\\");
    console.error("/!\\ Projet executé en mode: " + process.env.NODE_ENV + " veuillez le mettre en mode production avant de push sur le git (dans app.js)/!\\");
    if (config.http.limit_request.search.max < 30) console.error("/!\\-------------------------------LE QUOTA DE REQUETE PAR MINUTE N'EST PAS ASSEZ ELEVE------------------------------/!\\");
    console.error("/!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\\");
    app.use('/graphql', graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    }));
    app.use('/updatedb', updatedb);
    app.use('/mergedb', mergedb);
    app.use('/createdb', createdb);
    app.use('/extractdbpedia', extractdbpedia);
    // development error handler
    // will print stacktrace
    app.use(errorHandler());
}
// catch 404 and forward to error handler
//Return la page-404.html via <app-router> dans index.html 
app.get('*', (req, res) => {
    //On renvoie le chemin tapé par l'utilisateur, ce chemin ne correspondra à rien pour <app-router> ce qui renverra la page 404
    console.log(req.path);
    res.status(404).redirect('/#/page-404.html');
});
// error handlers
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});


module.exports = app;