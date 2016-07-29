var express         = require('express');
var router          = express.Router();
var config          = require('./conf/conf.json');
var lyricsWikia     = require('./handler/lyricsWikia.js');
var ObjectId        = require('mongoskin').ObjectID;
const fs            = require('fs');


//Permet de changer de page pour récupérer tout les noms d'artistes d'une catégorie (exemple catégorie des artistes commencant par la lettre A)        
//contient les liens des artistes de tout l'alphabet qui sont aussi les noms des répertoires sur le disque
var urlPageArtist = "http://lyrics.wikia.com/wiki/";//On construira l'url suivant : http://lyrics.wikia.com/wiki/nomArtiste


//Cette fonction met à jour les informations existantes dans la collection artist
router.get('/artist',function(req, res){
    var db = req.db;
    this.console.log("dedans /updatedb/artist");
    var skip = 0;
    var limit = 500;
    var total =0;
    //Permet de nommer la collection 
    var collection = config.database.collection_artist;
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
//Permet de mettre à jour les informations de l'artiste passé en parametre
router.get('/artist/:artistName',function(req, res){
    var db = req.db;
    var artistName = req.params.artistName
    var collection = config.database.collection_artist;
    //on récupére :artistName
    db.collection(collection).findOne({name:artistName}, function(err, result) {
        //on appel la fonction permettant d'aller chercher des informations sur l'artiste sur lyrics wikia
        //on récupère l'objet artist passé en parametre (result) avec les propriétés mis à jour
        //cette fonction update uniquement les propriétés de result elle ne renvoie pas un nouvel objet
        lyricsWikia.getInfosFromPageArtist(urlPageArtist,result).then(function(objArtist){
            console.log(objArtist);
            var idArtist = objArtist._id;
            //si _id n'est pas supprimé avant l'update, mongo lance un avertissement car un _id ne peut être modifié
            delete objArtist._id;
            //On met à jour l'artist avec les nouvelles propriétés
            db.collection(collection).update( { _id: new ObjectId(idArtist) },{ $set: objArtist }, function(err) {
                if (err) throw err;
                console.log("Updated => "+objArtist.name);
            });
        });
    });
    res.send("OK");
});


//Cette fonction met à jour les informations existantes dans la collection song
router.get('/song',function(req, res){
    var db = req.db;
    this.console.log("dedans /updatedb/song");
    var skip = 0;
    var limit = 1000;
    //Permet de nommer la collection
    var req = {};
    var collection = config.database.collection_song;
    db.collection(collection).find(req).count(function(err, nbSong) {
        console.log('There are ' + nbSong + ' song in the database');
        (function fetchSong(skip,nbSong){
            if(skip<nbSong){
                //on récupére les musiques
                db.collection(collection).find(req).skip(skip).limit(limit).toArray(function(err,result){
                    var i = 0;
                    //on itére sur les artistes récupérés avec une fonction récursive
                    (function loop(i,result){
                        //on appel la fonction permettant d'aller chercher des informations de la musique courrante sur lyrics wikia
                        //on récupère l'objet musique passé en parametre (result[i]) avec les propriétés mis à jour
                        //cette fonction update uniquement les propriétés de result[i] elle ne renvoie pas un nouvel objet
                        if(i<result.length){
                            //on traite uniquement les chansons sans urlYoutube
                            lyricsWikia.getInfosFromPageSong(result[i]).then(function(objSong){
                                var idSong = objSong._id;
                                //si _id n'est pas supprimé avant l'update, mongo lance un avertissement car un _id ne peut être modifié
                                delete objSong._id;
                                //On met à jour l'artist avec les nouvelles propriétés
                                db.collection(collection).update( { _id: new ObjectId(idSong) },{ $set: objSong }, function(err) {
                                    if (err) throw err;
                                    console.log(i+" => Updated => "+objSong.name+" : "+objSong.titre+"       "+objSong.urlSong);
                                });
                            }).catch(function() {
                                console.log("==================================================ERREUR : REJECT==================================================");
                                console.log(i);
                            });
                            setTimeout(function() {
                                i++;
                                loop(i,result);
                            },5);
                        }
                        else{
                            skip += limit;
                            console.log("\n\n\n\n !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! SKIP = "+skip+"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n\n\n");
                            setTimeout(function(){
                                fetchSong(skip,nbSong);
                            },6000);
                        }
                    })(i,result);
                });
            }
            else{
                console.log("MISE A JOUR TERMINEE");
            }
        })(skip,nbSong);
        res.send("OK");
    });
});


//Permet de mettre à jour les informations de la musique passé en parametre
// router.get('/song/:songName',function(req, res){
//     var db = req.db;
//     var songName = req.params.songName
//     var collection = config.database.collection_song;
//     //on récupére :songName
//     db.collection(collection).findOne({titre:songName}, function(err, result) {
//         //on appel la fonction permettant d'aller chercher des informations sur l'artiste sur lyrics wikia
//         //on récupère l'objet artist passé en parametre (result) avec les propriétés mis à jour
//         //cette fonction update uniquement les propriétés de result elle ne renvoie pas un nouvel objet
//         // lyricsWikia.getInfosFromPageArtist(urlPageArtist,result).then(function(objArtist){
//         lyricsWikia.getInfosFromPageArtist(urlPageArtist,result).then(function(objArtist){
//
//             console.log(objArtist);
//             var idArtist = objArtist._id;
//             //si _id n'est pas supprimé avant l'update, mongo lance un avertissement car un _id ne peut être modifié
//             delete objArtist._id;
//             //On met à jour l'artist avec les nouvelles propriétés
//             db.collection(collection).update( { _id: new ObjectId(idArtist) },{ $set: objArtist }, function(err) {
//                 if (err) throw err;
//                 console.log("Updated => "+objArtist.name);
//             });
//         });
//     });
//     res.send("OK");
// });


//Cette fonction ajoute et met à jour les liens des musiques possédant du multipiste(.mogg)
router.get('/multitrackspath',function(req, res){
    var db = req.db;
    this.console.log("dedans /updatedb/multitrackspath");
    const pathMultitracks = "E:/Multitracks downloadees/";
    var countTotal = 0, countTotalDir = 0, countRead = 0, countDirRead= 0;
    var collection = config.database.collection_song;
    //On cherche dans le dossier contenant les musiques multitracks
    fs.readdir(pathMultitracks, (err, files) =>{
        countTotalDir = files.length;
        for (var file of files) {
            (function(file){
                fs.readdir(pathMultitracks+file, (err, filesDir) =>{
                    countDirRead = countDirRead+1;
                    countTotal += filesDir.length;
                    for (var filedir of filesDir) {
                        (function(filedir){
                            countRead = countRead+1;
                            var countSepArtist_Title = (filedir.match(/(\s-\s)/g) || []).length;
                            //Si nous avons 0 ou plusieurs séparations avec un '-' dans "nom d'artiste - nom musique" (avec espace avant et après le '-')
                            if(countSepArtist_Title>1 || countSepArtist_Title ==0){
                                console.log(countSepArtist_Title+" : "+filedir);
                            }else{
                                var tfiledirSplitted= filedir.split(/(\s-\s)/g);
                                var musicTitle =tfiledirSplitted[0],artistName=tfiledirSplitted[1];
                                musicTitle = musicTitle.trim();
                                artistName = artistName.trim();
                                var req = {$and:[{titre: musicTitle},{name:artistName}]};
                                db.collection(collection).find(req).toArray(function(err,song){
                                    if(err){ console.error(err); }
                                    else{
                                        var addMultitrackpath = {multitrackpath:file+"/"+filedir} // correspond au chemin de la musique multitracks dans le projet
                                        console.log(addMultitrackpath);
                                    }

                                    // db.collection(collection).update(req,{ $set: addMultitrackpath }, function(err) {
                                    //     if (err) throw err;
                                    //     console.log(i+" => Add multitrackpath => "+song.name+" : "+song.titre+"       "+addMultitrackpath);
                                    // });
                                })
                            }
                            if(countTotal == countRead && countTotalDir == countDirRead){
                                console.log("countRead = "+countRead);
                            }
                        })(filedir)
                    }

                })
            })(file)
        }
        console.log()
        console.log(files);
        // => [Error: EISDIR: illegal operation on a directory, open <directory>]
    });


    //pour chaque nom d'artiste + nom musique récupérée on cherche son équivalent dans la base de données
        //si la musique a son équivalent dans la base de données alors on ajoute le chemin de cette musique a l'attribut multitrackpath
    //Permet de nommer la collection

    // db.collection(collection).find(req).skip(skip).limit(limit).toArray(function(err,song){
    //     var addMultitrackpath = {multitrackpath:""} // correspond au chemin de la musique multitracks dans le projet
    //     console.log(addMultitrackpath);
    //     // db.collection(collection).update(req,{ $set: addMultitrackpath }, function(err) {
    //     //     if (err) throw err;
    //     //     console.log(i+" => Add multitrackpath => "+song.name+" : "+song.titre+"       "+addMultitrackpath);
    //     // });
    // })
        res.send("OK");
});



module.exports = router;