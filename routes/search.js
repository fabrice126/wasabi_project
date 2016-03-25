var express         = require('express');
var router          = express.Router();
var db              = require('mongoskin').db('mongodb://localhost:27017/wasabi');
var ObjectId        = require('mongoskin').ObjectID;

/* GET search pages. */
router.get('/categorie/:nomCategorie/lettre/:lettre/page/:numPage', function (req, res,next) {
    var nomCategorie= req.params.nomCategorie.toLowerCase();
    var lettre = req.params.lettre;
    var numPage = req.params.numPage;
    
    
    var urlParamValid = false;
    var numPageTest = parseInt(numPage);
    if(Number.isInteger(numPageTest) && numPageTest>=0){
        urlParamValid = true;
        console.log(urlParamValid);
        var limit = 200;
        var skip = numPage*limit;
        var regLetterToUpperCase = new RegExp('^' + lettre.toUpperCase());
        var regLetterToLowerCase = new RegExp('^' + lettre.toLowerCase());
    }
    else{
        nomCategorie = "default";
    }
    switch(nomCategorie) {
        case "artists":
            db.collection('artist').find({ $or: [{ name: regLetterToUpperCase }, { name: regLetterToLowerCase }] },{"name":1,"_id":0}).skip(skip).limit(limit).toArray(function(err,result){
                if (err) throw err;
                    db.collection('artist').find({ $or: [{ name:  regLetterToUpperCase }, { name: regLetterToLowerCase }] }).count(function(err, count) {
                        if (err) throw err;
                        result.push({"nbcount": count});
                        res.send(JSON.stringify(result));
                    });
            });
            break;
        case "albums":                
            db.collection('album').aggregate([       
                {"$match": { $or: [{ titre: regLetterToUpperCase }, { titre: regLetterToLowerCase }] }},
                {"$skip" :  skip},
                {"$limit" : limit},  
                {$project : { "titleAlbum" : "$titre" ,"name":1}}
            ],function(err, result) {
                    if (err) throw err;
                    db.collection('album').find({ $or: [{ titre:  regLetterToUpperCase }, { titre: regLetterToLowerCase }] }).count(function(err, count) {
                        if (err) throw err;
                        result.push({"nbcount": count});
                        res.send(JSON.stringify(result));
                    });
            })

            break;
        case "songs":
            db.collection('song').aggregate([ 
                {"$match": { $or: [{ titre: regLetterToUpperCase}, { titre: regLetterToLowerCase }] }},
                {"$skip" :  skip},
                {"$limit" : limit},  
                {$project : { "albumTitre" : 1 ,"name":1,"titleSong":"$titre"}}
            ],function(err, result) {
                    if (err) throw err;
                    db.collection('song').find({ $or: [{ titre:  regLetterToUpperCase }, { titre: regLetterToLowerCase }] }).count(function(err, count) {
                        if (err) throw err;
                        result.push({"nbcount": count});
                        console.log(result.nbcount);
                        res.send(JSON.stringify(result));
                    });
            })
            break;
        default:
            
                res.status(403).send([{error:"BAD REQUEST"}]);
            break;
    }
});
//permet de récupérer des informations sur le nombre d'artiste/album/musique
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
router.get('/modify/artist/:artistName/album/:albumName', function (req, res) {
    
    var albumName= req.params.albumName;
    var artistName = req.params.artistName;
    console.log("L'utilisateur veut modifier l'album "+albumName+" de l'artiste "+artistName);
    db.collection('artist').aggregate([       
               {"$match": {  $and:[{"name":artistName},{"albums.titre":albumName}] } },      
                {"$unwind": "$albums"},
                {"$match": {"albums.titre": albumName}}
            ],function(err, result) {
                if (err) throw err;
//                console.log(result[0]);
                res.send(JSON.stringify(result[0]));
            });
});
//Utiliser pour récupérer un album de la page album
router.get('/artist/:artistName/album/:albumName', function (req, res) {
    
    var albumName= req.params.albumName;
    var artistName = req.params.artistName;
    console.log("L'utilisateur veut afficher l'album "+albumName+" de l'artiste "+artistName);
    db.collection('artist').aggregate([       
                {"$match": {  $and:[{"name":artistName},{"albums.titre":albumName}] } },      
                {"$unwind": "$albums"},
                {"$match": {"albums.titre": albumName}},
            ],function(err, result) {
                if (err) throw err;
//                console.log(result[0]);
                res.send(JSON.stringify(result[0]));
            });
});


//permet l'update d'unalbum
router.put('/update/artist/:artistName/album/:albumName/oldalbum/:oldNameAlbum', function (req, res) {
    var album = req.body;
//    var _id = req.params._id;
    var oldNameAlbum= req.params.oldNameAlbum;
    var albumName= req.params.albumName;
    var artistName= req.params.artistName;
    console.log("Mise à jour de l'album "+ album.titre); 
    db.collection('artist').update(
        {
//            _id: ObjectId(_id),
            "name":artistName,
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
                console.log('Album Updated !');
            } 
        });
});

router.put("/modify/artist/:artistName/album/:albumsName/song/:titleSong",function(req,res){
        var titre = req.body;
        console.log(decodeURIComponent(titre));
        var artistName = req.params.artistName;
        var albumsName= req.params.albumsName;
        var titleSong= req.params.titleSong;
    db.getCollection('artist').aggregate([ 
                {"$match": {"$and":[ {"name":artistName},{"albums.titre":albumsName},{"albums.songs.titre":titleSong}]}   },
                // De-normalize le tableau pour sépérarer les documents
                {"$unwind": "$albums"},
                {"$unwind": "$albums.songs"},
                {"$match": {"$and":[ {"name":artistName},{"albums.titre":albumsName},{"albums.songs.titre":titleSong}]}   },
//                { $set: { "albums.songs.lyrics": } 
    ])
    
});

//permet de chercher des artistes via la barre de recherche
router.get('/artist/begin/:artistName', function (req, res) {
    var artistName = req.params.artistName;
    var regLetter = new RegExp(artistName,'i');
    console.log("L'utilisateur recherche un artiste commancant par les lettres: "+artistName);
    db.collection('artist').find({"name": regLetter},{"name":1}).limit(11).toArray(function(err,result){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

module.exports = router;
