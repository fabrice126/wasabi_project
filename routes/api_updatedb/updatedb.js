import express from 'express';
import config from '../conf/conf';
import lyricsWikia from '../handler/lyricsWikia.js';
import utilHandler from '../handler/utilHandler.js';
import languageDetectHandler from './languagedetect.controller.js';
import wordCountController from './wordcount.controller.js';
import musicBrainzController from './musicbrainz.controller.js';
import discogsController from './discogs.controller.js';
import deezerController from './deezer.controller.js';
import animuxController from './animux.controller.js';
import equipBoardController from './equipboard.controller.js';
import statsController from './stats.controller.js';
import lyricsWikiaController from './lyricswikia.controller.js'
import {
    ObjectId
} from 'mongoskin';
import fs from 'fs';
import os from 'os';

const router = express.Router();
const COLLECTIONARTIST = config.database.collection_artist;
const COLLECTIONALBUM = config.database.collection_album;
const COLLECTIONSONG = config.database.collection_song;



//Cette fonction met à jour les informations existantes dans la collection artist
router.get('/artist', function (req, res) {
    var db = req.db,
        skip = 0,
        limit = 500;
    console.log("dedans /updatedb/artist");
    db.collection(COLLECTIONARTIST).count(function (err, nbArtist) {
        console.log('There are ' + nbArtist + ' artist in the database');
        (function fetchArtist(skip, nbArtist) {
            var nb = 0;
            if (skip < nbArtist) {
                //on récupére les artistes 500 par 500, result est donc un tableau de 500 artistes
                db.collection(COLLECTIONARTIST).find({}).skip(skip).limit(limit).toArray(function (err, result) {
                    var i = 0;
                    //on itére sur les artistes récupérés avec une fonction récursive
                    (function loop(i, result) {
                        //on appel la fonction permettant de chercher des informations sur la page des artistes de lyrics wikia
                        //on récupère l'objet artist passé en parametre (result[i]) avec les propriétés mis à jour
                        lyricsWikia.getInfosFromPageArtist(result[i]).then(function (objArtist) {
                            var idArtist = objArtist._id;
                            //si _id n'est pas supprimé avant l'update, mongo lance un avertissement car un _id ne peut être modifié
                            // delete objArtist._id;
                            //On met à jour l'artist avec les nouvelles propriétés
                            db.collection(COLLECTIONARTIST).update({
                                _id: new ObjectId(idArtist)
                            }, {
                                $set: objArtist
                            }, function (err) {
                                if (err) throw err;
                                nb++;
                                console.log("Updated => " + objArtist.name);
                                if (nb == result.length) {
                                    skip += limit;
                                    console.log("\n\n SKIP = " + skip);
                                    fetchArtist(skip, nbArtist);
                                }
                            });
                        });
                        if (i < result.length - 1) {
                            i++;
                            loop(i, result);
                        }
                    })(i, result);
                });
            } else {
                console.log("MISE A JOUR TERMINEE");
            }
        })(skip, nbArtist);
        res.send("OK");
    });
});
//Permet de mettre à jour les informations de l'artiste passé en parametre
router.get('/artist/:artistName', function (req, res) {
    var db = req.db,
        artistName = req.params.artistName;
    db.collection(COLLECTIONARTIST).findOne({
        name: artistName
    }, function (err, result) {
        //on appel la fonction permettant d'aller chercher des informations sur l'artiste sur lyrics wikia
        //on récupère l'objet artist passé en parametre (result) avec les propriétés mis à jour
        lyricsWikia.getInfosFromPageArtist(result).then(function (objArtist) {
            var idArtist = objArtist._id;
            //si _id n'est pas supprimé avant l'update, mongo lance un avertissement car un _id ne peut être modifié
            delete objArtist._id;
            //On met à jour l'artist avec les nouvelles propriétés
            db.collection(COLLECTIONARTIST).update({
                _id: new ObjectId(idArtist)
            }, {
                $set: objArtist
            }, function (err) {
                if (err) throw err;
                console.log("Updated => " + objArtist.name);
            });
        });
    });
    res.send("OK");
});
//Cette fonction met à jour les informations existantes dans la collection album
router.get('/album', function (req, res) {
    var db = req.db,
        skip = 0,
        limit = 500;
    console.log("dedans /updatedb/album");
    db.collection(COLLECTIONALBUM).count(function (err, nbAlbum) {
        console.log('There are ' + nbAlbum + ' album in the database');
        (function fetchAlbum(skip, nbAlbum) {
            var nb = 0;
            if (skip < nbAlbum) {
                //on récupére les albums 500 par 500, result est donc un tableau de 500 albums
                db.collection(COLLECTIONALBUM).find({}).skip(skip).limit(limit).toArray(function (err, result) {
                    var i = 0;
                    //on itére sur les albums récupérés avec une fonction récursive
                    (function loop(i, result) {
                        //on appel la fonction permettant de chercher des informations sur la page des albums de lyrics wikia
                        //on récupère l'objet album passé en parametre (result[i]) avec les propriétés mis à jour
                        lyricsWikia.getInfosFromPageAlbum(result[i]).then(function (objAlbum) {
                            var idAlbum = objAlbum._id;
                            //si _id n'est pas supprimé avant l'update, mongo lance un avertissement car un _id ne peut être modifié
                            delete objAlbum._id;
                            //On met à jour l'artist avec les nouvelles propriétés
                            db.collection(COLLECTIONALBUM).update({
                                _id: new ObjectId(idAlbum)
                            }, {
                                $set: objAlbum
                            }, function (err) {
                                if (err) console.log(err);
                                nb++;
                                console.log("Updated => " + objAlbum.name + " - " + objAlbum.title + "   " + nb + "/" + result.length);
                                if (nb == result.length) {
                                    skip += limit;
                                    console.log("\n\n SKIP = " + skip);
                                    fetchAlbum(skip, nbAlbum);
                                }
                            });
                        });
                        if (i < result.length - 1) {
                            i++;
                            loop(i, result);
                        }
                    })(i, result);
                });
            } else {
                console.log("MISE A JOUR TERMINEE");
            }
        })(skip, nbAlbum);
        res.send("OK");
    });
});
//Permet de mettre à jour les informations de l'album passé en parametre
router.get('/album/:idAlbum', function (req, res) {
    var db = req.db,
        idAlbum = req.params.idAlbum;
    if (!ObjectId.isValid(idAlbum)) {
        return res.status(404).json(config.http.error.objectid_404);
    }
    db.collection(COLLECTIONALBUM).findOne({
        _id: new ObjectId(idAlbum)
    }, function (err, result) {
        //on appel la fonction permettant d'aller chercher des informations sur l'album sur lyrics wikia
        //on récupère l'objet album passé en parametre (result) avec les propriétés mis à jour
        lyricsWikia.getInfosFromPageAlbum(result).then(function (objAlbum) {
            var idAlbum = objAlbum._id;
            //si _id n'est pas supprimé avant l'update, mongo lance un avertissement car un _id ne peut être modifié
            delete objAlbum._id;
            //On met à jour l'artist avec les nouvelles propriétés
            db.collection(COLLECTIONALBUM).update({
                _id: new ObjectId(idAlbum)
            }, {
                $set: objAlbum
            }, function (err) {
                if (err) throw err;
                console.log("Updated => " + objAlbum.name + " - " + objAlbum.title);
            });
        });
    });
    res.json("OK");
});
//Cette fonction met à jour les informations existantes dans la collection song
router.get('/song', function (req, res) {
    var db = req.db,
        skip = 0,
        limit = 1000,
        query = {};
    console.log("dedans /updatedb/song");
    db.collection(COLLECTIONSONG).find(query).count(function (err, nbSong) {
        console.log('There are ' + nbSong + ' song in the database');
        (function fetchSong(skip, nbSong) {
            var nbSongUpdated = 0;
            if (skip < nbSong) {
                //on récupére les musiques
                db.collection(COLLECTIONSONG).find(query).skip(skip).limit(limit).toArray(function (err, result) {
                    var i = 0;
                    //on itére sur les artistes récupérés avec une fonction récursive
                    (function loop(i, result) {
                        //on appel la fonction permettant d'aller chercher des informations de la musique courrante sur lyrics wikia
                        //on récupère l'objet musique passé en parametre (result[i]) avec les propriétés mis à jour
                        //cette fonction update uniquement les propriétés de result[i] elle ne renvoie pas un nouvel objet
                        if (i < result.length) {
                            //on traite uniquement les chansons sans urlYouTube
                            lyricsWikia.getInfosFromPageSong(result[i]).then(function (objSong) {
                                var idSong = objSong._id;
                                //si _id n'est pas supprimé avant l'update, mongo lance un avertissement car un _id ne peut être modifié
                                delete objSong._id;
                                //On met à jour l'artist avec les nouvelles propriétés
                                db.collection(COLLECTIONSONG).update({
                                    _id: new ObjectId(idSong)
                                }, {
                                    $set: objSong
                                }, function (err) {
                                    nbSongUpdated++;
                                    if (err) throw err;
                                    console.log(i + " => Updated => " + objSong.name + " : " + objSong.title + "       " + objSong.urlSong);
                                    if (nbSongUpdated == limit) {
                                        skip += limit;
                                        console.log("\n\n\n\n !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! SKIP = " + skip + "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n\n\n");
                                        fetchSong(skip, nbSong);
                                    }
                                });
                            }).catch(function () {
                                // console.log("==================================================ERREUR : REJECT==================================================");
                                nbSongUpdated++;
                                if (nbSongUpdated == limit) {
                                    skip += limit;
                                    console.log("\n\n\n\n !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! SKIP = " + skip + "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n\n\n");
                                    fetchSong(skip, nbSong);
                                }
                            });
                            setTimeout(function () {
                                i++;
                                loop(i, result);
                            }, 55);
                        }
                    })(i, result);
                });
            } else {
                console.log("MISE A JOUR TERMINEE");
            }
        })(skip, nbSong);
        res.send("OK");
    });
});


//Permet de mettre à jour les informations de la musique passé en parametre
// router.get('/song/:songName',function(req, res){
//     var db = req.db, songName = req.params.songName
//     //on récupére :songName
//     db.collection(COLLECTIONSONG).findOne({title:songName}, function(err, result) {
//         //on appel la fonction permettant d'aller chercher des informations sur l'artiste sur lyrics wikia
//         //on récupère l'objet artist passé en parametre (result) avec les propriétés mis à jour
//         //cette fonction update uniquement les propriétés de result elle ne renvoie pas un nouvel objet
//         // lyricsWikia.getInfosFromPageArtist(result).then(function(objArtist){
//         lyricsWikia.getInfosFromPageArtist(result).then(function(objArtist){
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
router.get('/multitrackspath', function (req, res) {
    console.log("dedans /updatedb/multitrackspath");
    console.log("TEST MISE A JOUR");
    var db = req.db,
        PATHMULTITRACKS = config.multitracks.path_linux,
        totalFilesDirLength = 0,
        countFilesDir = 0;
    console.log(PATHMULTITRACKS);
    (os.platform() == 'win32') ? PATHMULTITRACKS = config.multitracks.path_windows: PATHMULTITRACKS = config.multitracks.path_linux;
    console.log(PATHMULTITRACKS);
    //On cherche dans le dossier contenant les musiques multitracks
    console.log("En cours de traitement ...");
    fs.readdir(PATHMULTITRACKS, (err, directories) => {
        for (var dir of directories) {
            (function (dir) {
                fs.readdir(PATHMULTITRACKS + dir, (err, filesDir) => {
                    //exemple filedir = Twisted Sister - We're Not Gonna Take It.mogg
                    for (var filedir of filesDir) {
                        (function (filedir) {
                            //filedir est encodé on le decode :
                            filedir = utilHandler.decodePathWindows(filedir);
                            var countSepArtist_Title = (filedir.match(/(\s-\s)/g) || []).length;
                            // nous devons avoir 1 seul ' - ' afin de bien délimiter l'artiste du title de musique
                            if (countSepArtist_Title != 1) {
                                console.log(countSepArtist_Title + " : " + filedir);
                            } else {
                                var tfiledirSplitted = filedir.split(' - '); // /(\s-\s)/g
                                var artistName = tfiledirSplitted[0].trim(),
                                    musicTitle = tfiledirSplitted[1].trim().replace(/\.mogg$/, "").trim().replace(/(\(live\))$/i, "").trim(),
                                    tQuery = [];
                                // Les featuring sont de type : Artiste 1 _&_ Artiste 2 - Nom musique
                                //ainsi on peut lancer deux requêtes via ce featuring : Artiste 1 - Nom musique, Artiste 2 - Nom musique afin d'ajouter aux deux artistes le chemin de la musique
                                if (artistName.indexOf("_&_") !== -1) {
                                    var tfiledirSplitted = filedir.split(' - '); // /(\s-\s)/g
                                    var tArtistName = tfiledirSplitted[0].split('_&_');
                                    for (var i = 0, l = tArtistName.length; i < l; i++) {
                                        tQuery.push({
                                            $and: [{
                                                name: tArtistName[i].trim()
                                            }, {
                                                title: musicTitle
                                            }]
                                        });
                                    }
                                } else {
                                    tQuery.push({
                                        $and: [{
                                            name: artistName
                                        }, {
                                            title: musicTitle
                                        }]
                                    });
                                }
                                totalFilesDirLength += tQuery.length;
                                for (var i = 0, l = tQuery.length; i < l; i++) {
                                    /*Si l'artiste ou la musique n'est pas trouvé on doit modifier le nom dans le répertoire afin de matcher avec la bdd*/
                                    db.collection(COLLECTIONSONG).find(tQuery[i]).toArray(function (err, tSongs) {
                                        if (err) throw err;
                                        if (tSongs.length == 0) {
                                            console.log(artistName + " - " + musicTitle + " - non trouvé en base de données");
                                        } else {
                                            var addMultitrackpath;
                                            if (filedir.trim().endsWith('.mogg')) {
                                                addMultitrackpath = {
                                                    multitrack_file: dir + "/" + utilHandler.encodePathWindows(artistName + ' - ' + musicTitle) + ".mogg"
                                                } // correspond au chemin de la musique multitracks .mogg dans le projet
                                            } else {
                                                addMultitrackpath = {
                                                    multitrack_path: dir + "/" + utilHandler.encodePathWindows(filedir)
                                                } // correspond au chemin du dossier contenant des .ogg ou .mp3 dans le projet
                                            }
                                            var query = {
                                                $and: [{
                                                    name: tSongs[0].name
                                                }, {
                                                    title: tSongs[0].title
                                                }]
                                            };
                                            db.collection(COLLECTIONSONG).update(query, {
                                                $set: addMultitrackpath
                                            }, {
                                                multi: true
                                            }, function (err) {
                                                if (err) throw err;
                                            });
                                        }
                                        countFilesDir = countFilesDir + 1;
                                        if (countFilesDir % 100 == 0) {
                                            console.log("En cours ... " + countFilesDir + "/" + totalFilesDirLength)
                                        }
                                        if (countFilesDir == totalFilesDirLength) {
                                            console.log("Traitement terminé: " + countFilesDir + "/" + totalFilesDirLength);
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

//Cette fonction réalise le word count pour le document ayant l'id :_id dans la collection :collection
router.get('/wordcount/:collection/:_id', function (req, res) {
    var db = req.db,
        collection = req.params.collection,
        id = req.params._id,
        query = {};
    if (!ObjectId.isValid(id)) return res.status(404).json(config.http.error.objectid_404);
    console.log("Traitement du document " + collection + " ayant l'id=" + id);
    if (collection != COLLECTIONARTIST && collection != COLLECTIONALBUM && collection != COLLECTIONSONG) {
        return res.status(404).send(config.http.error.global_404);
    }
    db.collection(collection).findOne({
        _id: ObjectId(id)
    }, function (err, obj) {
        if (obj === null) return res.status(404).send(config.http.error.global_404);
        if (collection == COLLECTIONARTIST) query.name = obj.name;
        else if (collection == COLLECTIONALBUM) query.id_album = obj._id
        else query._id = obj._id
        var collectionTmp = 'word_count_by_lyrics_tmp';
        db.collection(COLLECTIONSONG).mapReduce(wordCountController.map, wordCountController.reduce, {
            query: query,
            out: collectionTmp
        }, (err, results) => {
            if (results === null) return res.status(404).send(config.http.error.global_404);
            var currentWordCountSong = [];
            db.collection(collectionTmp).find({}).sort({
                value: -1
            }).toArray((err, word) => {
                if (obj === null) return res.status(404).send(config.http.error.global_404);
                for (var i = 0, l = word.length; i < l; i++) currentWordCountSong.push(word[i]);
                db.collection("_word_count_" + collection).update({
                    _id: obj._id
                }, {
                    $set: {
                        "_id": obj._id,
                        "wordCount": currentWordCountSong
                    }
                }, {
                    upsert: true
                }, (resultat) => {
                    console.log("le word count pour la collection: " + collection + " est terminé");
                    db.collection(collectionTmp).drop();
                    return res.send("OK");
                });
            });
        });
    });
});

//Cette fonction permet de définir si la musique passé en paramètre est un classic
router.get('/song/isclassic/:_id', function (req, res) {
    var db = req.db,
        id = req.params._id;
    if (!ObjectId.isValid(id)) {
        return res.status(404).json(config.http.error.objectid_404);
    }
    db.collection(COLLECTIONSONG).update({
        $and: [{
            _id: ObjectId(id)
        }, {
            $or: [{
                subject: /best/i
            }, {
                subject: /award/i
            }, {
                subject: /Hall_of_fame/i
            }, {
                subject: /diamond/i
            }, {
                subject: /platinum/i
            }, {
                subject: /gold/i
            }, {
                subject: /hot_100/i
            }]
        }]
    }, {
        $set: {
            isClassic: true
        }
    });
    console.log("Traiement terminé");
    res.send("OK");
});
/**
 * /!\ Pour utiliser cette API il faut que la VM musicbrainz soit active sur:  http://127.0.0.1:5000/ /!\
 */
router.get('/musicbrainz/artist', musicBrainzController.getAllArtists);
/**
 * /!\ Pour utiliser cette API il faut que la VM musicbrainz soit active sur:  http://127.0.0.1:5000/ /!\
 */
router.get('/musicbrainz/artist/id/:_id', musicBrainzController.getArtist);
/**
 * /!\ Pour utiliser cette API il faut que la VM musicbrainz soit active sur:  http://127.0.0.1:5000/ /!\
 */
router.get('/musicbrainz/artist/member', musicBrainzController.getAllArtistsMembers);
/**
 * /!\ Pour utiliser cette API il faut que la VM musicbrainz soit active sur:  http://127.0.0.1:5000/ /!\
 */
router.get('/musicbrainz/album', musicBrainzController.getAllAlbums);
/**
 * /!\ Pour utiliser cette API il faut que la VM musicbrainz soit active sur:  http://127.0.0.1:5000/ /!\
 */
router.get('/musicbrainz/album/id/:_id', musicBrainzController.getAlbum);
/**
 * /!\ Pour utiliser cette API il faut que la VM musicbrainz soit active sur:  http://127.0.0.1:5000/ /!\
 */
router.get('/musicbrainz/song', musicBrainzController.getAllSongs);
/**
 * /!\ Pour utiliser cette API il faut que la VM musicbrainz soit active sur:  http://127.0.0.1:5000/ /!\
 */
router.get('/musicbrainz/song/id/:_id', musicBrainzController.getSong);



/**
 * API permettant de recupérer des informations sur les artistes présents sur l'API de discogs
 */
router.get('/discogs/artist', discogsController.getAllArtists);
/**
 * API permettant d'ajouter des champs a discogs à chaque membre de groupe
 */
router.get('/discogs/artist/members', discogsController.getAllArtistsMembers);
/**
 * API permettant de créer le champ id_artist_discogs contenant l'id vers discogs
 */
router.get('/discogs/add/artist/id', discogsController.getAddFieldsIdArtistDiscogs);
/**
 * API permettant de créer le champ id_album_discogs contenant l'id vers discogs
 */
router.get('/discogs/add/album/id', discogsController.getAddFieldsIdAlbumDiscogs);
/**
 * API permettant de créer le champ members[i].id_member_discogs contenant l'id vers discogs des membres d'un groupe
 */
router.get('/discogs/add/artist/members/id', discogsController.getAddFieldsIdMemberDiscogs);
/**
 * API permettant de recupérer des informations sur les albums présents sur l'API de discogs
 */
router.get('/discogs/album', discogsController.getAllAlbums);




/**
 * 1 - API permettant d'ajouter en base de données l'id des musiques de wasabi avec les id des musiques de deezer
 */
router.get('/deezer/create_mapping', deezerController.doMappingWasabiDeezer);
/**
 * 2 - API permettant de recupérer des informations sur les musiques présent sur l'API de deezer
 */
router.get('/deezer/song', deezerController.getAllSongs);
/**
 * API permettant de recupérer des informations de la musique sur l'API de deezer
 */
router.get('/deezer/song/:_id', deezerController.getSong);
/**
 * 3 - API permettant de vérifier que pour un artist donné chaque champs id_artist_deezer contenu dans les musiques de l'artiste est identique
 * Il faut donc que chaque musique d'un artiste ait le même id_artist_deezer
 */
router.get('/deezer/check_and_update_id/artist', deezerController.checkAndUpdateIdArtist);
/**
 * 4 - API permettant de recupérer des informations sur les artistes présent sur l'API de deezer
 */
router.get('/deezer/artist', deezerController.getAllArtists);
/**
 * 5 - API permettant de vérifier que pour un album donné chaque champs id_album_deezer contenu dans les musiques de l'album est identique
 * Il faut donc que chaque musique d'un album ait le même id_album_deezer
 */
router.get('/deezer/check_and_update_id/album', deezerController.checkAndUpdateIdAlbum);
/**
 * 6 - API permettant de recupérer des informations sur les albums présent sur l'API de deezer
 */
router.get('/deezer/album', deezerController.getAllAlbums);



/**
 *  launch this command in console to use tor to extract equipboard's data: tor --controlport 9051
 */
router.get('/equipboard/try_tor', equipBoardController.tryTor);
router.get('/equipboard/add/artist/members/url_equipboard', equipBoardController.getCreateLinkEquipBoard);
router.get('/equipboard/artist/equipment', equipBoardController.getAllEquipmentBoard);
router.get('/equipboard/artist/equipment/description', equipBoardController.getAllEquipmentDescription);





/**
 * API permettant de rename les noms d'artistes animux avec les noms d'artistes wasabi afin d'utiliser 
 * dans /animux/create_mapping/artist un find sans regex pour améliorer les performances
 */
router.get('/animux/sanitize_rename/artist', animuxController.sanitizeAndRenameDirArtist);
/**
 * API permettant de faire le matching entre les dossiers contenant le nom d'un artiste/groupe
 */
router.get('/animux/create_mapping/artist', animuxController.getDirArtist);
/**
 * API permettant de faire le matching entre les dossiers du fichier généré par l'API /animux/create_mapping/artist (filename: animux_artist_not_found_log.txt)
 */
router.get('/animux/create_mapping/artist/not_found', animuxController.getNotFoundLogArtist);
/**
 * API permettant d'avoir le nombre de liens animux présent dans notre base de données
 */
router.get('/animux/count/artist', animuxController.countArtistAnimuxDirInDB);
/**
 * API permettant d'avoir le nombre de liens animux présent dans notre base de données
 */
router.get('/animux/count/song', animuxController.countSongAnimuxFileInDB);


/**
 * API permettant de faire le matching entre les fichiers animux contenant la synchronisation des paroles et nos musique en base de données
 */
router.get('/animux/create_mapping/song', animuxController.getFileSong);





/**
 * API permettant de detecter les langues des lyrics et d'ajouter un attribut language_detect pour chaque musique 
 */
router.get('/lyrics/language_detect', languageDetectHandler.detectLanguage);
/**
 * API mettant à jour la collection _stats_lang
 */
router.get('/create_stats/lyrics/language/popularity', languageDetectHandler.updateLanguagePopularity);
/**
 * API mettant à jour la collection _stats_prop_artist
 */
router.get('/create_stats/properties/artist/count', statsController.updatePropertiesStatsArtist);
/**
 * API mettant à jour la collection _stats_prop_album
 */
router.get('/create_stats/properties/album/count', statsController.updatePropertiesStatsAlbum);
/**
 * API mettant à jour la collection _stats_prop_song
 */
router.get('/create_stats/properties/song/count', statsController.updatePropertiesStatsSong);

/**
 * Update olds discographies (for an existing artist) or add new discographie (if new artist)
 */
router.get('/lyricswikia', lyricsWikiaController.startExtraction);
router.get('/lyricswikia/try_tor', lyricsWikiaController.tryTor);



export default router;