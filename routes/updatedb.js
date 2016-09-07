var express             = require('express');
var router              = express.Router();
const config            = require('./conf/conf.json');
const lyricsWikia       = require('./handler/lyricsWikia.js');
const utilHandler       = require('./handler/utilHandler.js');
const ObjectId          = require('mongoskin').ObjectID;
const fs                = require('fs');
const os                = require('os');
const COLLECTIONARTIST  = config.database.collection_artist;
const COLLECTIONALBUM   = config.database.collection_album;
const COLLECTIONSONG    = config.database.collection_song;

//Permet de changer de page pour récupérer tout les noms d'artistes d'une catégorie (exemple catégorie des artistes commencant par la lettre A)        
//contient les liens des artistes de tout l'alphabet qui sont aussi les noms des répertoires sur le disque
const URLPAGEARTIST = "http://lyrics.wikia.com/wiki/";//On construira l'url suivant : http://lyrics.wikia.com/wiki/artistName

//Cette fonction met à jour les informations existantes dans la collection artist
router.get('/artist',function(req, res){
    var db = req.db, skip = 0, limit = 500;
    this.console.log("dedans /updatedb/artist");
    db.collection(COLLECTIONARTIST).count(function(err, nbArtist) {
        console.log('There are ' + nbArtist + ' artist in the database');
        (function fetchArtist(skip,nbArtist){
            if(skip<nbArtist){
                //on récupére les artistes 500 par 500, result est donc un tableau de 500 artistes
                db.collection(COLLECTIONARTIST).find({}).skip(skip).limit(limit).toArray(function(err,result){
                    var i = 0;
                    //on itére sur les artistes récupérés avec une fonction récursive
                    (function loop(i,result){
                        //on appel la fonction permettant de chercher des informations sur l'artiste sur lyrics wikia
                        //on récupère l'objet artist passé en parametre (result[i]) avec les propriétés mis à jour
                        //cette fonction update uniquement les propriétés de result[i] elle ne renvoie pas un nouvel objet
                        lyricsWikia.getInfosFromPageArtist(URLPAGEARTIST,result[i]).then(function(objArtist){
                            var idArtist = objArtist._id;
                            //si _id n'est pas supprimé avant l'update, mongo lance un avertissement car un _id ne peut être modifié
                            delete objArtist._id;
                            //On met à jour l'artist avec les nouvelles propriétés
                            db.collection(COLLECTIONARTIST).update( { _id: new ObjectId(idArtist) },{ $set: objArtist }, function(err) {
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
                                    //on ajout limit a skip afin de traiter les 500 données suivantes dans la bdd
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
    var db = req.db, artistName = req.params.artistName;
    //on récupére :artistName
    db.collection(COLLECTIONARTIST).findOne({name:artistName}, function(err, result) {
        //on appel la fonction permettant d'aller chercher des informations sur l'artiste sur lyrics wikia
        //on récupère l'objet artist passé en parametre (result) avec les propriétés mis à jour
        //cette fonction update uniquement les propriétés de result elle ne renvoie pas un nouvel objet
        lyricsWikia.getInfosFromPageArtist(URLPAGEARTIST,result).then(function(objArtist){
            var idArtist = objArtist._id;
            //si _id n'est pas supprimé avant l'update, mongo lance un avertissement car un _id ne peut être modifié
            delete objArtist._id;
            //On met à jour l'artist avec les nouvelles propriétés
            db.collection(COLLECTIONARTIST).update( { _id: new ObjectId(idArtist) },{ $set: objArtist }, function(err) {
                if (err) throw err;
                console.log("Updated => "+objArtist.name);
            });
        });
    });
    res.send("OK");
});


//Cette fonction met à jour les informations existantes dans la collection song
router.get('/song',function(req, res){
    var db = req.db, skip = 0, limit = 1000, req = {};
    this.console.log("dedans /updatedb/song");
    db.collection(COLLECTIONSONG).find(req).count(function(err, nbSong) {
        console.log('There are ' + nbSong + ' song in the database');
        (function fetchSong(skip,nbSong){
            if(skip<nbSong){
                //on récupére les musiques
                db.collection(COLLECTIONSONG).find(req).skip(skip).limit(limit).toArray(function(err,result){
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
                                db.collection(COLLECTIONSONG).update( { _id: new ObjectId(idSong) },{ $set: objSong }, function(err) {
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
//     var db = req.db, songName = req.params.songName
//     //on récupére :songName
//     db.collection(COLLECTIONSONG).findOne({titre:songName}, function(err, result) {
//         //on appel la fonction permettant d'aller chercher des informations sur l'artiste sur lyrics wikia
//         //on récupère l'objet artist passé en parametre (result) avec les propriétés mis à jour
//         //cette fonction update uniquement les propriétés de result elle ne renvoie pas un nouvel objet
//         // lyricsWikia.getInfosFromPageArtist(URLPAGEARTIST,result).then(function(objArtist){
//         lyricsWikia.getInfosFromPageArtist(URLPAGEARTIST,result).then(function(objArtist){
//
//             console.log(objArtist);
//             var idArtist = objArtist._id;
//             //si _id n'est pas supprimé avant l'update, mongo lance un avertissement car un _id ne peut être modifié
//             delete objArtist._id;
//             //On met à jour l'artist avec les nouvelles propriétés
//             db.collection(COLLECTIONSONG).update( { _id: new ObjectId(idArtist) },{ $set: objArtist }, function(err) {
//                 if (err) throw err;
//                 console.log("Updated => "+objArtist.name);
//             });
//         });
//     });
//     res.send("OK");
// });


//Cette fonction ajoute et met à jour les liens des musiques possédant du multipiste(.mogg)
router.get('/multitrackspath',function(req, res){
    this.console.log("dedans /updatedb/multitrackspath");
    this.console.log("TEST MISE A JOUR");
    var db = req.db, PATHMULTITRACKS = config.multitracks.path_linux,totalFilesDirLength = 0, countFilesDir = 0;
    console.log(PATHMULTITRACKS);
    (os.platform() == 'win32')? PATHMULTITRACKS = config.multitracks.path_windows : PATHMULTITRACKS = config.multitracks.path_linux;
    console.log(PATHMULTITRACKS);
    //On cherche dans le dossier contenant les musiques multitracks
    console.log("En cours de traitement ...");
    fs.readdir(PATHMULTITRACKS, (err, directories) =>{
        for (var dir of directories) {
            (function(dir){
                fs.readdir(PATHMULTITRACKS+dir, (err, filesDir) =>{
                    //exemple filedir = Twisted Sister - We're Not Gonna Take It.mogg
                    for (var filedir of filesDir) {
                        (function(filedir){
                            //filedir est encodé on le decode :
                            filedir = utilHandler.decodePathWindows(filedir);
                            var countSepArtist_Title = (filedir.match(/(\s-\s)/g) || []).length;
                            // nous devons avoir 1 seul ' - ' afin de bien délimiter l'artiste du titre de musique
                            if(countSepArtist_Title!=1 ){
                                console.log(countSepArtist_Title+" : "+filedir);
                            }else{
                                var tfiledirSplitted= filedir.split(' - ');// /(\s-\s)/g
                                var artistName = tfiledirSplitted[0].trim(), musicTitle = tfiledirSplitted[1].trim().replace(/\.mogg$/, "").trim().replace(/(\(live\))$/i, "").trim(), tQuery = [];
                                // Les featuring sont de type : Artiste 1 _&_ Artiste 2 - Nom musique
                                //ainsi on peut lancer deux requêtes via ce featuring : Artiste 1 - Nom musique, Artiste 2 - Nom musique afin d'ajouter aux deux artistes le chemin de la musique
                                if(artistName.indexOf("_&_") !== -1){
                                    var tfiledirSplitted= filedir.split(' - ');// /(\s-\s)/g
                                    var tArtistName= tfiledirSplitted[0].split('_&_');
                                    for(var i=0, l = tArtistName.length ; i<l;i++){
                                        tQuery.push({$and:[{ name: tArtistName[i].trim()}, {titre:musicTitle} ]});
                                    }
                                }
                                else{
                                    tQuery.push({$and:[{ name: artistName}, {titre:musicTitle} ]});
                                }
                                totalFilesDirLength += tQuery.length;
                                for(var i=0, l = tQuery.length ; i<l;i++) {
                                    /*Si l'artiste ou la musique n'est pas trouvé on doit modifier le nom dans le répertoire afin de matcher avec la bdd*/
                                    db.collection(COLLECTIONSONG).find(tQuery[i]).toArray(function(err,tSongs){
                                        if (err) throw err;
                                        if(tSongs.length ==0){
                                            console.log(artistName+" - "+musicTitle+" - non trouvé en base de données");
                                        }
                                        else{
                                            var addMultitrackpath;
                                            if(filedir.trim().endsWith('.mogg')){
                                                addMultitrackpath = {multitrack_file:dir+"/"+utilHandler.encodePathWindows(artistName+' - '+musicTitle)+".mogg"} // correspond au chemin de la musique multitracks .mogg dans le projet
                                            }
                                            else{
                                                addMultitrackpath = {multitrack_path:dir+"/"+utilHandler.encodePathWindows(filedir)} // correspond au chemin du dossier contenant des .ogg ou .mp3 dans le projet
                                            }
                                            var query = {$and:[{name:tSongs[0].name},{titre:tSongs[0].titre}]};
                                            db.collection(COLLECTIONSONG).update(query,{ $set: addMultitrackpath },{multi:true}, function(err) {
                                                if (err) throw err;
                                            });
                                        }
                                        countFilesDir = countFilesDir+1;
                                        if(countFilesDir%100 ==0){
                                            console.log("En cours ... "+countFilesDir+"/"+totalFilesDirLength)
                                        }
                                        if(countFilesDir == totalFilesDirLength){
                                            console.log("Traitement terminé: "+countFilesDir+"/"+totalFilesDirLength);
                                        }
                                    });
                                }
                            }
                        })(filedir)
                    }
                })
            })(dir)
        }
    });
    res.send("OK");
});

//A SUPPRIMER -> cette fonction est la recopie de celle du dessus afin de réaliser un test
// router.get('/multitrackspathMT5Michel',function(req, res){
//     this.console.log("dedans /updatedb/multitrackspath");
//     var db = req.db, PATHMULTITRACKS = "E:/multitrack Michel MT5";
//     //On cherche dans le dossier contenant les musiques multitracks
//     fs.readdir(PATHMULTITRACKS, (err, filesDir) =>{
//         //exemple filedir = Twisted Sister - We're Not Gonna Take It.mogg
//         for (var filedir of filesDir) {
//             (function(filedir){
//                 //filedir est encodé on le decode :
//                 filedir = utilHandler.decodePathWindows(filedir);
//                 var countSepArtist_Title = (filedir.match(/(\s-\s)/g) || []).length;
//                 // nous devons avoir 1 seul ' - ' afin de bien délimiter l'artiste du titre de musique
//                 if(countSepArtist_Title!=1 ){
//                     console.log(countSepArtist_Title+" : "+filedir);
//                 }else{
//                     var tfiledirSplitted= filedir.split(' - ');// /(\s-\s)/g
//                     var artistName = tfiledirSplitted[0].trim(), musicTitle = tfiledirSplitted[1].trim().replace(/\.mogg$/, "").trim().replace(/(\(live\))$/i, "").trim(), tQuery = [];
//                     // Les featuring sont de type : Artiste 1 _&_ Artiste 2 - Nom musique
//                     //ainsi on peut lancer deux requêtes via ce featuring : Artiste 1 - Nom musique, Artiste 2 - Nom musique afin d'ajouter aux deux artistes le chemin de la musique
//                     if(artistName.indexOf("_&_") !== -1){
//                         var tfiledirSplitted= filedir.split(' - ');// /(\s-\s)/g
//                         var tArtistName= tfiledirSplitted[0].split('_&_');
//                         for(var i=0, l = tArtistName.length ; i<l;i++){
//                             tQuery.push({$and:[{ name: tArtistName[i].trim()}, {titre:musicTitle} ]});
//                         }
//                     }
//                     else{
//                         tQuery.push({$and:[{ name: artistName}, {titre:musicTitle} ]});
//                     }
//                     for(var i=0, l = tQuery.length ; i<l;i++) {
//                         /*Si l'artiste ou la musique n'est pas trouvé on doit modifier le nom dans le répertoire afin de matcher avec la bdd*/
//                         db.collection(COLLECTIONSONG).find(tQuery[i]).toArray(function(err,tSongs){
//                             if (err) throw err;
//                             if(tSongs.length ==0){
//                                 console.log(artistName+" - "+musicTitle+" - non trouvé en base de données");
//                             }
//                         })
//                     }
//                 }
//             })(filedir)
//         }
//     });
//     res.send("OK");
// });

module.exports = router;