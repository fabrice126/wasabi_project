var express         = require('express');
var router          = express.Router();
var db              = require('mongoskin').db('mongodb://localhost:27017/wasabi');
var ObjectId        = require('mongoskin').ObjectID;

/* GET search pages. */
router.get('/categorie/:nomCategorie/lettre/:lettre', function (req, res,next) {
    var nomCategorie= req.params.nomCategorie.toLowerCase();
    var lettre = req.params.lettre;
    console.log("Dedans search");
    console.log("lettre = "+lettre+" nomCategorie = "+nomCategorie);
    var regLetterToUpperCase = new RegExp('^' + lettre.toUpperCase());
    var regLetterToLowerCase = new RegExp('^' + lettre.toLowerCase());
    switch(nomCategorie) {
        case "artist":
            var debut = Date.now();
            db.collection('artist').find({ $or: [{ name: regLetterToUpperCase }, { name: regLetterToLowerCase }] },{"name":1,"_id":1}).limit(200).toArray(function(err,result){
                var fin = Date.now();
                console.log(fin-debut);
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
            break;
        case "album":                
            db.collection('album').aggregate([       
                {"$match": { $or: [{ titre: regLetterToUpperCase }, { titre: regLetterToLowerCase }] }},
                {"$limit" : 200},  
                {$project : { "titleAlbum" : "$titre" ,"name":1}}
            ],function(err, result) {
                res.send(JSON.stringify(result));
            })

            break;
        case "songs":
            db.collection('artist').aggregate([ 
                {"$match": { $or: [{ "albums.songs.titre": regLetterToUpperCase }, { "albums.songs.titre": regLetterToLowerCase }] }},
                // De-normalize le tableau pour sépérarer les documents
                {"$unwind": "$albums"},
                {"$unwind": "$albums.songs"},
                {"$match": { $or: [{ "albums.songs.titre": regLetterToUpperCase }, { "albums.songs.titre": regLetterToLowerCase }] }},
//                {"$sort" : {'albums.songs.titre' : 1} },
                {"$limit" : 200},
                {"$project" : { "titleSong" : "$albums.songs.titre","name":1}},
            ],function(err, result) {
                res.send(JSON.stringify(result));
            })
            break;
        default:
            break;
    }
});

//Utiliser pour l'affichage d'un artiste
router.get('/artist/:artistName', function (req, res) {
    var artistName= req.params.artistName;
    console.log("Affichage de la page de l'artiste "+artistName);

    db.collection('artist').find({"name":artistName }).toArray(function(err,result){
        if (err) throw err;
//        console.log(result[0]);
        res.send(JSON.stringify(result[0]));
    });
});
//Utiliser pour l'affichage d'un album
//router.get('/artist/:artistName/albums/:albumsName', function (req, res) {
//    var albumsName= req.params.albumsName;
//    var artistName = req.params.artistName;
//    console.log("Artist : "+artistName+" Affichage de la page de l'album "+albumsName);
//    db.collection('artist').find({"name":artistName }).toArray(function(err,result){
//        if (err) throw err;
////        console.log(result[0]);
//        res.send(JSON.stringify(result[0]));
//    });
//});


//Utiliser pour l'affichage d'une chanson
router.get('/artist/:artistName/album/:albumName/song/:songsName', function (req, res) {

    var artistName = req.params.artistName;
    var albumName = req.params.albumName;
    var songsName = req.params.songsName;
    console.log("Affichage de la page de la musique "+songsName );
    db.collection('artist').aggregate([       
        {"$match": { $and:[{name:artistName},{"albums.titre":albumName},{"albums.songs.titre":songsName}] }  },
        // De-normalize le tableau pour sépérarer les documents
        {"$unwind": "$albums"},
        {"$unwind": "$albums.songs"},
        {"$match": { $and:[{name:artistName},{"albums.titre":albumName},{"albums.songs.titre":songsName}] }  },
    ],function(err, result) {
        if (err) throw err;
        res.send(JSON.stringify(result[0]));
    })
    
});

//Utiliser pour récupérer les infos d'un album (situé dans la page-artist.html) avant de le modifier
router.get('/artist/:artistName/albums/:albumsName/modify', function (req, res) {
    var albumsName= req.params.albumsName;
    var artistName = req.params.artistName;
    console.log("L'utilisateur veut modifier l'album "+albumsName+" de l'artiste ");
    db.collection('artist').aggregate([       
               {"$match": {  $and:[{"name":artistName},{"albums.titre":albumsName}] } },      
                {"$unwind": "$albums"},
                {"$match": {"albums.titre": albumsName}}
            ],function(err, result) {
                if (err) throw err;
//                console.log(result[0]);
                res.send(JSON.stringify(result[0]));
            });
});

//permet de chercher des artistes via la barre de recherche
router.get('/artist/begin/:artistName', function (req, res) {
    var artistName = req.params.artistName;
    var regLetter = new RegExp('^'+artistName,'i');
    console.log("L'utilisateur recherche un artiste commancant par les lettres: "+artistName);
    db.collection('artist').find({"name": regLetter},{"name":1}).limit(11).toArray(function(err,result){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});


router.put('/artist/:artistName/albums/:albumsName/:_id/update/album/:oldNameAlbum', function (req, res) {
    var album = req.body;
    var _id = req.params._id;
    var oldNameAlbum= req.params.oldNameAlbum;
    console.log(album);
    console.log("Mise à jour de l'album "+ album.titre+" _id = "+_id); 
    db.collection('artist').update(
        {
            _id: ObjectId(_id),
            "albums.titre": oldNameAlbum,
        }, 
        {
            '$set':{
                "albums.$.titre":album.titre,
                "albums.$.dateSortie":album.dateSortie,
                "albums.$.songs":album.songs,
            }
        }, 
        function(err, result) {
            if (err) throw err;
            if (result){
                console.log('Updated!');
            } 
        });
});



module.exports = router;
