var express         = require('express');
var router          = express.Router();
var db              = require('mongoskin').db('mongodb://localhost:27017/wasabi');

/* GET search pages. */
router.get('/', function (req, res,next) {
    console.log("Dedans search")
    var lettre = req.query.lettre;
    var nomCategorie = req.query.categorie.toLowerCase();
    console.log("lettre = "+lettre+"  nomCategorie = "+nomCategorie);
    var regLetter = new RegExp('^'+lettre,'i');
    switch(nomCategorie) {
        case "artist":
            db.collection('artist').find({"name": regLetter},{"name":1,"_id":1}).sort( {"name":1}).toArray(function(err,result){
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
            break;
        case "album":
            db.collection('artist').aggregate([       
                {$match: {'albums.titre':regLetter}},      
                //on recherche les documents ayant des albums avec un titre commençant par regLetter
                {"$match": {"albums.titre": regLetter}},
                // De-normalize le tableau pour sépérarer les documents
                { "$unwind": "$albums"},
                {"$match": {"albums.titre": regLetter}},
                {"$sort" : {'albums.titre' : 1} },
                {"$limit" : 200},  
                // On affiche seulement le titre contenu dans album
                {$project : { "albums.titre" : 1 ,"name":1}}
            ],function(err, result) {
                res.send(JSON.stringify(result));
            })
            break;
        case "songs":
            db.collection('artist').aggregate([ 
                {"$match": {"albums.songs.titre": regLetter}},
                // De-normalize le tableau pour sépérarer les documents
                {"$unwind": "$albums"},
                {"$unwind": "$albums.songs"},
                {"$match": {"albums.songs.titre": regLetter}},
                {"$sort" : {'albums.songs.titre' : 1} },
                {"$limit" : 200},
                {"$project" : { "albums.songs.titre" : 1,"name":1}},

                
            ],function(err, result) {
                res.send(JSON.stringify(result));
            })
            break;
        default:
            break;
    }
});

router.get('/artist/:artistName', function (req, res) {
    var artistName= req.params.artistName;
    console.log("Affichage de la page de l'artiste "+artistName);

    db.collection('artist').find({"name": artistName}).toArray(function(err,result){
        if (err) throw err;
        console.log(result[0]);
        res.send(JSON.stringify(result[0]));
    });
});
/* PROBLEME D'encodage lors de la reception des variables */
router.get('/artist/:artistName/albums/:albumsName', function (req, res) {
    var albumsName= req.params.albumsName;
    var artistName = req.params.artistName;
    console.log("Artist : "+artistName+" Affichage de la page de l'album "+albumsName);
    db.collection('artist').find({"name": artistName,"albums.titre":albumsName}).toArray(function(err,result){
        if (err) throw err;
        console.log(result[0]);
        res.send(JSON.stringify(result[0]));
    });
});

router.get('/artist/:artistName/songs/:songsName', function (req, res) {
    var songsName = req.params.songsName;
    var artistName = req.params.artistName;
    console.log("Affichage de la page de la musique "+songsName);
    db.collection('artist').find({"name": artistName,"albums.songs.titre":songsName}).toArray(function(err,result){
        if (err) throw err;
        console.log(result[0]);
        res.send(JSON.stringify(result[0]));
    });
});
module.exports = router;
