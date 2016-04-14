var express         = require('express');
var router          = express.Router();
var searchHandler   = require('./handler/searchHandler.js');
var db              = require('mongoskin').db('mongodb://localhost:27017/wasabi');
var ObjectId        = require('mongoskin').ObjectID;


//==========================================================================================================================\\
//===========================WEBSERVICE REST POUR L'AFFICHAGE DU LISTING DES ARTISTES/ALBUMS/SONGS==========================\\
//==========================================================================================================================\\
//GET LISTING DES ARTISTES ALBUMS ET MUSIQUES EN FONCTION DE OU DES LETTRES 
router.get('/categorie/:nomCategorie/lettre/:lettre/page/:numPage', function (req, res, next) {
    var tObjectRequest,limit,skip,tParamToFind,nomCategorie,lettre,numPage,urlParamValid,numPageTest;
    nomCategorie = req.params.nomCategorie.toLowerCase();
    lettre = req.params.lettre;
    numPage = req.params.numPage;
    urlParamValid = false;
    numPageTest = parseInt(numPage);
    if(Number.isInteger(numPageTest) && numPageTest>=0){
        urlParamValid = true;
        limit = 200;
        skip = numPage*limit;
        tParamToFind = [];
        //Optimisation de mongodb en utilisant: /^AB/ /^Ab/ /^aB/ /^ab/ (utilise l'index) au lieu /^AB/i (n'utilise pas l'index)
        if(lettre.length==2){
            tParamToFind.push(new RegExp('^' + lettre[0].toUpperCase()+lettre[1].toUpperCase()));
            tParamToFind.push(new RegExp('^' + lettre[0].toUpperCase()+lettre[1].toLowerCase()));
            tParamToFind.push(new RegExp('^' + lettre[0].toLowerCase()+lettre[1].toUpperCase()));
            tParamToFind.push(new RegExp('^' + lettre[0].toLowerCase()+lettre[1].toLowerCase()));
        }
        else{
            tParamToFind.push(new RegExp('^' + lettre.toUpperCase()));
            tParamToFind.push(new RegExp('^' + lettre.toLowerCase()));  
        } 
    }
    else{
        nomCategorie = "default";
    }
    switch(nomCategorie) {
        case "artists":
            tObjectRequest = searchHandler.constructData("name", tParamToFind);
            db.collection('artist').find({$or:tObjectRequest},{"name":1,"_id":0}).skip(skip).limit(limit).toArray(function(err,result){
                if (err) throw err;
                    db.collection('artist').find({$or:tObjectRequest}).count(function(err, count) {
                        if (err) throw err;
                        result.push({"nbcount": count});
                        res.send(JSON.stringify(result));
                    });
            });
            break;
        case "albums":   
            tObjectRequest = searchHandler.constructData("titre",tParamToFind);
            db.collection('album').aggregate([       
                {"$match": { $or: tObjectRequest }},
                {"$skip" :  skip},
                {"$limit" : limit},  
                {$project : { "titleAlbum" : "$titre" ,"name":1}}
            ],function(err, result) {
                    if (err) throw err;
                    db.collection('album').find({ $or: tObjectRequest }).count(function(err, count) {
                        if (err) throw err;
                        result.push({"nbcount": count});
                        res.send(JSON.stringify(result));
                    });
            });
            break;
        case "songs":
            tObjectRequest = searchHandler.constructData("titre",tParamToFind);
            var start = Date.now();
            db.collection('song').aggregate([ 
                {"$match": { $or: tObjectRequest }},
                {"$skip" :  skip}, 
                {"$limit" : limit},  
                {$project : { "albumTitre" : 1 ,"name":1,"titleSong":"$titre"}}
            ],function(err, result) {
                    this.console.log("Avant le count==");
                    this.console.log(Date.now() - start);
                    var secondStart = Date.now();
                    if (err) throw err;
                    //Le count sur des millions de data est long ~250ms
                    db.collection('song').find({ $or: tObjectRequest }).count(function(err, count) {
                        this.console.log("Après le count==");
                        this.console.log(Date.now() - secondStart);
                        if (err) throw err;
                        result.push({"nbcount": count});
                        res.send(JSON.stringify(result));
                    });
            });
            break;
        default:
                res.status(404).send([{error:"Page not find"}]);
            break;
    }
});
//==========================================================================================================================\\
//============================WEBSERVICE REST POUR L'AFFICHAGE DU NOMBRE D'ARTISTES/ALBUMS/SONGS============================\\
//==========================================================================================================================\\
//
//GET PERMET D'OBTENIR LE NOMBRE D'ARTISTES/ALBUMS/SONGS
router.get('/dbinfo', function (req, res) {
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
    var artistName= req.params.artistName;
    this.console.log("Affichage de la page de l'artiste "+artistName);
    db.collection('artist').findOne({name:artistName},{"urlWikia":0}, function(err, artist) {
        if (artist===null) {
            this.console.log("Artist Inexistant");
            res.status(404).send([{error:"Page not find"}]);
        }
        else{
            artist.albums = [];
            var cnt = 0;
            db.collection('album').count({name:artistName}, function(err, count) {
                if (err) throw err; 
                db.collection('album').find({name:artistName},{"urlWikipedia":0,"urlAlbum":0}).sort( { "dateSortie": -1} ).forEach(
                    function(album){ 
                        artist.albums.push(album);
                        (function(albumIdx,album){
                            db.collection('song').find({ $and: [ {"albumTitre":album.titre}, {"name":artistName} ] },{"name":0,"albumTitre":0,"urlSong":0,"lyrics":0,"urlWikipedia":0}).toArray(function(err,song){
                                if (err) throw err;
                                artist.albums[albumIdx].songs = song;
                                cnt++;
                                if(count == cnt) {
                                    res.send(JSON.stringify(artist));
                                }
                            });
                        })(artist.albums.length-1,album);
                    }
                );
            });
        }
    });
});
//==========================================================================================================================\\
//========================================WEBSERVICE REST POUR LA GESTION DES ALBUMS========================================\\
//==========================================================================================================================\\
//GET ALBUM PAR NOM D'ARTISTE ET TITRE D'ALBUM
router.get('/artist/:artistName/album/:albumName', function (req, res) {
    var albumName= req.params.albumName;
    var artistName = req.params.artistName;
    this.console.log("L'utilisateur veut AFFICHER l'album "+albumName+" de l'artiste "+artistName);
    db.collection('artist').findOne({name:artistName}, function(err, artist) {
        db.collection('album').findOne({$and:[{"titre":albumName},{"name":artistName}]},{"urlAlbum":0}, function(err, album) {
            db.collection('song').find({$and:[{"albumTitre":albumName},{"name":artistName}]},{"name":0,"albumTitre":0,"urlSong":0,"lyrics":0,"urlWikipedia":0}).toArray(function(err,song){
                if (album===null) {
                    this.console.log("Album Inexistant");
                    res.status(404).send([{error:"Page not find"}]);
                }
                else{
                    album.songs = song;
                    artist.albums = album;
                    res.send(JSON.stringify(artist));
                }
            });
        });
    });
});

//PUT ALBUM PAR ID D'ABUM ET DE MUSIQUE
router.put('/artist/:artistName/album/:albumName', function (req, res) {
    var albumBody = req.body;
    this.console.log("Mise à jour de l'album "+ albumBody.titre); 
    for(var j=0;j<albumBody.songs.length;j++){
        albumBody.songs[j].albumTitre = albumBody.titre;
        var idSong = albumBody.songs[j]._id;
        delete albumBody.songs[j]._id;         // lance un avertissement si non supprimé car l'id est immutable
        db.collection('song').update( { _id: new ObjectId(idSong) },{ $set: albumBody.songs[j] } );
    }
    delete albumBody.songs;
    var idAlbum = albumBody._id;
    delete albumBody._id; 
    db.collection('album').update( { _id: new ObjectId(idAlbum) },{ $set: albumBody } );
    res.send("OK");
});

//==========================================================================================================================\\
//=======================================WEBSERVICE REST POUR LA GESTION DES MUSIQUES=======================================\\
//==========================================================================================================================\\
//GET SONG PAR NOM D'ARTISTE TITRE D'ALBUM ET TITRE DE MUSIQUE
router.get('/artist/:artistName/album/:albumName/song/:songsName', function (req, res) {
    var artistName = req.params.artistName;
    var albumName = req.params.albumName;
    var songsName = req.params.songsName;
    this.console.log("Affichage de la page de la musique "+songsName );    
    db.collection('artist').findOne({name:artistName}, function(err, artist) {
        db.collection('album').findOne({$and:[{"titre":albumName},{"name":artistName}]},{"urlAlbum":0}, function(err, album) {
            db.collection('song').findOne({$and:[{"albumTitre":albumName},{"name":artistName},{"titre":songsName}]},{"urlSong":0},function(err, song) {
                if (album===null || song === null) {
                    this.console.log("Album Inexistant");
                    res.status(404).send([{error:"Page not find"}]);
                }
                else{
                    album.songs = song;
                    artist.albums = album;
                    res.send(JSON.stringify(artist));
                }
            });
        });
    });
});
router.put('/artist/:artistName/album/:albumName/song/:songsName',function(req,res){
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
router.get('/artist/begin/:artistName', function (req, res) {
    var artistName = req.params.artistName;
    var regLetter = new RegExp(artistName,'i');
    this.console.log("L'utilisateur recherche un artiste commancant par les lettres: "+artistName);
    db.collection('artist').find({"name": regLetter},{"name":1}).limit(11).toArray(function(err,result){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

module.exports = router;
