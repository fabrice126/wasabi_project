import express from 'express';
import request from 'request';
import lyricsWikia from './handler/lyricsWikia.js';
import utilHandler from './handler/utilHandler.js';
import config from './conf/conf';
import elasticSearchHandler from './handler/elasticSearchHandler.js';
import fs from 'fs';
import mkdirp from 'mkdirp';
import Artist from '../model/Artist';
import {
    ObjectId
} from 'mongoskin';

const router = express.Router();
const COLLECTIONARTIST = config.database.collection_artist;
const COLLECTIONALBUM = config.database.collection_album;
const COLLECTIONSONG = config.database.collection_song;

//createdb, permet de créer entierement la base de données
router.get('/', function (req, res) {
    console.log("dedans /createdb");
    //Pour chaque lettre  sur wikia et chaque catégorie on récupére pour commencer les albums de 5 artistes ainsi que tous ses albums et musiques
    //pour chaque categorie ex: http://lyrics.wikia.com/wiki/Category:Artists_A on récupére les artistes ici les artistes commencant par la lettre A
    lyricsWikia.fetchData(lyricsWikia.urlArtists, lyricsWikia.alphabet[lyricsWikia.idxAlphabet], lyricsWikia.paramNextPage);
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.write(JSON.stringify({
        status: "OK"
    }));
    res.end();
});

//Permet d'ajouter la discographie d'un artiste manquant dans notre base de données en allant la chercher sur lyrics wikia
//exemple :urlArtist : createdb/add/3_Doors_Down pour la page http://lyrics.wikia.com/wiki/3_Doors_Down
//!\POUR UTILISER CETTE FONCTION VOUS DEVEZ PERMETTRE L'ACCES AU API : COMMENTER DANS APP.JS : app.use(basicAuth(login.login, login.password));
router.get('/add/:urlArtist', function (req, res) {
    console.log("dedans /createdb/" + req.params.urlArtist);
    var urlApiWikiaArtist = lyricsWikia.urlApiWikia + req.params.urlArtist;
    //Création de l'objet artist, il faudra modifier cette objet si de nouvelles propriétés doivent être ajoutées
    var objArtist = new Artist();
    objArtist.urlWikia = req.params.urlArtist;
    lyricsWikia.idxAlphabet = lyricsWikia.alphabet.length;
    //!\POUR UTILISER CETTE FONCTION VOUS DEVEZ PERMETTRE L'ACCES AU API : COMMENTER DANS APP.JS : app.use(basicAuth(login.login, login.password));
    lyricsWikia.getOneArtist(urlApiWikiaArtist, objArtist).then(function (objArtist) {
        console.log("objArtist.tObjArtist.length  ===" + objArtist.tObjArtist.length); // doit être == 1
        lyricsWikia.getArtistDiscography(objArtist, "", "", 0);
        console.log("fin de GET createdb");
    });
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.write(JSON.stringify({
        status: "OK"
    }));
    res.end();
});


router.get('/createdbelasticsearchsong', function (req, res) {
    var urlElasticSearch = config.database.elasticsearch_url;
    var typeName = config.database.index_type_song;
    var indexName = config.database.index_song;
    var projectObj = {
        "title": 1,
        "name": 1,
        "albumTitle": 1,
        "rank": 1,
        "id_album": 1
    }; //ce que nous voulons récupérer dans la base de données mongodb
    var urlIndex = urlElasticSearch + indexName;
    var mappingObj = {};
    mappingObj[typeName] = {
        "properties": {
            "title": {
                "type": "string",
                "analyzer": "folding"
            },
            "name": {
                "type": "string",
                "analyzer": "folding"
            },
            "albumTitle": {
                "type": "string",
                "analyzer": "folding"
            },
            "weight": {
                "type": "integer"
            }
        }
    };
    //Suppression de l'index
    elasticSearchHandler.deleteElasticSearchIndex(urlIndex).then(function (resolve) {
        console.log("Index " + typeName + " Supprimée");
        //Création de l'index
        elasticSearchHandler.createElasticSearchIndex(urlIndex, mappingObj);
    }).then(function (resolve) {
        console.log("Index " + typeName + " Crée");
        elasticSearchHandler.insertBulkData(req, COLLECTIONSONG, projectObj, indexName, typeName);
    });
    res.send("OK");
});
router.get('/createdbelasticsearchartist', function (req, res) {
    var urlElasticSearch = config.database.elasticsearch_url;
    var typeName = config.database.index_type_artist;
    var indexName = config.database.index_artist;
    var projectObj = {
        "name": 1,
        "deezerFans": 1,
        "picture.small": 1
    }; //ce que nous voulons récupérer dans la base de données mongodb
    var urlIndex = urlElasticSearch + indexName;
    var mappingObj = {};
    mappingObj[typeName] = {
        "properties": {
            "name": {
                "type": "string"
            },
            "nameSuggest": {
                "type": "completion",
                "analyzer": "folding",
                "preserve_position_increments": false,
                "preserve_separators": false
            }
        }
    };
    //Suppression de l'index
    elasticSearchHandler.deleteElasticSearchIndex(urlIndex).then(function (resolve) {
        console.log("Index " + typeName + " Supprimée");
        //Création de l'index
        elasticSearchHandler.createElasticSearchIndex(urlIndex, mappingObj);
    }).then(function (resolve) {
        console.log("Index " + typeName + " Crée");
        elasticSearchHandler.insertBulkData(req, COLLECTIONARTIST, projectObj, indexName, typeName);
    });
    res.send("OK");
});
//Permet d'ajouter l'artiste dont l'id est passé en parametre
router.get('/add/elasticsearch/artist/:_id', function (req, res) {
    var db = req.db,
        id = req.params._id,
        index_artist = config.database.index_artist,
        type_artist = config.database.index_type_artist;
    db.collection(COLLECTIONARTIST).findOne({
        _id: ObjectId(id)
    }, {
        "name": 1
    }, function (err, artist) {
        if (artist == null) {
            return res.status(404).send([{
                error: config.http.error.global_404
            }]);
        }
        delete artist._id; // impossible de faire l'insertion si un _id est présent dans le document à insérer
        elasticSearchHandler.addDocumentToElasticSearch(req, index_artist, type_artist, artist, id);

    });
    res.send("OK");
});
//Permet d'ajouter la musique dont l'id est passé en parametre
router.get('/add/elasticsearch/song/:_id', function (req, res) {
    var db = req.db,
        id = req.params._id,
        index_song = config.database.index_song,
        type_song = config.database.index_type_song;
    db.collection(COLLECTIONSONG).findOne({
        _id: ObjectId(id)
    }, {
        "name": 1,
        "albumTitle": 1,
        "title": 1
    }, function (err, song) {
        if (song == null) {
            return res.status(404).send([{
                error: config.http.error.global_404
            }]);
        }
        delete song._id; // impossible de faire l'insertion si un _id est présent dans le document à insérer
        elasticSearchHandler.addDocumentToElasticSearch(req, index_song, type_song, song, id);
    });
    res.send("OK");
});

router.get('*', function (req, res) {
    //On renvoie index.html qui ira match l'url via <app-router> de index.html ce qui renverra la page 404 si la page n'existe pas
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

export default router;