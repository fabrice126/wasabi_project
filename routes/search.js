var express         = require('express');
var request         = require('request');
var router          = express.Router();
var searchHandler   = require('./handler/searchHandler.js');
//var db              = require('mongoskin').db('mongodb://localhost:27017/wasabi');
var ObjectId        = require('mongoskin').ObjectID;


//==========================================================================================================================\\
//===========================WEBSERVICE REST POUR L'AFFICHAGE DU LISTING DES ARTISTES/ALBUMS/SONGS==========================\\
//==========================================================================================================================\\
//GET LISTING DES ARTISTES ALBUMS ET MUSIQUES EN FONCTION DE OU DES LETTRES 
router.get('/categorie/:nomCategorie/lettre/:lettre/page/:numPage', function (req, res, next) {
    var tObjectRequest,limit,skip,tParamToFind,nomCategorie,lettre,numPage,urlParamValid,numPageTest,db;
    db = req.db;
    nomCategorie = req.params.nomCategorie.toLowerCase();
    lettre = req.params.lettre;
    numPage = req.params.numPage;
    urlParamValid = false;
    
    numPageTest = parseInt(numPage);
    //Si le numéro de page est un entier supérieur a 0 et qu'il y a moins de 3 lettres dans :lettre
    if(Number.isInteger(numPageTest) && numPageTest>=0 && lettre.length<=2){
        urlParamValid = true;
        limit = 200;
        skip = numPage*limit;
        tParamToFind = searchHandler.optimizeFind(lettre);
    }
    else{
        nomCategorie = "default";
    }
    switch(nomCategorie) {
        case "artists":
            tObjectRequest = searchHandler.constructData("name", tParamToFind);
            var start = Date.now();
            db.collection('artist').find({$or:tObjectRequest},{"name":1}).skip(skip).limit(limit).toArray(function(err,artists){
                console.log("Benchmark find artist : "+ (Date.now()-start));
                if (err) throw err;
//                db.collection('artist').find({$or:tObjectRequest}).count(function(err, count) {
                    if (err) throw err;
                    var objArtist = {};
                    objArtist.artists = artists;
                    objArtist.nbcount = "count";
                    objArtist.limit = limit;
                    console.log("Benchmark count artist : "+ (Date.now()-start));
                    res.send(JSON.stringify(objArtist));
//                });
            });
            break;
        case "albums":   
            tObjectRequest = searchHandler.constructData("titre",tParamToFind);
            var start = Date.now();
            db.collection('album').aggregate([{"$match": { $or: tObjectRequest }}, {"$skip" :  skip},{"$limit" : limit},{$project : { "titleAlbum" : "$titre" ,"name":1}}
            ],function(err, albums) {
                console.log("Benchmark find albums : "+(Date.now()-start));
                if (err) throw err;
//                db.collection('album').find({ $or: tObjectRequest }).count(function(err, count) {
                    console.log("Benchmark count albums : "+(Date.now()-start));
                    if (err) throw err;
                    var objAlbum = {};
                    objAlbum.albums = albums;
                    objAlbum.nbcount = "count";
                    objAlbum.limit = limit;
                    res.send(JSON.stringify(objAlbum));
//                });
            });
            break;
        case "songs":
            tObjectRequest = searchHandler.constructData("titre",tParamToFind);
            db.collection('song').aggregate([{"$match": { $or: tObjectRequest }},{"$skip" :  skip}, {"$limit" : limit}, {$project : { "albumTitre" : 1 ,"name":1,"titleSong":"$titre"}}
            ],function(err, songs) {
                if (err) throw err;
                //Le count sur des millions de data est long ~250ms
//                    db.collection('song').find({ $or: tObjectRequest }).count(function(err, count) {
                    if (err) throw err;
                    var objSongs = {};
                    objSongs.songs = songs;
                    objSongs.nbcount = "count";
                    objSongs.limit = limit;
                    res.send(JSON.stringify(objSongs));
//                    });
            });
            break;
        default:
                res.status(404).send([{error:"Page not found"}]);
            break;
    }
});
//==========================================================================================================================\\
//============================WEBSERVICE REST POUR L'AFFICHAGE DU NOMBRE D'ARTISTES/ALBUMS/SONGS============================\\
//==========================================================================================================================\\
//
//GET PERMET D'OBTENIR LE NOMBRE D'ARTISTES/ALBUMS/SONGS
router.get('/dbinfo', function (req, res) {
    var db = req.db;
    var dbinfo = {};
    db.collection('artist').count(function(err, count) {
        dbinfo.nbArtist = count;
        db.collection('album').count(function(err, count) {
            dbinfo.nbAlbum = count;
            db.collection('song').count(function(err, count) {
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
    var db = req.db;
    var artistName= req.params.artistName;
    this.console.log("get /artist/"+artistName); 
    var start = Date.now();
    
    db.collection('artist').findOne({name:artistName},{"urlWikia":0,wordCount:0}, function(err, artist) {
        if (artist===null) { return res.status(404).send([{error:"Artist not found"}]);}
        db.collection('album').find({id_artist:artist._id},{"urlWikipedia":0,"genres":0,"urlAlbum":0,"wordCount":0,"rdf":0}).sort( { "dateSortie": -1} ).toArray(function(err,albums){
            var nbAlbum = albums.length;
            var cnt = 0;
            //On construit le tableau albums afin d'y ajouter les infos des albums
            artist.albums = albums;
            for(var i = 0;i<albums.length;i++){
                (function(album){
                    db.collection('song').find({"id_album":album._id},{"position":1,"titre":1}).sort( { "position": 1} ).toArray(function(err,songs){
                        if (err) throw err;
                        
                        //On construit le tableau songs afin d'y ajouter les infos des musiques
                        album.songs = songs;
                        cnt++;
                        if(nbAlbum == cnt) {console.log(Date.now() - start); res.send(JSON.stringify(artist)); }
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
    var db = req.db;
    var albumName= req.params.albumName;
    var artistName = req.params.artistName;
    this.console.log("get /artist/"+artistName+"/album/"+albumName); 
    var start = Date.now();
    db.collection('artist').findOne({name:artistName},{"urlAlbum":0,"wordCount":0}, function(err, artist) {
        if (artist==null) { return res.status(404).send([{error:"Page not found"}]);}
        //!\ UN ARTIST PEUT AVOIR PLUSIEURS FOIS UN MEME TITRE D'ALBUM /!\ ERREUR A CORRIGER
        db.collection('album').findOne({$and:[{"titre":albumName},{"id_artist":artist._id}]},{"urlAlbum":0,"wordCount":0}, function(err, album) {
            if (album==null) {   return res.status(404).send([{error:"Page not found"}]); }
            db.collection('song').find({"id_album":album._id},{"position":1,"titre":1}).toArray(function(err,song){
                album.songs = song;
                artist.albums = album;
                console.log(Date.now() - start);
                res.send(JSON.stringify(artist));

            });
        });
        
    });
});

//PUT ALBUM PAR ID D'ABUM ET DE MUSIQUE
router.put('/artist/:artistName/album/:albumName', function (req, res) {
    var db = req.db;
    var albumName= req.params.albumName;
    var artistName = req.params.artistName;
    var albumBody = req.body;
    this.console.log("put /artist/"+artistName+"/album/"+albumName);    
    //FUTURE Si un album n'a pas encore d'attribut songs. Peut se produire lors de l'ajout d'un album
    for(var j=0;j<albumBody.songs.length;j++){
        //On change le titre de l'album contenu dans les documents musiques
        //l'attribut albumTitre est utile pour générer la recherche d'une musique
        albumBody.songs[j].albumTitre = albumBody.titre; 
        var idSong = albumBody.songs[j]._id;
        // On supprime l'id car mongodb lance un avertissement si ce champ n'est pas supprimé (_id est immutable pas d'update possible)
        delete albumBody.songs[j]._id;         
        delete albumBody.songs[j].id_album;
        db.collection('song').update( { _id: new ObjectId(idSong) },{ $set: albumBody.songs[j] } );
    }
    //On supprime le champ songs car il n'éxiste pas dans la collection album
    delete albumBody.songs;     //FUTURE Si un album n'a pas encore d'attribut songs. Peut se produire lors de l'ajout d'un album
    var idAlbum = albumBody._id;
    // On supprime l'id car mongodb lance un avertissement si ce champ n'est pas supprimé (_id est immutable pas d'update possible)
    delete albumBody._id; 
    delete albumBody.id_artist; 
    db.collection('album').update( { _id: new ObjectId(idAlbum) },{ $set: albumBody } );
    res.send("OK");
});

//==========================================================================================================================\\
//=======================================WEBSERVICE REST POUR LA GESTION DES MUSIQUES=======================================\\
//==========================================================================================================================\\
//GET SONG PAR NOM D'ARTISTE TITRE D'ALBUM ET TITRE DE MUSIQUE
router.get('/artist/:artistName/album/:albumName/song/:songsName', function (req, res) {
    var db = req.db;
    var artistName = req.params.artistName;
    var albumName = req.params.albumName;
    var songsName = req.params.songsName;
    var start = Date.now();
    this.console.log("get /artist/"+artistName+"/album/"+albumName+"/song/"+songsName);   
    db.collection('artist').findOne({name:artistName},{"_id":1,"name":1}, function(err, artist) {
        if (artist == null) { return res.status(404).sendFile([{error:"Artist not found"}]);}
        console.log(Date.now() - start);
        db.collection('album').findOne({$and:[{"id_artist":artist._id},{"titre":albumName}]},{"_id":1,"titre":1}, function(err, album) {
            if (album == null) {  return res.status(404).sendFile([{error:"Album not found"}]); }
            console.log(Date.now() - start);
            db.collection('song').findOne({$and:[{"id_album":album._id},{"titre":songsName}]},{"urlSong":0,"wordCount":0},function(err, song) {
                if (song == null) { return res.status(404).send([{error:"Song not found"}]);}
                album.songs = song;
                artist.albums = album;
                console.log(Date.now() - start);
                res.send(JSON.stringify(artist));
            });
        });
        
    });
});
router.put('/artist/:artistName/album/:albumName/song/:songsName',function(req,res){
    var db = req.db;
    var songBody = req.body;
    var idSong = songBody._id;
    delete songBody._id;
    db.collection('song').update( { _id: new ObjectId(idSong) },{ $set: songBody } );
    res.send("OK");
});

//==========================================================================================================================\\
//=============================================WEBSERVICE REST POUR LA RECHERCHE============================================\\
//==========================================================================================================================\\
//permet de chercher des artistes via la barre de recherche
router.get('/fulltext/:searchText', function (req, res) {
    var db = req.db;
    var escapeHTML = req.escapeHTML;
    var escapeElastic = req.escapeElastic;    // escape ces chars:  + - = && || > < ! ( ) { } [ ] ^ " ~ * ? : \ /
    var elasticsearchClient = req.elasticsearchClient;
    var searchText = escapeElastic(escapeHTML(req.params.searchText));
    var maxinfo = 12; //12 élements doivent apparaitre dans l'autocomplétion de recherche
    var maxinfoselected = maxinfo/2;
    var result = [];
    var querySong = {"query": {"bool": {"should": [ {"query_string": {"default_field": "_all","query": searchText}}]}},"size": maxinfo};
    this.console.log("get '/fulltext/"+searchText);
    var startArtist = Date.now();
    elasticsearchClient.search({index: 'idx_artists', type: 'string', body: querySong}).then(function (respArtists) {
        var artist = [];
        for(var i = 0 ; i<respArtists.hits.hits.length;i++){
            artist.push(respArtists.hits.hits[i]._source);
        }
        console.log(Date.now() - startArtist);
        var startSong = Date.now();
        elasticsearchClient.search({index: 'idx_songs',type: 'string',body: querySong}).then(function (respSongs) {
            var song = [];
            for(var i = 0 ; i<respSongs.hits.hits.length;i++){
                song.push(respSongs.hits.hits[i]._source);
            }
            //On a récupéré 12 artists et 12 musiques
            //Si on a - de 6 artistes, comme il nous faut 12 résultats on va ajouter + de musiques
            if(artist.length < maxinfoselected){
                song = song.slice(0,maxinfoselected+maxinfoselected - artist.length);
            }
            //il y a autant de musique que d'artist
            else{
                artist = artist.slice(0,maxinfoselected);
                song = song.slice(0,maxinfoselected);
            }
            console.log(Date.now() - startSong);
            result = artist.concat(song);
            res.send(JSON.stringify(result));
        }, function (err) {
            res.send("Error: Song");
        });
    }, function (err) {
        res.send("Error: Artist");
    });
//    });
});



router.get('/more/:searchText', function (req, res) {
    var db = req.db;
    var escapeHTML = req.escapeHTML;
    var escapeElastic = req.escapeElastic;    // escape ces chars:  + - = && || > < ! ( ) { } [ ] ^ " ~ * ? : \ /
    var elasticsearchClient = req.elasticsearchClient;
    var artistName = escapeElastic(escapeHTML(req.params.artistName));
    var maxinfo = 200; //200 élements doivent apparaitre dans l'autocomplétion de recherche
    var maxinfoselected = maxinfo/2;
    var result = [];
    var querySong = {"query": {"bool": {"should": [ {"query_string": {"default_field": "_all","query": artistName}}]}},"size": maxinfo};
    this.console.log("get '/more/"+artistName);
    var startArtist = Date.now();
    elasticsearchClient.search({index: 'idx_artists', type: 'string', body: querySong}).then(function (respArtists) {
        var artist = [];
        console.log(Date.now() - startArtist);
        for(var i = 0 ; i<respArtists.hits.hits.length;i++){
            artist.push(respArtists.hits.hits[i]._source);
        }
        console.log(Date.now() - startArtist);
        var startSong = Date.now();
        elasticsearchClient.search({index: 'idx_songs',type: 'string',body: querySong}).then(function (respSongs) {
            var song = [];
            console.log(Date.now() - startSong);
            for(var i = 0 ; i<respSongs.hits.hits.length;i++){
                song.push(respSongs.hits.hits[i]._source);
            }
            //On a récupéré 200 artists et 12 musiques
            //Si on a - de 6 artistes, comme il nous faut 12 résultats on va ajouter + de musiques
            if(artist.length < maxinfoselected){
                song = song.slice(0,maxinfoselected+maxinfoselected - artist.length);
            }
            //il y a autant de musique que d'artist
            else{
                artist = artist.slice(0,maxinfoselected);
                song = song.slice(0,maxinfoselected);
            }
            console.log(Date.now() - startSong);
            result = artist.concat(song);
            res.send(JSON.stringify(result));
        }, function (err) {
            res.send("Error: Song");
        });
    }, function (err) {
        res.send("Error: Artist");
    });
//    });
});
module.exports = router;
