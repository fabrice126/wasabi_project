import request from 'request';
import express from 'express';
import config from '../conf/conf.json';
import {
    ObjectId
} from 'mongoskin';
import fs from 'fs';
import parse from 'csv-parse';
const PATH_MAPPING_DEEZER = "./mongo/deezer/track_dz_wasabi_viaproduct.csv";
const COLLECTIONSONG = config.database.collection_song;
const URL_SONG_DEEZER = "http://api.deezer.com/track/";


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
                        if (i % 1000 == 0) {
                            console.log(i + " documents updated");
                        }
                        loop(i);
                    }
                });
            })(i);
        });
    });
    res.json(config.http.valid.send_message_ok);
};

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
        timeout = 10,
        limit = 10000;
    db.collection(COLLECTIONSONG).count(query, function (err, nbSong) {
        console.log("Nombre total de musique : " + nbSong);
        (function fetchSong(skip) {
            var nb = 0;
            if (skip < nbSong) {
                db.collection(COLLECTIONSONG).find(query, projection).maxTimeMS(160000).skip(skip).limit(limit).toArray(function (err, tSongs) {
                    var i = 0;
                    console.log(tSongs.length);
                    (function loop(i) {
                        var objSong = tSongs[i],
                            deezerId = objSong.deezer_mapping[0][0];
                        //Si l'id de deezer est == 1 alors l'id est invalide on itére sur le prochain document
                        if (deezerId == 1) {
                            nb++;
                            if (nb == tSongs.length) {
                                skip += limit;
                                console.log("SKIP = " + skip);
                                fetchSong(skip);
                            } else {
                                i++;
                                if (!(i % 500)) {
                                    console.log(i + ", skip = " + skip);
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
                                    updateFieldsDeezer(objSong, oDeezer);
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
                                            fs.writeFile('deezerHandler_getAllSongs.txt', skip, (err) => {
                                                if (err) throw err;
                                                console.log('It\'s saved!');
                                            });
                                            fetchSong(skip);
                                        } else {
                                            i++;
                                            setTimeout(() => {
                                                if (!(i % 500)) {
                                                    console.log(i + ", skip = " + skip);
                                                }
                                                loop(i);
                                            }, timeout);
                                        }
                                    });
                                }
                            }).catch((error) => {
                                console.log("FAIL = " + objSong._id + " id_song_deezer = " + deezerId + " -> " + i + ", skip = " + skip);
                                console.log(error);
                                nb++;
                                if (nb == tSongs.length) {
                                    skip += limit;
                                    console.log("SKIP = " + skip);
                                    fetchSong(skip);
                                } else {
                                    i++;
                                    setTimeout(() => {
                                        if (!(i % 500)) {
                                            console.log(i + ", skip = " + skip);
                                        }
                                        loop(i);
                                    }, timeout);
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
            updateFieldsDeezer(objSong, oDeezer);
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
                console.log(" => erreur " + err);
                reject(err);
            }
        });
    })
};

/**
/ * On construit l'objet song a enreigstrer dans la base de données. Les données récupérées sur l'API de deezer seront ajoutées 
/ * @param {*} oSong objet song a enregister dans notre base de données
/ * @param {*} oDeezer objet de deezer, nous allons prendre les données de cet objet
/ */
var updateFieldsDeezer = (oSong, oDeezer) => {
    oSong.id_song_deezer = oDeezer.id.toString();
    oSong.isrc = oDeezer.isrc ? oDeezer.isrc : "";
    oSong.publicationDate = oDeezer.release_date ? oDeezer.release_date : "";
    oSong.length = oDeezer.duration ? oDeezer.duration.toString() : "";
    oSong.explicitLyrics = oDeezer.explicit_lyrics;
    oSong.rank = oDeezer.rank ? oDeezer.rank.toString() : ""; // /!\ a voir si c'est mieux avec oDeezer.alternative.rank
    oSong.bpm = oDeezer.bpm ? oDeezer.bpm.toString() : ""; // /!\ a voir si c'est mieux avec oDeezer.alternative.bpm
    oSong.gain = oDeezer.gain ? oDeezer.gain.toString() : ""; // /!\ a voir si c'est mieux avec oDeezer.alternative.gain

    if (oDeezer.preview != "") {
        oSong.preview = oDeezer.preview;
    } else if (typeof oDeezer.alternative != "undefined") {
        oSong.preview = oDeezer.alternative.preview
    } else {
        oSong.preview = "";
    }

    if (oDeezer.available_countries != "") {
        oSong.availableCountries = oDeezer.available_countries;
    } else if (typeof oDeezer.alternative != "undefined") {
        oSong.availableCountries = oDeezer.alternative.available_countries
    } else {
        oSong.availableCountries = [];
    }
};


exports.doMappingWasabiDeezer = doMappingWasabiDeezer;
exports.getAllSongs = getAllSongs;
exports.getSong = getSong;