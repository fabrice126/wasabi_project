var express         = require('express');
var router          = express.Router();
var lyricsWikia     = require('./handler/lyricsWikia.js');
var db              = require('mongoskin').db('mongodb://localhost:27017/wasabi');
var ObjectId        = require('mongoskin').ObjectID;



//Permet de changer de page pour récupérer tout les noms d'artistes d'une catégorie (exemple catégorie des artistes commencant par la lettre A)        
//contient les liens des artistes de tout l'alphabet qui sont aussi les noms des répertoires sur le disque
var selectorArtists = '#mw-pages>.mw-content-ltr>table a[href]';
var attrArtists = 'href';//on récupérera dans allLinks les href du selector ci-dessus afin de créer les répertoires
var removeStrHrefArtists = '/wiki/';
var urlPageArtist = "http://lyrics.wikia.com/wiki/";//On construira l'url suivant : http://lyrics.wikia.com/wiki/nomArtiste
var urlApiWikia = 'http://lyrics.wikia.com/api.php?func=getArtist&artist=';
//fera une mise à jour des champs de la collection artist

router.get('/artist',function(req, res){
    this.console.log("dedans /updatedb");
    
    //on récupère les artistes 500 par 500
    var skip = 0;
    var limit = 5;
    var total =0;
    db.collection('artist').count(function(err, nbArtist) {
        console.log('There are ' + nbArtist + ' artist in the database');

        (function fetchArtist(skip,nbArtist){
            if(skip<nbArtist){
                db.collection('artist').find({}).skip(skip).limit(limit).toArray(function(err,result){
                    var i = 0;
                    (function loop(i,result){
                        lyricsWikia.getInfosFromPageArtist(urlPageArtist,result[i]).then(function(objArtist){
                                var idArtist = objArtist._id;
                                delete objArtist._id;
//                                console.log(objArtist);
                                db.collection('artist').update( { _id: new ObjectId(idArtist) },{ $set: objArtist }, function(err) {
                                    if (err) throw err;
                                    console.log("Updated => "+objArtist.name);
                                    if(i<result.length){
                                        console.log("Continue ... " );
                                        //Pour ne pas surcharger les serveurs de lyrics wikia et éviter un ban 
                                        setTimeout(function(){ 
                                            loop(i,result);
                                        }, Math.floor((Math.random() * 10) + 100));
                                    }
                                    else{
                                        console.log("SKIP ...");
                                        skip += limit;
                                        console.log("\n\n SKIP = "+skip);
                                        setTimeout(function(){ 
                                            fetchArtist(skip,nbArtist);
                                        }, Math.floor((Math.random() * 10000) + 100));
                                    }
                                });
                            i++;
                        });
                    })(i,result);
                });
            }
            else{
                console.log("MISE A JOUR TERMINEE");
            }
        })(skip,nbArtist);
        res.send("OK");
        
    });
    
//Ajoute l'id de d'un document album dans les documents musiques de l'album
router.get('/addIdsAlbum',function(req, res){
    
});
//Ajoute l'id d'un document album dans chacun de des documents album de l'artiste et dans chacune de ses musiques de l'artiste
router.get('/addIdsArtist',function(req, res){
    
});

//    "member" : [ 
//        {
//            "name" : "James Hetfield",
//            "role" : "lead vocals, rhythm guitar",
//            "date" : "1981-present"
//        }, 
//        {
//            "name" : "Lars Ulrich",
//            "role" : "drums, percussion",
//            "date" : "1981-present"
//        }
//    ],
//    "formerMember" : [ 
//        {
//            "name" : "Dave Mustaine",
//            "role" : "lead guitar, backing vocals",
//            "date" : "1981-1983"
//        }, 
//        {
//            "name" : "Ron McGovney",
//            "role" : "bass",
//            "date" : "1981-1982"
//        }
//    ],


});


module.exports = router;