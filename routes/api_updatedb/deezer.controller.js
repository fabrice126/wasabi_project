import request from 'request';
import express from 'express';
import config from '../conf/conf';
import {
    ObjectId
} from 'mongoskin';
import fs from 'fs';
import parse from 'csv-parse';
const PATH_MAPPING_DEEZER = "./mongo/deezer/track_dz_wasabi_viaproduct.csv";
const COLLECTIONARTIST = config.database.collection_artist;
const COLLECTIONALBUM = config.database.collection_album;
const COLLECTIONSONG = config.database.collection_song;
const URL_ARTIST_DEEZER = "http://api.deezer.com/artist/";
const URL_ALBUM_DEEZER = "http://api.deezer.com/album/";
const URL_SONG_DEEZER = "http://api.deezer.com/track/";
const FILE_TITLE_ALBUM = "deezerHandler_getAllAlbums.txt";
const FILE_TITLE_SONG = "deezerHandler_getAllSongs.txt";

var doMappingWasabiDeezer = (req, res) => {
    var db = req.db;
    fs.readFile(PATH_MAPPING_DEEZER, (err, data) => {
        if (err) console.log(err);
        parse(data, {
            trim: true,
            auto_parse: true
        }, (err, rows) => {
            // Your CSV data is in an array of arrays passed to this callback as rows.
            console.log("DEBUT DE L'UPDATE");
            var i = 0;
            (function loop(i) {
                var row = rows[i];
                var idSong = row[0];
                row.shift();
                db.collection(COLLECTIONSONG).updateOne({
                    _id: ObjectId(idSong)
                }, {
                    $addToSet: {
                        deezer_mapping: row
                    }
                }, (err) => {
                    if (err) throw err;
                    if (i < rows.length - 1) {
                        i++;
                        if (i % 1000 == 0) console.log(i + " documents updated");
                        loop(i);
                    }
                });
            })(i);
        });
    });
    res.json(config.http.valid.send_message_ok);
};

//==========================================================================================================================\\
//=========================WEBSERVICE REST POUR EXTRAIRE LES DONNEES DES MUSIQUES DE L'API DE DEEZER========================\\
//==========================================================================================================================\\
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
var getAllSongs = (req, res) => {
    var db = req.db,
        skip = 0,
        query = {
            deezer_mapping: {
                $ne: []
            }
        },
        projection = {
            rdf: 0,
            wordCount: 0
        },
        timeout = 50,
        limit = 10000;
    db.collection(COLLECTIONSONG).count(query, function (err, nbSong) {
        console.log("Nombre total de musique : " + nbSong);
        (function fetchSong(skip) {
            var nb = 0;
            if (skip < nbSong) {
                db.collection(COLLECTIONSONG).find(query, projection).maxTimeMS(160000).skip(skip).limit(limit).toArray(function (err, tSongs) {
                    var i = 0;
                    (function loop(i) {
                        var objSong = tSongs[i],
                            deezerId = objSong.deezer_mapping[0][0];
                        //Si l'id de deezer est == 1 alors l'id est invalide on itére sur le prochain document
                        if (deezerId == 1) {
                            nb++;
                            if (nb == tSongs.length) {
                                skip += limit;
                                console.log("SKIP = " + skip);
                                writeSkipInFile(skip, FILE_TITLE_SONG);
                                fetchSong(skip);
                            } else {
                                i++;
                                if (!(i % 500)) {
                                    console.log("SKIP = " + (skip + i));
                                    writeSkipInFile(skip + i, FILE_TITLE_SONG);
                                }
                                loop(i);
                            }
                        } else {
                            var url = URL_SONG_DEEZER + deezerId;
                            requestDeezer(url).then((oDeezer) => {
                                if (typeof oDeezer.error != "undefined") {
                                    if (oDeezer.error.code == 800) { //le document de chez deezer n'a pas de données
                                        throw oDeezer.error.message;
                                    }
                                    if (oDeezer.error.code == 4) { // On a été bloqué par l'API de deezer, on renvoie la requête
                                        console.log("relance requete = " + deezerId + " -> " + i + ", skip = " + skip);
                                        setTimeout(() => {
                                            loop(i);
                                        }, timeout * 10);
                                    }
                                } else {
                                    updateFieldsSongsDeezer(objSong, oDeezer);
                                    db.collection(COLLECTIONSONG).update({
                                        _id: new ObjectId(objSong._id)
                                    }, {
                                        $set: objSong
                                    }, function (err) {
                                        if (err) throw err;
                                        nb++;
                                        if (nb == tSongs.length) {
                                            skip += limit;
                                            console.log("SKIP = " + skip);
                                            writeSkipInFile(skip, FILE_TITLE_SONG);
                                            fetchSong(skip);
                                        } else {
                                            i++;
                                            setTimeout(() => {
                                                if (!(i % 500)) {
                                                    console.log("SKIP = " + (skip + i));
                                                    writeSkipInFile(skip + i, FILE_TITLE_SONG);
                                                }
                                                loop(i);
                                            }, timeout);
                                        }
                                    });
                                }
                            }).catch((error) => {
                                if (error.message && (error.message == "ETIMEDOUT" || error.message == "ESOCKETTIMEDOUT")) {
                                    console.log(deezerId + " ERROR DE TIMEOUT = " + error.message);
                                    setTimeout(() => {
                                        loop(i);
                                    }, timeout * 10);
                                } else {
                                    console.log("FAIL = " + objSong._id + " id_song_deezer = " + deezerId + " -> " + i + ", skip = " + skip, error);
                                    nb++;
                                    if (nb == tSongs.length) {
                                        skip += limit;
                                        console.log("SKIP = " + skip);
                                        writeSkipInFile(skip, FILE_TITLE_SONG);
                                        fetchSong(skip);
                                    } else {
                                        i++;
                                        setTimeout(() => {
                                            if (!(i % 500)) {
                                                console.log("SKIP = " + (skip + i));
                                                writeSkipInFile(skip + i, FILE_TITLE_SONG);
                                            }
                                            loop(i);
                                        }, timeout);
                                    }
                                }
                            });
                        }
                    })(i);
                });
            } else {
                console.log("TRAITEMENT TERMINE");
            }
        })(skip);
    });
    res.json(config.http.valid.send_message_ok);
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
var getSong = (req, res) => {
    var db = req.db,
        id = req.params._id;
    if (!ObjectId.isValid(id)) {
        return res.status(404).json(config.http.error.objectid_404);
    }
    db.collection(COLLECTIONSONG).findOne({
        _id: ObjectId(id)
    }, {
        rdf: 0,
        wordCount: 0
    }, (err, objSong) => {
        console.log("length: " + objSong.deezer_mapping.length);
        var url = URL_SONG_DEEZER + objSong.deezer_mapping[0][0];
        requestDeezer(url).then((oDeezer) => {
            updateFieldsSongsDeezer(objSong, oDeezer);
            db.collection(COLLECTIONSONG).update({
                _id: ObjectId(objSong._id)
            }, {
                $set: objSong
            }, function (err) {
                if (err) throw err;
                console.log("AJOUT TERMINEE: " + objSong.title);
            });
        }).catch((error) => {
            console.log(error);
            return res.status(404).json(config.http.error.deezer_error_404);
        });
    });
    res.json(config.http.valid.send_message_ok);
};

//==========================================================================================================================\\
//=========================WEBSERVICE REST POUR EXTRAIRE LES DONNEES DES ARTISTES DE L'API DE DEEZER========================\\
//==========================================================================================================================\\
/**
 * We extract artist from Deezer API
 * @param {*} req 
 * @param {*} res 
 */
var getAllArtists = (req, res) => {
    var db = req.db,
        skip = 0,
        query = {
            id_artist_deezer: {
                $exists: 1
            }
        },
        projection = {
            _id: 1,
            id_artist_deezer: 1
        },
        timeout = 50,
        limit = 10000;
    db.collection(COLLECTIONARTIST).count(query, function (err, nbArtist) {
        console.log("Nombre total de musique : " + nbArtist);
        (function fetch(skip) {
            var nb = 0;
            if (skip < nbArtist) {
                db.collection(COLLECTIONARTIST).find(query, projection).maxTimeMS(160000).skip(skip).limit(limit).toArray(function (err, tArtists) {
                    var i = 0;
                    (function loop(i) {
                        var objArtist = tArtists[i],
                            url = URL_ARTIST_DEEZER + objArtist.id_artist_deezer;
                        requestDeezer(url).then((oDeezer) => {
                            if (typeof oDeezer.error != "undefined") {
                                if (oDeezer.error.code == 800) { //le document de chez deezer n'a pas de données
                                    throw oDeezer.error.message;
                                }
                                if (oDeezer.error.code == 4) { // On a été bloqué par l'API de deezer, on renvoie la requête
                                    console.log("relance requete = " + objArtist.id_artist_deezer + " -> " + i + ", skip = " + skip);
                                    setTimeout(() => {
                                        loop(i);
                                    }, timeout * 10);
                                }
                            } else {
                                updateFieldsArtistsDeezer(objArtist, oDeezer);
                                db.collection(COLLECTIONARTIST).update({
                                    _id: new ObjectId(objArtist._id)
                                }, {
                                    $set: objArtist
                                }, function (err) {
                                    if (err) throw err;
                                    nb++;
                                    if (nb == tArtists.length) {
                                        skip += limit;
                                        fetch(skip);
                                    } else {
                                        i++;
                                        setTimeout(() => {
                                            if (!(i % 20)) console.log("SKIP = " + (skip + i));
                                            loop(i);
                                        }, timeout);
                                    }
                                });
                            }
                        }).catch((error) => {
                            if (error.message && (error.message == "ETIMEDOUT" || error.message == "ESOCKETTIMEDOUT")) {
                                console.log(objArtist.id_artist_deezer + " ERROR DE TIMEOUT = " + error.message);
                                setTimeout(() => {
                                    loop(i);
                                }, timeout * 10);
                            } else {
                                console.log("FAIL = " + objArtist._id + " id_artist_deezer = " + objArtist.id_artist_deezer + " -> " + i + ", skip = " + skip, error);
                                nb++;
                                if (nb == tArtists.length) {
                                    skip += limit;
                                    fetch(skip);
                                } else {
                                    i++;
                                    setTimeout(() => {
                                        loop(i);
                                    }, timeout);
                                }
                            }
                        });
                    })(i);
                });
            } else {
                console.log("TRAITEMENT TERMINE");
            }
        })(skip);
    });
    res.json(config.http.valid.send_message_ok);
};

/**
 * API vérifiant que les musiques d'un artiste ont le même id_artist_deezer
 * ex: http://api.deezer.com/track/2149869 cette musique contient l'artiste ainsi que l'album
 * Cependant nous avons le choix entre deux albums : album ou alternative.album il s'avére que ces deux albums ne pointent pas 
 * vers le même document ex : album.id = 215330 et alternative.album.id = 14581794. La même chose peut avoir lieu entre l'objet artist et alternative.artist
 * Cette API va donc verifier que chaque musique pointe vers le bon artiste. Pour en déduire le bon artiste nous récupérons le nombre d'occurrence de l'ID.
 * L'id revenant le plus de fois dans une musique d'un artiste sera considéré comme étant le bon.
 * @param {*} req 
 * @param {*} res 
 */
var checkAndUpdateIdArtist = (req, res) => {
    var skip = 0,
        limit = 10000,
        projection = {
            "name": 1
        },
        projectionSong = {
            "name": 1,
            "id_artist_deezer": 1
        };
    req.db.collection(COLLECTIONARTIST).count({}, function (err, nbArtist) {
        (function loop(skip) {
            req.db.collection(COLLECTIONARTIST).find({}, projection).maxTimeMS(160000).skip(skip).limit(limit).toArray(function (err, tArtists) {
                //Nombre d'artiste traité
                var nbEnd = 0;
                for (var i = 0, l = tArtists.length; i < l; i++) {
                    ((oArtist) => {
                        var subquery = {
                                "name": oArtist.name
                            },
                            querySong = {
                                $and: [subquery, {
                                    "id_artist_deezer": {
                                        $exists: 1
                                    }
                                }]
                            };
                        req.db.collection(COLLECTIONSONG).find(querySong, projectionSong).toArray(function (err, tSongs) {
                            //tSongs contient les musiques possedant le champ id_artist_deezer
                            if (tSongs.length > 0) {
                                var tIdArtist = {},
                                    main_id_artist_deezer,
                                    urlDeezer;
                                //Beaucoup de musique ne pointe pas vers le bon artiste nous compterons donc le nombre de fois ou un ID est le plus présent
                                //On considérera que l'id le plus présent est l'ID du vrai artiste
                                for (var j = 0, lj = tSongs.length; j < lj; j++) {
                                    if (tIdArtist.hasOwnProperty(tSongs[j].id_artist_deezer)) {
                                        tIdArtist[tSongs[j].id_artist_deezer].push(tSongs[j].id_artist_deezer);
                                    } else {
                                        tIdArtist[tSongs[j].id_artist_deezer] = [];
                                        tIdArtist[tSongs[j].id_artist_deezer].push(tSongs[j].id_artist_deezer);
                                    }
                                }
                                //si tIdArtist a plus d'une propriété (que ses id_artist_deezer de la collection song pointes vers des artistes différents)
                                if (Object.keys(tIdArtist).length > 1) {
                                    var maxLength = 0;
                                    //On va voir quelle propriété à le plus de valeur
                                    for (var it in tIdArtist) {
                                        //pour chaque propriété de tIdArtist
                                        if (maxLength < tIdArtist[it].length) {
                                            maxLength = tIdArtist[it].length;
                                            main_id_artist_deezer = it;
                                        }
                                    }
                                } else {
                                    //Dans ce cas peut importe la musique choisi pour remplir main_id_artist_deezer car les musiques pointes tous sur le même artiste
                                    main_id_artist_deezer = tSongs[0].id_artist_deezer;
                                }
                                urlDeezer = "http://www.deezer.com/artist/" + main_id_artist_deezer;
                                //faire update des musiques qui n'ont pas les bon IDs
                                req.db.collection(COLLECTIONARTIST).updateOne(subquery, {
                                    $set: {
                                        "id_artist_deezer": main_id_artist_deezer,
                                        "urlDeezer": urlDeezer
                                    }
                                });
                            }
                            nbEnd++
                            if (nbEnd == tArtists.length) {
                                skip += tArtists.length;
                                if (skip == nbArtist) {
                                    console.log("traitement terminé");
                                } else {
                                    console.log("Un autre tour de boucle = " + skip);
                                    loop(skip);
                                }
                            }
                        });
                    })(tArtists[i]);
                }
            });
        })(skip);
    });
    res.json(config.http.valid.send_message_ok);
};
//==========================================================================================================================\\
//==========================WEBSERVICE REST POUR EXTRAIRE LES DONNEES DES ALBUMS DE L'API DE DEEZER=========================\\
//==========================================================================================================================\\
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
var getAllAlbums = (req, res) => {
    var db = req.db,
        skip = 0,
        query = {
            id_album_deezer: {
                $exists: 1
            }
        },
        projection = {
            _id: 1,
            id_album_deezer: 1
        },
        timeout = 50,
        limit = 10000;
    db.collection(COLLECTIONALBUM).count(query, function (err, nbAlbum) {
        console.log("Nombre total de musique : " + nbAlbum);
        (function fetch(skip) {
            var nb = 0;
            if (skip < nbAlbum) {
                db.collection(COLLECTIONALBUM).find(query, projection).maxTimeMS(160000).skip(skip).limit(limit).toArray(function (err, tAlbums) {
                    var i = 0;
                    (function loop(i) {
                        var objAlbum = tAlbums[i],
                            url = URL_ALBUM_DEEZER + objAlbum.id_album_deezer;
                        requestDeezer(url).then((oDeezer) => {
                            if (typeof oDeezer.error != "undefined") {
                                if (oDeezer.error.code == 800) { //le document de chez deezer n'a pas de données
                                    throw oDeezer.error.message;
                                }
                                if (oDeezer.error.code == 4) { // On a été bloqué par l'API de deezer, on renvoie la requête
                                    console.log("relance requete = " + objAlbum.id_album_deezer + " -> " + i + ", skip = " + skip);
                                    setTimeout(() => {
                                        loop(i);
                                    }, timeout * 10);
                                }
                            } else {
                                updateFieldsAlbumsDeezer(objAlbum, oDeezer);
                                db.collection(COLLECTIONALBUM).update({
                                    _id: new ObjectId(objAlbum._id)
                                }, {
                                    $set: objAlbum
                                }, function (err) {
                                    if (err) throw err;
                                    nb++;
                                    if (nb == tAlbums.length) {
                                        skip += limit;
                                        console.log("SKIP = " + skip);
                                        writeSkipInFile(skip, FILE_TITLE_ALBUM);
                                        fetch(skip);
                                    } else {
                                        i++;
                                        setTimeout(() => {
                                            if (!(i % 500)) {
                                                console.log("SKIP = " + (skip + i));
                                                writeSkipInFile(skip + i, FILE_TITLE_ALBUM);
                                            }
                                            loop(i);
                                        }, timeout);
                                    }
                                });
                            }
                        }).catch((error) => {
                            if (error.message && (error.message == "ETIMEDOUT" || error.message == "ESOCKETTIMEDOUT")) {
                                console.log(objAlbum.id_album_deezer + " ERROR DE TIMEOUT = " + error.message);
                                setTimeout(() => {
                                    loop(i);
                                }, timeout * 10);
                            } else {
                                console.log("FAIL = " + objAlbum._id + " id_album_deezer = " + objAlbum.id_album_deezer + " -> " + i + ", skip = " + skip, error);
                                nb++;
                                if (nb == tAlbums.length) {
                                    skip += limit;
                                    console.log("SKIP = " + skip);
                                    writeSkipInFile(skip, FILE_TITLE_ALBUM);
                                    fetch(skip);
                                } else {
                                    i++;
                                    setTimeout(() => {
                                        if (!(i % 500)) {
                                            console.log("SKIP = " + (skip + i));
                                            writeSkipInFile(skip + i, FILE_TITLE_ALBUM);
                                        }
                                        loop(i);
                                    }, timeout);
                                }
                            }
                        });
                    })(i);
                });
            } else {
                console.log("TRAITEMENT TERMINE");
            }
        })(skip);
    });
    res.json(config.http.valid.send_message_ok);
};
/**
 * API vérifiant que les musiques d'un album ont le même id_album_deezer
 * ex: http://api.deezer.com/track/2149869 . cette musique contient l'artiste ainsi que l'album
 * Cependant nous avons le choix entre deux albums : album ou alternative.album il s'avére que ces deux albums ne pointent pas 
 * vers le même document ex : album.id = 215330 et alternative.album.id = 14581794. La même chose peut avoir lieu entre l'objet artist et alternative.artist
 * Cette API va donc verifier que chaque musique pointe vers le bon album. Pour en déduire le bon artiste nous récupérons le nombre d'occurrence de l'ID.
 * L'id revenant le plus de fois dans une musique d'un album sera considéré comme étant le bon.
 * @param {*} req 
 * @param {*} res 
 */
var checkAndUpdateIdAlbum = (req, res) => {
    var skip = 0,
        limit = 10000,
        projection = {
            "_id": 1
        },
        projectionSong = {
            "id_album": 1,
            "id_album_deezer": 1
        };
    req.db.collection(COLLECTIONALBUM).count({}, function (err, nbAlbum) {
        (function loop(skip) {
            req.db.collection(COLLECTIONALBUM).find({}, projection).maxTimeMS(160000).skip(skip).limit(limit).toArray(function (err, tAlbums) {
                //Nombre d'album traité
                var nbEnd = 0;
                for (var i = 0, l = tAlbums.length; i < l; i++) {
                    ((oAlbum) => {
                        var querySong = {
                            $and: [{
                                "id_album": oAlbum._id
                            }, {
                                "id_album_deezer": {
                                    $exists: 1
                                }
                            }]
                        };
                        req.db.collection(COLLECTIONSONG).find(querySong, projectionSong).toArray(function (err, tSongs) {
                            //tSongs contient les musiques possedant le champ id_album_deezer
                            if (tSongs.length > 0) {
                                var tIdAlbum = {},
                                    main_id_album_deezer,
                                    urlDeezer;
                                //Beaucoup de musique ne pointe pas vers le bon album nous compterons donc le nombre de fois ou un ID est le plus présent
                                //On considérera que l'id le plus présent est l'ID du vrai album
                                for (var j = 0, lj = tSongs.length; j < lj; j++) {
                                    if (tIdAlbum.hasOwnProperty(tSongs[j].id_album_deezer)) {
                                        tIdAlbum[tSongs[j].id_album_deezer].push(tSongs[j].id_album_deezer);
                                    } else {
                                        tIdAlbum[tSongs[j].id_album_deezer] = [];
                                        tIdAlbum[tSongs[j].id_album_deezer].push(tSongs[j].id_album_deezer);
                                    }
                                }
                                //si tIdAlbum a plus d'une propriété (que ses id_album_deezer de la collection song pointes vers des albums différents)
                                if (Object.keys(tIdAlbum).length > 1) {
                                    var maxLength = 0;
                                    //On va voir quelle propriété à le plus de valeur
                                    for (var it in tIdAlbum) {
                                        //pour chaque propriété de tIdAlbum
                                        if (maxLength < tIdAlbum[it].length) {
                                            maxLength = tIdAlbum[it].length;
                                            main_id_album_deezer = it;
                                        }
                                    }
                                } else {
                                    //Dans ce cas peut importe la musique choisi pour remplir main_id_album_deezer car les musiques pointes tous sur le même album
                                    main_id_album_deezer = tSongs[0].id_album_deezer;
                                }
                                urlDeezer = "http://www.deezer.com/album/" + main_id_album_deezer;
                                //faire update des albums
                                req.db.collection(COLLECTIONALBUM).updateOne({
                                    "_id": oAlbum._id
                                }, {
                                    $set: {
                                        "id_album_deezer": main_id_album_deezer,
                                        "urlDeezer": urlDeezer
                                    }
                                });
                            }
                            nbEnd++
                            if (nbEnd == tAlbums.length) {
                                skip += tAlbums.length;
                                if (skip == nbAlbum) {
                                    console.log("traitement terminé :" + skip + '/' + nbAlbum);
                                } else {
                                    console.log("Un autre tour de boucle = " + skip);
                                    loop(skip);
                                }
                            }
                        });
                    })(tAlbums[i]);
                }
            });
        })(skip);
    });
    res.json(config.http.valid.send_message_ok);
};
/**
 * 
 * @param {*} message to write in file
 * @param {*} fileTitle 
 */
var writeSkipInFile = (message, fileTitle) => {
    fs.writeFile(fileTitle, message, (err) => {
        if (err) throw err;
        console.log('It\'s saved!');
    });
};
/**
 * Envoie une requête sur l'API deezer passé en parametre
 * @param {*} urlDeezer url vers l'API de deezer
 */
var requestDeezer = (urlDeezer) => {
    return new Promise((resolve, reject) => {
        request({
            url: urlDeezer,
            timeout: 2000
        }, (err, resp, body) => {
            if (!err && resp.statusCode == 200) {
                resolve(JSON.parse(body));
            } else {
                reject(err);
            }
        });
    })
};

/**
/ * On construit l'objet song a enregistrer dans la base de données. Les données récupérées sur l'API de deezer seront ajoutées 
/ * @param {*} oSong objet song a enregister dans notre base de données
/ * @param {*} oDeezer objet de deezer, nous allons prendre les données de cet objet
/ */
var updateFieldsSongsDeezer = (oSong, oDeezer) => {
    oSong.id_song_deezer = oDeezer.id.toString();
    oSong.id_artist_deezer = oDeezer.artist.id.toString();
    oSong.id_album_deezer = oDeezer.album.id.toString();
    oSong.isrc = oDeezer.isrc ? oDeezer.isrc : "";
    oSong.urlDeezer = oDeezer.link ? oDeezer.link : "";
    oSong.publicationDate = oDeezer.release_date ? oDeezer.release_date : "";
    oSong.explicitLyrics = oDeezer.explicit_lyrics;
    oSong.preview = oDeezer.preview ? oDeezer.preview : "";
    oSong.length = oDeezer.duration ? oDeezer.duration.toString() : "";
    oSong.rank = oDeezer.rank ? oDeezer.rank.toString() : "";
    oSong.bpm = oDeezer.bpm ? oDeezer.bpm.toString() : "";
    oSong.gain = oDeezer.gain ? oDeezer.gain.toString() : "";
    oSong.availableCountries = oDeezer.available_countries.length ? oDeezer.available_countries : [];
    if (typeof oDeezer.alternative != "undefined") {
        oSong.id_artist_deezer = oDeezer.alternative.artist.id ? oDeezer.alternative.artist.id.toString() : oSong.id_artist_deezer;
        oSong.id_album_deezer = oDeezer.alternative.album.id ? oDeezer.alternative.album.id.toString() : oSong.id_album_deezer;
        oSong.isrc = oDeezer.alternative.isrc ? oDeezer.alternative.isrc : oSong.isrc;
        oSong.urlDeezer = oDeezer.alternative.link ? oDeezer.alternative.link : oSong.urlDeezer;
        oSong.preview = oDeezer.alternative.preview ? oDeezer.alternative.preview : oSong.preview;
        oSong.length = oDeezer.alternative.duration ? oDeezer.alternative.duration.toString() : oSong.length;
        oSong.rank = oDeezer.alternative.rank ? oDeezer.alternative.rank.toString() : oSong.rank;
        oSong.bpm = oDeezer.alternative.bpm ? oDeezer.alternative.bpm.toString() : oSong.bpm;
        oSong.gain = oDeezer.alternative.gain ? oDeezer.alternative.gain.toString() : oSong.gain;
        oSong.availableCountries = oDeezer.alternative.available_countries ? oDeezer.alternative.available_countries : oSong.availableCountries;
    }
};
/**
/ * On construit l'objet artist a enregistrer dans la base de données. Les données récupérées sur l'API de deezer seront ajoutées 
/ * @param {*} oArtist objet artist a enregister dans notre base de données
/ * @param {*} oDeezer objet de deezer, nous allons prendre les données de cet objet
/ */
var updateFieldsArtistsDeezer = (oArtist, oDeezer) => {
    oArtist.picture = {
        standard: oDeezer.picture ? oDeezer.picture : "",
        small: oDeezer.picture_small ? oDeezer.picture_small : "",
        medium: oDeezer.picture_medium ? oDeezer.picture_medium : "",
        big: oDeezer.picture_big ? oDeezer.picture_big : "",
        xl: oDeezer.picture_xl ? oDeezer.picture_xl : "",
    };
    oArtist.deezerFans = oDeezer.nb_fan ? oDeezer.nb_fan : 0;
};

/**
/ * On construit l'objet album a enregistrer dans la base de données. Les données récupérées sur l'API de deezer seront ajoutées 
/ * @param {*} oAlbum objet album a enregister dans notre base de données
/ * @param {*} oDeezer objet de deezer, nous allons prendre les données de cet objet
/ */
var updateFieldsAlbumsDeezer = (oAlbum, oDeezer) => {
    oAlbum.cover = {
        standard: oDeezer.cover ? oDeezer.cover : "",
        small: oDeezer.cover_small ? oDeezer.cover_small : "",
        medium: oDeezer.cover_medium ? oDeezer.cover_medium : "",
        big: oDeezer.cover_big ? oDeezer.cover_big : "",
        xl: oDeezer.cover_xl ? oDeezer.cover_xl : "",
    };
    oAlbum.deezerFans = oDeezer.fans ? oDeezer.fans : 0;
    oAlbum.explicitLyrics = oDeezer.explicit_lyrics ? oDeezer.explicit_lyrics : "";
    oAlbum.upc = oDeezer.upc ? oDeezer.upc : "";
};
exports.doMappingWasabiDeezer = doMappingWasabiDeezer;
exports.getAllSongs = getAllSongs;
exports.getSong = getSong;
exports.getAllArtists = getAllArtists;
exports.getAllAlbums = getAllAlbums;
exports.checkAndUpdateIdArtist = checkAndUpdateIdArtist;
exports.checkAndUpdateIdAlbum = checkAndUpdateIdAlbum;