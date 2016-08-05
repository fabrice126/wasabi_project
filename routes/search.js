var express         = require('express');
var router          = express.Router();
var request         = require('request');
var searchHandler   = require('./handler/searchHandler.js');
var ObjectId        = require('mongoskin').ObjectID;
var elasticSearchHandler = require('./handler/elasticSearchHandler.js');
const config        = require('./conf/conf.json');
const COLLECTIONARTIST  = config.database.collection_artist;
const COLLECTIONALBUM   = config.database.collection_album;
const COLLECTIONSONG    = config.database.collection_song;
const LIMIT             = config.request.limit
//==========================================================================================================================\\
//===========================WEBSERVICE REST POUR L'AFFICHAGE DU LISTING DES ARTISTES/ALBUMS/SONGS==========================\\
//==========================================================================================================================\\
//GET LISTING DES ARTISTES ALBUMS ET MUSIQUES EN FONCTION DE OU DES LETTRES 
router.get('/categorie/:nomCategorie/lettre/:lettre/page/:numPage', function (req, res, next) {
    var tObjectRequest,skip,tParamToFind;
    var nomCategorie =  req.params.nomCategorie.toLowerCase(),lettre = req.params.lettre, numPage = req.params.numPage, db = req.db, numPageTest = parseInt(numPage),objSend = {limit:LIMIT};
    //Si le numéro de page est un entier supérieur a 0 et qu'il y a moins de 3 lettres dans :lettre, on ne verifie pas si la variable lettre est un nombre car l'utilisateur doit aussi chercher par nombre s'il le souhaite
    if(Number.isInteger(numPageTest) && numPageTest>=0 && lettre.length<=2 ){
        skip = numPage*LIMIT;
        tParamToFind = searchHandler.optimizeFind(lettre);
    }
    else{
        nomCategorie = "default";
    }
    switch(nomCategorie) {
        case "artists":
            tObjectRequest = searchHandler.constructData("name", tParamToFind);
            db.collection(COLLECTIONARTIST).find({$or:tObjectRequest},{"name":1}).skip(skip).limit(LIMIT).toArray(function(err,artists){
                if (err) throw err;
                objSend.artists = artists;
                res.send(JSON.stringify(objSend));
            });
            break;
        case "albums":
            tObjectRequest = searchHandler.constructData("titre",tParamToFind);
            db.collection(COLLECTIONALBUM).aggregate([{"$match": { $or: tObjectRequest }}, {"$skip" :  skip},{"$limit" : LIMIT},{$project : { "titleAlbum" : "$titre" ,"name":1}}
            ],function(err, albums) {
                if (err) throw err;
                objSend.albums = albums;
                res.send(JSON.stringify(objSend));
            });
            break;
        case "songs":
            tObjectRequest = searchHandler.constructData("titre",tParamToFind);
            db.collection(COLLECTIONSONG).aggregate([{"$match": { $or: tObjectRequest }},{"$skip" :  skip}, {"$limit" : LIMIT}, {$project : { "albumTitre" : 1 ,"name":1,"titleSong":"$titre"}}
            ],function(err, songs) {
                if (err) throw err;
                objSend.songs = songs;
                res.send(JSON.stringify(objSend));
            });
            break;
        default:
                res.status(404).send([{error:config.http.error.global_404}]);
            break;
    }
});

//==========================================================================================================================\\
//==============================WEBSERVICE REST POUR LA NAVIGATION ENTRE CATEGORIES (SUBJCET)===============================\\
//==========================================================================================================================\\
//GET CATEGORY PAR NOM DE CATEGORY ET PAR COLLECTION
router.get('/category/:collection/:categoryName',function(req,res){
    var db = req.db;
    var collection= req.params.collection;
    if(collection !== COLLECTIONARTIST && collection !==COLLECTIONALBUM && collection !==COLLECTIONSONG){
        return res.status(404).send([{error:config.http.error.global_404}]);
    }
    var categoryName= req.params.categoryName;
    db.collection(collection).find({subject:categoryName},{name:1,titre:1,albumTitre:1}).sort({titre:1}).limit(LIMIT).toArray(function(err,objs){
        res.send(JSON.stringify(objs));
    })
});

//==========================================================================================================================\\
//====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE PRODUCER=====================================\\
//==========================================================================================================================\\
//GET PRODUCER PAR NOM DE PRODUCER
//Peut évoluer en /producer/:collection/:producerName avec :collection = artist/album/song si un artist ou un album a des producer
router.get('/producer/:producerName',function(req,res){
    var db = req.db;
    // var collection= req.params.collection;
    // if(collection !== COLLECTIONARTIST && collection !==COLLECTIONALBUM && collection !==COLLECTIONSONG){
    //     return res.status(404).send([{error:config.http.error.global_404}]);
    // }
    var producerName= req.params.producerName;
    db.collection(COLLECTIONSONG).find({producer:producerName},{name:1,titre:1,albumTitre:1}).sort({titre:1}).limit(LIMIT).toArray(function(err,objs){
        res.send(JSON.stringify(objs));
    })
});

//==========================================================================================================================\\
//===================================WEBSERVICE REST POUR LA NAVIGATION ENTRE RECORDLABEL===================================\\
//==========================================================================================================================\\
//GET RECORDLABEL PAR NOM DE RECORDLABEL
//Peut évoluer en /recordlabel/:collection/:recordLabelName avec :collection = artist/album/song si un artiste ou un album a des recordLabel
router.get('/recordlabel/:recordLabelName',function(req,res){
    var db = req.db;
    // var collection= req.params.collection;
    // if(collection !== COLLECTIONARTIST && collection !==COLLECTIONALBUM && collection !==COLLECTIONSONG){
    //     return res.status(404).send([{error:config.http.error.global_404}]);
    // }
    var recordLabelName= req.params.recordLabelName;
    db.collection(COLLECTIONSONG).find({recordLabel:recordLabelName},{name:1,titre:1,albumTitre:1}).sort({titre:1}).limit(LIMIT).toArray(function(err,objs){
        res.send(JSON.stringify(objs));
    })
});
//==========================================================================================================================\\
//=====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE GENRE=======================================\\
//==========================================================================================================================\\
//GET RECORDLABEL PAR NOM DE RECORDLABEL
//Peut évoluer en /recordlabel/:collection/:genreName avec :collection = album/song si un album a des Genre
router.get('/genre/:genreName',function(req,res){
    var db = req.db;
    // var collection= req.params.collection;
    // if(collection !== COLLECTIONARTIST && collection !==COLLECTIONALBUM && collection !==COLLECTIONSONG){
    //     return res.status(404).send([{error:config.http.error.global_404}]);
    // }
    var genreName= req.params.genreName;
    db.collection(COLLECTIONSONG).find({genre:genreName},{name:1,titre:1,albumTitre:1}).sort({titre:1}).limit(LIMIT).toArray(function(err,objs){
        res.send(JSON.stringify(objs));
    })
});
//==========================================================================================================================\\
//====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE RECORDED=====================================\\
//==========================================================================================================================\\
//GET RECORDED PAR NOM DE RECORDED
router.get('/recorded/:recordedName',function(req,res){
    var db = req.db, recordedName= req.params.recordedName;
    db.collection(COLLECTIONSONG).find({recorded:recordedName},{name:1,titre:1,albumTitre:1}).sort({titre:1}).limit(LIMIT).toArray(function(err,objs){
        res.send(JSON.stringify(objs));
    })
});
//==========================================================================================================================\\
//=====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE AWARD=======================================\\
//==========================================================================================================================\\
//GET AWARD PAR NOM DE AWARD
router.get('/award/:awardName',function(req,res){
    var db = req.db, awardName= req.params.awardName;
    db.collection(COLLECTIONSONG).find({award:awardName},{name:1,titre:1,albumTitre:1}).sort({titre:1}).limit(LIMIT).toArray(function(err,objs){
        res.send(JSON.stringify(objs));
    })
});
//==========================================================================================================================\\
//=====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE WRITER======================================\\
//==========================================================================================================================\\
//GET WRITER PAR NOM DE WRITER
router.get('/writer/:writerName',function(req,res){
    var db = req.db, writerName= req.params.writerName;
    db.collection(COLLECTIONSONG).find({writer:writerName},{name:1,titre:1,albumTitre:1}).sort({titre:1}).limit(LIMIT).toArray(function(err,objs){
        res.send(JSON.stringify(objs));
    })
});
//==========================================================================================================================\\
//=====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE FORMAT======================================\\
//==========================================================================================================================\\
//GET FORMAT PAR NOM DE FORMAT
router.get('/format/:formatName',function(req,res){
    var db = req.db, formatName= req.params.formatName;
    db.collection(COLLECTIONSONG).find({format:formatName},{name:1,titre:1,albumTitre:1}).sort({titre:1}).limit(LIMIT).toArray(function(err,objs){
        res.send(JSON.stringify(objs));
    })
});
//==========================================================================================================================\\
//====================WEBSERVICE REST POUR COMPTER LE NOMBRE D'OCCURENCE DE DOCUMENT DANS UNE COLLECTION ===================\\
//==========================================================================================================================\\
router.get('/count/:collection/:lettre', function (req, res) {
    var db = req.db, collection= req.params.collection,lettre= req.params.lettre, tParamToFind, fieldCollection, tObjectRequest;
    if(collection == "Artists"){
        collection = COLLECTIONARTIST;
        fieldCollection = "name";
    }else if(collection == "Albums"){
        collection = COLLECTIONALBUM;
        fieldCollection = "titre";
    }else if(collection == "Songs"){
        collection = COLLECTIONSONG;
        fieldCollection = "titre";
    }
    if(collection !== COLLECTIONARTIST && collection !==COLLECTIONALBUM && collection !==COLLECTIONSONG || lettre.length>2){
        return res.status(404).send([{error:config.http.error.global_404}]);
    }
    tParamToFind = searchHandler.optimizeFind(lettre);
    tObjectRequest = searchHandler.constructData(fieldCollection, tParamToFind);
    db.collection(collection).count({$or:tObjectRequest},function(err, countfield) {
        if(err){
            console.log(err);
            return res.status(404).send([{error:config.http.error.global_404}]);
        }
        var dbcount = {count:countfield};
        res.send(JSON.stringify(dbcount));
    });
});
//==========================================================================================================================\\
//================WEBSERVICE REST POUR COMPTER LE NOMBRE D'OCCURENCE D'UN ATTRIBUT DANS UNE COLLECTION DONNEE===============\\
//==========================================================================================================================\\
router.get('/count/:collection/:fieldName/:fieldValue', function (req, res) {
    var db = req.db, collection= req.params.collection, fieldName= req.params.fieldName, fieldValue= req.params.fieldValue;
    if(collection !== COLLECTIONARTIST && collection !==COLLECTIONALBUM && collection !==COLLECTIONSONG){
        return res.status(404).send([{error:config.http.error.global_404}]);
    }
    var query = {};
    query[fieldName] = fieldValue;
    db.collection(collection).count(query,function(err, countfield) {
        if(err){
            console.log(err);
            return res.status(404).send([{error:config.http.error.global_404}]);
        }
        var dbcount = {count:countfield};
        res.send(JSON.stringify(dbcount));
    });
});
//==========================================================================================================================\\
//============================WEBSERVICE REST POUR L'AFFICHAGE DU NOMBRE D'ARTISTES/ALBUMS/SONGS============================\\
//==========================================================================================================================\\
//GET PERMET D'OBTENIR LE NOMBRE D'ARTISTES/ALBUMS/SONGS
router.get('/dbinfo', function (req, res) {
    var db = req.db;
    db.collection(COLLECTIONARTIST).count(function(err, count) {
        var dbinfo = {};
        dbinfo.nbArtist = count;
        db.collection(COLLECTIONALBUM).count(function(err, count) {
            dbinfo.nbAlbum = count;
            db.collection(COLLECTIONSONG).count(function(err, count) {
                dbinfo.nbSong = count;
                res.send(JSON.stringify(dbinfo));
            });
        });
    });
});
//==========================================================================================================================\\
//=======================================WEBSERVICE REST POUR LA GESTION DES ARTISTES=======================================\\
//==========================================================================================================================\\
//GET ARTIST PAR NOM D'ARTISTE (UN NOM D'ARTISTE EST UNIQUE -> REGLE DE LYRICS WIKIA LORS DE L'EXTRACTION DES DONNEES)
router.get('/artist/:artistName', function (req, res) {
    var db = req.db, artistName= req.params.artistName;
    db.collection(COLLECTIONARTIST).findOne({name:artistName},{"urlWikia":0,wordCount:0}, function(err, artist) {
        if (artist===null) { return res.status(404).send([{error:config.http.error.artist_404}]);}
        db.collection(COLLECTIONALBUM).find({id_artist:artist._id},{"urlWikipedia":0,"genres":0,"urlAlbum":0,"wordCount":0,"rdf":0}).sort( { "dateSortie": -1} ).toArray(function(err,albums){
            var nbAlbum = albums.length, cnt = 0;
            //On construit le tableau albums afin d'y ajouter les infos des albums
            artist.albums = albums;
            for(var i = 0;i<albums.length;i++){
                (function(album){
                    db.collection(COLLECTIONSONG).find({"id_album":album._id},{"position":1,"titre":1}).sort( { "position": 1} ).toArray(function(err,songs){
                        if (err) throw err;
                        //On construit le tableau songs afin d'y ajouter les infos des musiques
                        album.songs = songs;
                        cnt++;
                        if(nbAlbum == cnt) {
                            res.send(JSON.stringify(artist));
                        }
                    });
                })(artist.albums[i]);
            }
        })
    });
});
//==========================================================================================================================\\
//========================================WEBSERVICE REST POUR LA GESTION DES ALBUMS========================================\\
//==========================================================================================================================\\
//GET ALBUM PAR NOM D'ARTISTE ET TITRE D'ALBUM
//FIXME /!\ UN ARTIST PEUT AVOIR PLUSIEURS FOIS UN MEME TITRE D'ALBUM /!\ ERREUR A CORRIGER
router.get('/artist/:artistName/album/:albumName', function (req, res) {
    var db = req.db, albumName= req.params.albumName, artistName = req.params.artistName;
    db.collection(COLLECTIONARTIST).findOne({name:artistName},{"urlAlbum":0,"wordCount":0}, function(err, artist) {
        if (artist==null) { return res.status(404).send([{error:config.http.error.artist_404}]);}
        //!\ UN ARTIST PEUT AVOIR PLUSIEURS FOIS UN MEME TITRE D'ALBUM /!\ ERREUR A CORRIGER
        db.collection(COLLECTIONALBUM).findOne({$and:[{"titre":albumName},{"id_artist":artist._id}]},{"urlAlbum":0,"wordCount":0}, function(err, album) {
            if (album==null) {   return res.status(404).send([{error:config.http.error.album_404}]); } 
            db.collection(COLLECTIONSONG).find({"id_album":album._id},{"position":1,"titre":1}).toArray(function(err,song){
                album.songs = song;
                artist.albums = album;
                res.send(JSON.stringify(artist));

            });
        });
    });
});

//PUT ALBUM PAR ID D'ABUM ET DE MUSIQUE
router.put('/artist/:artistName/album/:albumName', function (req, res) {
    var db = req.db, albumBody = req.body, albumTitre = albumBody.titre.trim();
    //FUTURE Si un album n'a pas encore d'attribut songs. Peut se produire lors de l'ajout d'un album
    for(var j=0;j<albumBody.songs.length;j++){
        //On change le titre de l'album contenu dans les documents musiques
        albumBody.songs[j].albumTitre = albumTitre;
        albumBody.songs[j].titre = albumBody.songs[j].titre.trim();
        var idSong = albumBody.songs[j]._id;
        // On supprime l'id car mongodb lance un avertissement si ce champ n'est pas supprimé (_id est immutable pas d'update possible)
        delete albumBody.songs[j]._id;
        delete albumBody.songs[j].id_album;
        db.collection(COLLECTIONSONG).update( { _id: new ObjectId(idSong) },{ $set: albumBody.songs[j] } );
    }
    //On supprime le champ songs car il n'éxiste pas dans la collection album
    delete albumBody.songs;     //FUTURE Si un album n'a pas encore d'attribut songs. Peut se produire lors de l'ajout d'un album
    var idAlbum = albumBody._id;
    // On supprime l'id car mongodb lance un avertissement si ce champ n'est pas supprimé (_id est immutable pas d'update possible)
    delete albumBody._id;
    delete albumBody.id_artist;
    db.collection(COLLECTIONALBUM).update( { _id: new ObjectId(idAlbum) },{ $set: albumBody } );
    res.send("OK");
});

//==========================================================================================================================\\
//=======================================WEBSERVICE REST POUR LA GESTION DES MUSIQUES=======================================\\
//==========================================================================================================================\\
//GET SONG PAR NOM D'ARTISTE TITRE D'ALBUM ET TITRE DE MUSIQUE
router.get('/artist/:artistName/album/:albumName/song/:songName', function (req, res) {
    var db = req.db, artistName = req.params.artistName, albumName = req.params.albumName, songName = req.params.songName;
    db.collection(COLLECTIONARTIST).findOne({name:artistName},{"_id":1,"name":1}, function(err, artist) {
        if (artist == null) { return res.status(404).sendFile([{error:config.http.error.artist_404}]);}
        db.collection(COLLECTIONALBUM).findOne({$and:[{"id_artist":artist._id},{"titre":albumName}]},{"_id":1,"titre":1}, function(err, album) {
            if (album == null) {  return res.status(404).sendFile([{error:config.http.error.album_404}]); }
            db.collection(COLLECTIONSONG).findOne({$and:[{"id_album":album._id},{"titre":songName}]},{"urlSong":0,"wordCount":0},function(err, song) {
                if (song == null) { return res.status(404).send([{error:config.http.error.song_404}]);}
                album.songs = song;
                artist.albums = album;
                res.send(JSON.stringify(artist));
            });
        });
        
    });
});
//GET SONG PAR ID D'ARTISTE,ALBUM,MUSIQUE
router.get('/artist_id/:artistId/album_id/:albumId/song_id/:songId', function (req, res) {
    var db = req.db, artistId = req.params.artistId, albumId = req.params.albumId, songId = req.params.songId;
    db.collection(COLLECTIONARTIST).findOne({_id:ObjectId(artistId)},{"_id":1,"name":1}, function(err, artist) {
        if (artist == null) { return res.status(404).sendFile([{error:config.http.error.artist_404}]);}
        db.collection(COLLECTIONALBUM).findOne({"_id":ObjectId(albumId)},{"_id":1,"titre":1}, function(err, album) {
            if (album == null) {  return res.status(404).sendFile([{error:config.http.error.album_404}]); }
            db.collection(COLLECTIONSONG).findOne({"_id":ObjectId(songId)},{"urlSong":0,"wordCount":0},function(err, song) {
                if (song == null) { return res.status(404).send([{error:config.http.error.song_404}]);}
                album.songs = song;
                artist.albums = album;
                res.send(JSON.stringify(artist));
            });
        });
    });
});
//PUT SONG OBJECT
router.put('/artist/:artistName/album/:albumName/song/:songName',function(req,res){
    var db = req.db, songBody = req.body;
    // req.params.artistName.replace(/\\n|\\r|\\r\\n|(<((?!br)[^>]+)>)/ig,"").trim();
    //On récupére l'id de la musique afin de modifier l'objet en base de données
    var idSong = songBody._id;
    //!\ Il faut supprimer les attributs qui sont de type objectId dans notre base car songBody les récupéres en string
    delete songBody.id_album;
    delete songBody._id;
    db.collection(COLLECTIONSONG).update( { _id: ObjectId(idSong) },{ $set: songBody } );
    res.send("OK");
});

//==========================================================================================================================\\
//=============================================WEBSERVICE REST POUR LA RECHERCHE============================================\\
//==========================================================================================================================\\
//permet de chercher des artistes via la barre de recherche
//FUTURE voir la configuration
router.get('/fulltext/:searchText', function (req, res) {
    var searchText = elasticSearchHandler.escapeElasticSearch(req.params.searchText);
    var maxinfo = config.request.limit_search_bar;
    var maxinfoselected = maxinfo/2; // nombre d'élements devant apparaitre dans l'autocomplétion de recherche
    var queryArtist =   { "query": { "query_string" : {"default_field": "name","query": searchText}},"size": maxinfo};
    var querySong =     { "query": { "query_string" : {"query": searchText,"fields":["titre^4","name^2","albumTitre"]}},"size": maxinfo};
    searchHandler.fullTextQuery(req,maxinfo,queryArtist,querySong,maxinfoselected).then(function(resp) {
        res.send(resp);
    }).catch(function(err) {
        res.send(err);
    });
});
router.get('/more/:searchText', function (req, res) {
    var searchText = elasticSearchHandler.escapeElasticSearch(req.params.searchText);
    var maxinfoselected = LIMIT/2;
    var queryArtist =   { "query": { "query_string" : {"default_field": "name","query": searchText}},"size": LIMIT};
    var querySong =     { "query": { "query_string" : {"query": searchText,"fields":["titre^4","name^2","albumTitre"]}},"size": LIMIT};
    var start = Date.now();
    searchHandler.fullTextQuery(req,LIMIT,queryArtist,querySong,maxinfoselected).then(function(resp) {
        // console.log("                       fulltext fullTextQuery time ="+ (Date.now() - start));
        res.send(resp);
    }).catch(function(err) {
        res.send(err);
    });
});


module.exports = router;
