var express         = require('express');
var router          = express.Router();
var lyricsWikia     = require('./handler/lyricsWikia.js');
//var db              = require('mongoskin').db('mongodb://localhost:27017/wasabi');
var ObjectId        = require('mongoskin').ObjectID;


//Permet de changer de page pour récupérer tout les noms d'artistes d'une catégorie (exemple catégorie des artistes commencant par la lettre A)        
//contient les liens des artistes de tout l'alphabet qui sont aussi les noms des répertoires sur le disque
var selectorArtists = '#mw-pages>.mw-content-ltr>table a[href]';
var attrArtists = 'href';//on récupérera dans allLinks les href du selector ci-dessus afin de créer les répertoires
var removeStrHrefArtists = '/wiki/';
var urlPageArtist = "http://lyrics.wikia.com/wiki/";//On construira l'url suivant : http://lyrics.wikia.com/wiki/nomArtiste
var urlApiWikia = 'http://lyrics.wikia.com/api.php?func=getArtist&artist=';
//fera une mise à jour des champs de la collection artist


//Cette fonction met à jour les informations existantes dans la collection artist
router.get('/artist',function(req, res){
    var db = req.db;
    this.console.log("dedans /updatedb/artist");
    var skip = 0;
    var limit = 500;
    var total =0;
    var collection = "artist_copy";
    db.collection(collection).count(function(err, nbArtist) {
        console.log('There are ' + nbArtist + ' artist in the database');
        (function fetchArtist(skip,nbArtist){
            if(skip<nbArtist){
                //on récupére les artistes 500 par 500, result est donc un tableau de 500 artistes
                db.collection(collection).find({}).skip(skip).limit(limit).toArray(function(err,result){
                    var i = 0;
                    //on itére sur les artistes récupérés avec une fonction récursive
                    (function loop(i,result){
                        //on appel la fonction permettant d'aller chercher des informations sur l'artiste sur lyrics wikia
                        //on récupère l'objet artist passé en parametre (result[i]) avec les propriétés mis à jour
                        //cette fonction update uniquement les propriétés de result[i] elle ne renvoie pas un nouvel objet
                        lyricsWikia.getInfosFromPageArtist(urlPageArtist,result[i]).then(function(objArtist){ 
                            var idArtist = objArtist._id;
                            //si _id n'est pas supprimé avant l'update, mongo lance un avertissement car un _id ne peut être modifié
                            delete objArtist._id;
                            //On met à jour l'artist avec les nouvelles propriétés
                            db.collection(collection).update( { _id: new ObjectId(idArtist) },{ $set: objArtist }, function(err) {
                                if (err) throw err;
                                console.log("Updated => "+objArtist.name);
                                if(i<result.length){
                                    //Pour ne pas surcharger les serveurs de lyrics wikia et éviter un ban on attend x ms
                                    setTimeout(function(){
                                        //on incrémente i
                                        i++;
                                        loop(i,result);
                                    }, Math.floor((Math.random() * 10) + 100));
                                }
                                else{
                                    //on a traité tous les artistes contenus dans result
                                    //on ajout limit a skip afin de traiter les 500 données suivante dans la bdd
                                    skip += limit;
                                    console.log("\n\n SKIP = "+skip);
                                    setTimeout(function(){ 
                                        fetchArtist(skip,nbArtist);
                                    }, Math.floor((Math.random() * 10000) + 100));
                                }
                            });
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

});

module.exports = router;