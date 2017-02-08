import express from 'express';
import request from 'request';
import lyricsWikia from './handler/lyricsWikia.js';
import utilHandler from './handler/utilHandler.js';
import config from './conf/conf.json';
import elasticSearchHandler from './handler/elasticSearchHandler.js';
import fs from 'fs';
import mkdirp from 'mkdirp';
import Artist from './model/Artist';
import {ObjectId} from 'mongoskin';

const router          = express.Router();
const COLLECTIONARTIST  = config.database.collection_artist;
const COLLECTIONALBUM   = config.database.collection_album;
const COLLECTIONSONG    = config.database.collection_song;

//createdb, permet de créer entierement la base de données
router.get('/',function(req, res){
    console.log("dedans /createdb");
    //Pour chaque lettre  sur wikia et chaque catégorie on récupére pour commencer les albums de 5 artistes ainsi que tous ses albums et musiques
    //pour chaque categorie ex: http://lyrics.wikia.com/wiki/Category:Artists_A on récupére les artistes ici les artistes commencant par la lettre A
    lyricsWikia.fetchData(lyricsWikia.urlArtists,lyricsWikia.alphabet[lyricsWikia.idxAlphabet],lyricsWikia.paramNextPage);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ status: "OK" }));
    res.end();
});

//Permet d'ajouter la discographie d'un artiste manquant dans notre base de données en allant la chercher sur lyrics wikia
//exemple :urlArtist : createdb/add/3_Doors_Down pour la page http://lyrics.wikia.com/wiki/3_Doors_Down
router.get('/add/:urlArtist',function(req, res){
    console.log("dedans /createdb/"+ req.params.urlArtist);
    var urlApiWikiaArtist = lyricsWikia.urlApiWikia + req.params.urlArtist;
    //Création de l'objet artist, il faudra modifier cette objet si de nouvelles propriétés doivent être ajoutées
    var objArtist = new Artist();
    objArtist.urlWikia = req.params.urlArtist;
    lyricsWikia.idxAlphabet = lyricsWikia.alphabet.length;
    lyricsWikia.getOneArtist(urlApiWikiaArtist, objArtist).then(function(objArtist) {
        //objArtist.tObjArtist => tableau d'objet représentant les artists: [{ name: 'A Dying God', urlWikia: 'A_Dying_God', albums: [] }]
        console.log("objArtist.tObjArtist.length  ==="+objArtist.tObjArtist.length ); // doit être == 1
        lyricsWikia.getArtistDiscography(objArtist,"","",0);
        console.log("fin de GET createdb");
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ status: "OK" }));
    res.end();
});


router.get('/createdbelasticsearchsong', function(req, res){
    var urlElasticSearch = config.database.elasticsearch_url;
    var typeName = config.database.index_type_song;
    var indexName = config.database.index_song;
    var projectObj = {"titre":1,"name":1,"albumTitre":1};//ce que nous voulons récupérer dans la base de données mongodb
    var urlIndex = urlElasticSearch+indexName;
    var mappingObj= {};
    mappingObj[typeName] = {"properties": { "titre": {"type": "string", "analyzer": "folding"},
                                            "name": {"type": "string", "analyzer": "folding"},
                                            "albumTitre": {"type": "string", "analyzer": "folding"}}};
    //Suppression de l'index
    elasticSearchHandler.deleteElasticSearchIndex(urlIndex).then(function(resolve){
        console.log("Index "+typeName+" Supprimée");
        //Création de l'index
        elasticSearchHandler.createElasticSearchIndex(urlIndex,mappingObj);
    }).then(function(resolve){
        console.log("Index "+typeName+" Crée");
        elasticSearchHandler.insertBulkData(req,COLLECTIONSONG,projectObj,indexName,typeName);
    });
    res.send("OK");
});
router.get('/createdbelasticsearchartist', function(req, res){
    var urlElasticSearch = config.database.elasticsearch_url;
    var typeName = config.database.index_type_artist;
    var indexName = config.database.index_artist;
    var projectObj = {"name":1};//ce que nous voulons récupérer dans la base de données mongodb
    var urlIndex = urlElasticSearch+indexName;
    var mappingObj= {};
    mappingObj[typeName] = {"properties": {"name": { "type": "string", "analyzer": "folding" }}};
    //Suppression de l'index
    elasticSearchHandler.deleteElasticSearchIndex(urlIndex).then(function(resolve){
        console.log("Index "+typeName+" Supprimée");
        //Création de l'index
        elasticSearchHandler.createElasticSearchIndex(urlIndex,mappingObj);
    }).then(function(resolve){
        console.log("Index "+typeName+" Crée");
        elasticSearchHandler.insertBulkData(req,COLLECTIONARTIST,projectObj,indexName,typeName);
    });
    res.send("OK");
});
//Permet d'ajouter l'artiste dont l'id est passé en parametre
router.get('/add/elasticsearch/artist/:_id', function(req, res){
    var db = req.db, id = req.params._id, index_artist = config.database.index_artist, type_artist = config.database.index_type_artist;
    db.collection(COLLECTIONARTIST).findOne({_id:ObjectId(id)},{"name":1}, function(err,artist) {
        if(artist == null) {return res.status(404).send([{error:config.http.error.global_404}]); }
        delete artist._id; // impossible de faire l'insertion si un _id est présent dans le document à insérer
        elasticSearchHandler.addDocumentToElasticSearch(req, index_artist, type_artist, artist, id);

    });
    res.send("OK");
});
//Permet d'ajouter la musique dont l'id est passé en parametre
router.get('/add/elasticsearch/song/:_id', function(req, res){
    var db = req.db, id = req.params._id, index_song = config.database.index_song, type_song = config.database.index_type_song;
    db.collection(COLLECTIONSONG).findOne({_id:ObjectId(id)},{"name":1,"albumTitre":1,"titre":1}, function(err,song) {
        if(song == null) {return res.status(404).send([{error:config.http.error.global_404}]); }
        delete song._id; // impossible de faire l'insertion si un _id est présent dans le document à insérer
        elasticSearchHandler.addDocumentToElasticSearch(req, index_song, type_song, song, id);
    });
    res.send("OK");
});
// A FINIR Cette fonction créee l'arborescence de dossier représentant la base de données
router.get('/createdirectories',function(req, res){
    var db = req.db, skip = 0, limit = 10000;
    this.console.log("dedans /createdb/createdirectories");
    (function nextSkipStep(skip){
        db.collection(COLLECTIONARTIST).find({}).skip(skip).limit(limit).toArray(function(err,tObj){
            var encoded = "";
            for(var i=0, l = tObj.length ; i < l; i++){
                //CON, COM1 ou LPT1 /^CON$/i || /^COM1$/i ||/^LPT1$/i ce sont des noms de fichier réservé sous windows on les remplacera par C_O_N   C_O_M_1   L_P_T_1
                // if(tObj[i].name.match(/^CON$/i) || tObj[i].name.match(/^COM1$/i) || tObj[i].name.match(/^LPT1$/i)){
                //     tObj[i].name = tObj[i].name+'_';
                // }
                // encoded = utilHandler.encodePathWindows(tObj[i].name);
                // if(encoded.length > 224){
                //     console.log("Taille encoded: "+encoded.length+" Original Taille: "+tObj[i].name.length);
                // }
                fs.mkdir("mongo/wasabi_db_file/"+tObj._id,(err)=>{
                    if(err) console.log(err);
                });
                if(i==limit-1){
                    skip += limit;
                    console.log("nextSkipStep = "+skip);
                    nextSkipStep(skip);
                }
            }
        });
    })(skip);

    //On cherche dans le dossier contenant les musiques multitracks
    res.send("OK");
});

router.get('*', function(req, res){
    //On renvoie index.html qui ira match l'url via <app-router> de index.html ce qui renverra la page 404 si la page n'existe pas
    res.sendFile(path.join(__dirname ,'public',  'index.html'));
});

export default router;