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
 * ----------------------------------ENVIRONMENT OPTION NODE JS------------------------------------
 * -------------------------------------------------------------------------------------------------------
 */

config.launch.env.dev_mode ? process.env.NODE_ENV = config.launch.env.dev : process.env.NODE_ENV = config.launch.env.prod;
/**
 * -------------------------------------------------------------------------------------------------------
 * -------------------------------CONNECTION TO MONGODB AND ELASTICSEARCH---------------------------------
 * -------------------------------------------------------------------------------------------------------
 */


const server = process.env.NODE_ENV === config.launch.env.dev ? config.database.mongodb_option : {};
// mongoose.Promise = global.Promise;
const dbMongoose = mongoose.connect(config.launch.env.dev_mode ? config.database.mongodb_connect_v2 : config.database.mongodb_connect, {
    useMongoClient: true
}, (err) => {
    if (err) console.error(err);
});
const db = dbMongo(config.database.mongodb_connect, server);
const elasticsearchClient = new elasticsearch.Client({
    host: config.database.elasticsearch_connect
});
/**
 * -------------------------------------------------------------------------------------------------------
 * ------------------------------------------INIT SOME FIELDS --------------------------------------------
 * -------------------------------------------------------------------------------------------------------
 */
// view cache
app.set('view cache', process.env.NODE_ENV === config.launch.env.dev ? true : false); // enable or disable cache
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
    //init variables inside req
    req.db = db;
    req.dbMongoose = dbMongoose;
    req.jwt = jwt;
    req.config = config;
    req.COLLECTIONARTIST = config.database.collection_artist;
    req.COLLECTIONALBUM = config.database.collection_album;
    req.COLLECTIONSONG = config.database.collection_song;
    req.elasticsearchClient = elasticsearchClient;
    //iinit the passport module allowing the JWT connection
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
 * ---------------------------------------------- API ROUTES----------------------------------------------
 * -------------------------------------------------------------------------------------------------------
 */
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/AmpSimFA', express.static(path.join(__dirname, 'public/AmpSimFA')));
app.use('/AmpSim3', express.static(path.join(__dirname, 'public/AmpSim3')));
app.use('/MT5', MT5);
app.use('/search', search);
app.use('/api/v1', new RateLimit(config.http.limit_request.api), api_v1);
app.use('/jwt', jwt_api);
//Allows the authentication, at the moment the documentation have to stay private
app.use(basicAuth(configLogin.login, configLogin.password));
app.use('/apidoc', express.static(path.join(__dirname, 'apidoc')));
app.use('/download', download);
//Put here the dev routes
if (config.http.limit_request.search.max < 30) console.error("/!\\-------------------------------PLEASE INCREASE THE NUMBER OF REQUEST/MIN------------------------------/!\\");
if (process.env.NODE_ENV === config.launch.env.dev) {
    process.setMaxListeners(0);
    console.error("/!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\\");
    console.error("/!\\ Project running in " + process.env.NODE_ENV + " mode. Please, turn on the prod mode before pushing your code to github (routes/conf/conf.js)/!\\");
    console.error("/!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\\");
    // app.use('/graphql', graphqlHTTP({
    //     schema: schema,
    //     rootValue: root,
    //     graphiql: true,
    // }));
    app.use('/updatedb', updatedb);
    app.use('/mergedb', mergedb);
    app.use('/createdb', createdb);
    app.use('/extractdbpedia', extractdbpedia);
    // development error handler
    // will print stacktrace
    app.use(errorHandler());
}
// catch 404 and forward to error handler
//Return page-404.html 
app.get('*', (req, res) => {
    //We return the path wrote by the user. this path will be not recognize by <app-router> which will display a 404 page
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