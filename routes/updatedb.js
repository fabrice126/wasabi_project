import express from 'express';
import config from './conf/conf.json';
import lyricsWikia from './handler/lyricsWikia.js';
import utilHandler from './handler/utilHandler.js';
import wordCountHandler from './handler/wordCountHandler.js';
import musicBrainzHandler from './handler/musicBrainzHandler';
import {
    ObjectId
} from 'mongoskin';
import fs from 'fs';
import os from 'os';
const router = express.Router();
const COLLECTIONARTIST = config.database.collection_artist;
const COLLECTIONALBUM = config.database.collection_album;
const COLLECTIONSONG = config.database.collection_song;
const URL_TO_REPLACE = "http://musicbrainz.org";
const URL_LOCAL = "http://127.0.0.1:5000/ws/2";
const URL_MUSICBRAINZ = "http://musicbrainz.org/ws/2";
const URL_PARAMS = "?inc=artist-rels&fmt=json";


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
                            //on traite uniquement les chansons sans urlYoutube
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
        query;
    if (!ObjectId.isValid(id)) {
        return res.status(404).json(config.http.error.objectid_404);
    }
    console.log("Traitement du document " + collection + " ayant l'id=" + id);
    if (collection != COLLECTIONARTIST && collection != COLLECTIONALBUM && collection != COLLECTIONSONG) {
        return res.status(404).send([{
            error: "Page not found"
        }]);
    }
    db.collection(collection).findOne({
        _id: ObjectId(id)
    }, function (err, obj) {
        if (obj === null) {
            return res.status(404).send(config.http.error.global_404);
        }
        if (collection == COLLECTIONARTIST) {
            query = {
                name: obj.name
            };
        } else if (collection == COLLECTIONALBUM) {
            query = {
                id_album: obj._id
            };
        } else {
            query = {
                _id: obj._id
            };
        }
        var collectionTmp = 'word_count_by_lyrics_tmp';
        db.collection(COLLECTIONSONG).mapReduce(wordCountHandler.map, wordCountHandler.reduce, {
            query: query,
            out: collectionTmp
        }, function (err, results) {
            if (results === null) {
                return res.status(404).send([{
                    error: config.http.error.song_404
                }]);
            }
            var currentWordCountSong = [];
            db.collection(collectionTmp).find({}).sort({
                value: -1
            }).toArray(function (err, word) {
                if (obj === null) {
                    return res.status(404).send(config.http.error.global_404);
                }
                for (var i = 0, l = word.length; i < l; i++) {
                    currentWordCountSong.push(word[i]);
                }
                db.collection(collection).update({
                    _id: obj._id
                }, {
                    $set: {
                        "wordCount": currentWordCountSong
                    }
                }, function (resultat) {
                    console.log("le word count pour la collection: " + collection + " est terminé");
                    db.collection(collectionTmp).drop();
                    res.send("OK");
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
router.get('/musicbrainz/artist', (req, res) => {
    var db = req.db,
        id = req.params._id,
        skip = 0,
        query = {
            urlMusicBrainz: {
                $ne: ""
            }
        },
        limit = 1000;
    db.collection(COLLECTIONARTIST).count(query, function (err, nbArtist) {
        (function fetchArtist(skip) {
            var nb = 0;
            if (skip < nbArtist) {
                db.collection(COLLECTIONARTIST).find(query, {
                    rdf: 0,
                    wordCount: 0
                }).skip(skip).limit(limit).toArray(function (err, tArtists) {
                    var i = 0;
                    (function loop(i) {
                        let url = tArtists[i].urlMusicBrainz.replace(URL_TO_REPLACE, URL_LOCAL) + URL_PARAMS;
                        musicBrainzHandler.getArtistInfosFromMusicBrainz(url).then((oMB) => {
                            updateFieldsMusicBrainz(tArtists[i], oMB);
                            db.collection(COLLECTIONARTIST).update({
                                _id: new ObjectId(tArtists[i]._id)
                            }, {
                                $set: tArtists[i]
                            }, function (err) {
                                if (err) throw err;
                                nb++;
                                if (nb == tArtists.length) {
                                    skip += limit;
                                    console.log("SKIP = " + skip);
                                    fetchArtist(skip);
                                } else {
                                    i++;
                                    loop(i);
                                }
                            });
                        }).catch((error) => {
                            console.log("FAIL = " + tArtists[i].name);
                            nb++;
                            if (nb == tArtists.length) {
                                skip += limit;
                                console.log("SKIP = " + skip);
                                fetchArtist(skip);
                            } else {
                                i++;
                                loop(i);
                            }
                        });
                    })(i);
                });
            } else {
                console.log("TRAITEMENT TERMINE");
            }
        })(skip);
    });
    res.json("OK");
});
/**
 * /!\ Pour utiliser cette API il faut que la VM musicbrainz soit active sur:  http://127.0.0.1:5000/ /!\
 */
router.get('/musicbrainz/artist/:_id', (req, res) => {
    var db = req.db,
        id = req.params._id;
    if (!ObjectId.isValid(id)) {
        return res.status(404).json(config.http.error.objectid_404);
    }
    db.collection(COLLECTIONARTIST).findOne({
        _id: ObjectId(id)
    }, {
        rdf: 0,
        wordCount: 0
    }, (err, objArtist) => {
        let url = objArtist.urlMusicBrainz.replace(URL_TO_REPLACE, URL_MUSICBRAINZ) + URL_PARAMS;
        musicBrainzHandler.getArtistInfosFromMusicBrainz(url).then((oMB) => {
            updateFieldsMusicBrainz(objArtist, oMB);
            db.collection(COLLECTIONARTIST).update({
                _id: new ObjectId(objArtist._id)
            }, {
                $set: objArtist
            }, function (err) {
                if (err) throw err;
                console.log("AJOUT TERMINEE: " + objArtist.name);
            });
        }).catch((error) => {
            console.log(error);
            return res.status(404).json(config.http.error.musicbrainz_error_404);
        });;
    });
    res.json("OK");
});


/**
 * Permet d'ajouter des champs à l'objet objArtist de notre base de données en les récupérant de l'objet oMB venant de l'api de musicbrainz 
 * @param {*} objArtist objet artiste représente un document d'un artiste dans la base de données 
 * @param {*} oMB objet musicbrainz représente un document d'un artiste récupéré via l'api de musicbrainz 
 */
var updateFieldsMusicBrainz = function (objArtist, oMB) {
    objArtist.id_artist_musicbrainz = oMB.id;
    objArtist.disambiguation = oMB.disambiguation;
    objArtist.type = oMB.type ? oMB.type : "";
    objArtist.lifeSpan = {
        "ended": oMB["life-span"].ended,
        "begin": oMB["life-span"].begin ? oMB["life-span"].begin : "",
        "end": oMB["life-span"].end ? oMB["life-span"].end : ""
    };
    //Information sur les lieux du début du groupe
    objArtist.location = {
        "id_city_musicbrainz": oMB.begin_area ? oMB.begin_area.id : "",
        "country": oMB.area ? oMB.area.name : "",
        "city": oMB.begin_area ? oMB.begin_area.name : ""
    };
    //Zone ou le groupe s'est séparé
    objArtist.endArea = {
        "id": oMB.end_area ? oMB.end_area.id : "",
        "name": oMB.end_area ? oMB.end_area.name : "",
        "disambiguation": oMB.end_area ? oMB.end_area.disambiguation : ""
    };
    objArtist.gender = oMB.gender ? oMB.gender : "";
    //On supprime l'existant en base de données pour faire la mise a jour
    objArtist.members = [];
    for (var i = 0, l = oMB.relations.length; i < l; i++) {
        var member = oMB.relations[i];
        if (member.type == "member of band") {
            //On crée un objet membre contenant les propriétés du membre du groupe
            var objMember = {
                id_member_musicbrainz: member.artist.id,
                name: member.artist.name ? member.artist.name : "",
                instruments: member.attributes ? member.attributes : [],
                begin: member.begin ? member.begin : "",
                end: member.end ? member.end : "",
                ended: member.ended,
                disambiguation: member.disambiguation ? member.disambiguation : "",
                type: member.type ? member.type : ""
            }
            //On ajoute aux membres le nouveau membre 
            objArtist.members.push(objMember);
        }
    }
}
export default router;