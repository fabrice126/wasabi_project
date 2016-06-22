var express         = require('express');
var router          = express.Router();
var request         = require('request');
var lyricsWikia     = require('./handler/lyricsWikia.js');
var config         = require('./conf/conf.json');
var elasticSearchHandler = require('./handler/elasticSearchHandler.js');


//createdb, permet de créer entierement la base de données
router.get('/',function(req, res){
    console.log("dedans /createdb");
    //Pour chaque lettre  sur wikia et chaque catégorie on récupére pour commencer les albums de 5 artistes ainsi que tous ses albums et musiques
    //pour chaque categorie ex: http://lyrics.wikia.com/wiki/Category:Artists_A on récupére les artistes ici les artistes commencant par la lettre A
    lyricsWikia.fetchData(lyricsWikia.urlArtists,lyricsWikia.alphabet[lyricsWikia.idxAlphabet],lyricsWikia.paramNextPage,lyricsWikia.selectorArtists,lyricsWikia.attrArtists,lyricsWikia.removeStrHrefArtists);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ status: "OK" }));
    res.end();
});

//Permet d'ajouter la discographie d'un artiste manquant dans notre base de données en allant la chercher sur lyrics wikia
router.get('/add/:urlArtist',function(req, res){
    var newLyricsWikia = lyricsWikia;
    var urlApiWikiaArtist = newLyricsWikia.urlApiWikia + req.params.urlArtist
    console.log("dedans /createdb/"+ req.params.urlArtist);
    var objArtist = {
            name:"",
            urlWikipedia:"",
            urlOfficialWebsite : "",
            urlFacebook:"",
            urlMySpace:"",
            urlTwitter:"",
            urlWikia: req.params.urlArtist, 
            activeYears:"",
            members:[],
            formerMembers:[],
            locationInfo:[],
            genres:[],
            labels:[],
            albums:[]
        };
    newLyricsWikia.idxAlphabet = newLyricsWikia.alphabet.length;
    newLyricsWikia.getOneArtist(urlApiWikiaArtist, objArtist,newLyricsWikia.selectorName, newLyricsWikia.selectorAlbums, newLyricsWikia.attrAlbums).then(function(objArtist) {
        //objArtist.tObjArtist => tableau d'objet représentant les artists: [{ name: 'A Dying God', urlWikia: 'A_Dying_God', albums: [] },{objet2}, etc]
        console.log("objArtist.tObjArtist.length  ==="+objArtist.tObjArtist.length );
        newLyricsWikia.getArtistDiscography(objArtist,"","",0);
        console.log("fin de GET createdb");
    })
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ status: "OK" }));
    res.end();
});


router.get('/createdbelasticsearchsong', function(req, res){
    var urlElasticSearch = config.database.elasticsearch_url;
    var typeName = config.database.index_type_song;
    var indexName = config.database.index_song;
    var collection = config.database.collection_song; //dans quelle collection nous voulons récupérer des données
    var projectObj = {"titre":1,"name":1,"albumTitre":1};//ce que nous voulons récupérer dans la base de données mongodb
    var urlIndex = urlElasticSearch+indexName;
    var mappingObj= {};
    mappingObj[typeName] = {"properties": { "titre": {"type": "string", "analyzer": "folding"},
                                            "name": {"type": "string", "analyzer": "folding"},
                                            "albumTitre": {"type": "string", "analyzer": "folding"}}};
    // var urlMapping = urlElasticSearch+indexName+"/"+typeName+"/_mapping";
    // var indexMappingObj = {};
    // indexMappingObj[typeName] = {"properties": {"name": {"type": "completion","payloads": true},"titre": {"type": "completion","payloads": true},"albumTitre": {"type": "completion","payloads": true}}};
    //Suppression de l'index
    elasticSearchHandler.deleteElasticSearchIndex(urlIndex).then(function(resolve){
        console.log("Index "+typeName+" Supprimée");
        //Création de l'index
        elasticSearchHandler.createElasticSearchIndex(urlIndex,mappingObj);
    }).then(function(resolve){
        console.log("Index "+typeName+" Crée");
        //création du mapping
    //     elasticSearchHandler.createMappingElasticSearchIndex(urlMapping,indexMappingObj);
    // }).then(function(resolve){
    //     console.log("Mapping "+typeName+" Crée");
        elasticSearchHandler.insertBulkData(req,collection,projectObj,indexName,typeName);
    })
    res.send("OK");
});
router.get('/createdbelasticsearchartist', function(req, res){
    var urlElasticSearch = config.database.elasticsearch_url;
    var typeName = config.database.index_type_artist;
    var indexName = config.database.index_artist;
    var collection = config.database.collection_artist; //dans quelle collection nous voulons récupérer des données
    var projectObj = {"name":1};//ce que nous voulons récupérer dans la base de données mongodb
    var urlIndex = urlElasticSearch+indexName;
    var mappingObj= {};
    mappingObj[typeName] = {"properties": {"name": { "type": "string", "analyzer": "folding" }}};
    // var urlMapping = urlElasticSearch+indexName+"/_mapping/"+typeName;
    // console.log(urlMapping);
    // var indexMappingObj = {};
    // indexMappingObj[typeName] = {"properties": {"name": {"type": "completion","payloads": true}}};
    //Suppression de l'index
    elasticSearchHandler.deleteElasticSearchIndex(urlIndex).then(function(resolve){
        console.log("Index "+typeName+" Supprimée");
        //Création de l'index
        elasticSearchHandler.createElasticSearchIndex(urlIndex,mappingObj);
    }).then(function(resolve){
        console.log("Index "+typeName+" Crée");
        //création du mapping
    //     elasticSearchHandler.createMappingElasticSearchIndex(urlMapping,indexMappingObj);
    // }).then(function(resolve){
    //     console.log("Mapping "+typeName+" Crée");
        elasticSearchHandler.insertBulkData(req,collection,projectObj,indexName,typeName);
    })
    res.send("OK");
});
router.get('*', function(req, res){
    //On renvoie index.html qui ira match l'url via <app-router> de index.html ce qui renverra la page 404 si la page n'existe pas
    res.sendFile(path.join(__dirname ,'public',  'index.html'));
});

module.exports = router;