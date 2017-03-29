import request from 'request';
import {
    ObjectId
} from 'mongoskin';
import config from '../conf/conf';
const COLLECTIONARTIST = config.database.collection_artist;
const COLLECTIONALBUM = config.database.collection_album;
const COLLECTIONSONG = config.database.collection_song;
const URL_TO_REPLACE = "http://musicbrainz.org";
const USE_MUSICBRAINZ_URL_LOCAL = true;
const URL_MUSICBRAINZ = USE_MUSICBRAINZ_URL_LOCAL ? "http://127.0.0.1:5000/ws/2" : "http://musicbrainz.org/ws/2";
const URL_PARAMS_ARTIST = "?inc=artist-rels&fmt=json";
const URL_PARAMS_ALBUM = "?inc=artist-rels&fmt=json";
const URL_PARAMS_SONG = "?inc=work-rels&fmt=json";

/**
 * Permet de mettre a jour les documents artistes de la base de données ayant une URL vers musicbrainz
 * @param {*} req 
 * @param {*} res 
 */
var getAllArtists = (req, res) => {
    getAndUpdateAll(req.db, COLLECTIONARTIST, URL_PARAMS_ARTIST, updateFieldsArtistMusicBrainz);
    res.json(config.http.valid.send_message_ok);

}
/**
 * Permet de mettre a jour le document artiste de la base de données dont l'id est passé en parametre
 * @param {*} req 
 * @param {*} res 
 */
var getArtist = (req, res) => {
    var id = req.params._id;
    if (!ObjectId.isValid(req.params._id)) {
        return res.status(404).json(config.http.error.objectid_404);
    }
    getAndUpdateOne(req.db, res, id, COLLECTIONARTIST, URL_PARAMS_ARTIST, updateFieldsArtistMusicBrainz);
    res.json(config.http.valid.send_message_ok);
}
/**
 * Permet de mettre a jour les documents albums de la base de données ayant une URL vers musicbrainz
 * @param {*} req 
 * @param {*} res 
 */
var getAllAlbums = (req, res) => {
    getAndUpdateAll(req.db, COLLECTIONALBUM, URL_PARAMS_ALBUM, updateFieldsAlbumMusicBrainz);
    res.json(config.http.valid.send_message_ok);
}
/**
 * Permet de mettre a jour le document album de la base de données dont l'id est passé en parametre
 * @param {*} req 
 * @param {*} res 
 */
var getAlbum = (req, res) => {
    var id = req.params._id;
    if (!ObjectId.isValid(req.params._id)) {
        return res.status(404).json(config.http.error.objectid_404);
    }
    getAndUpdateOne(req.db, res, id, COLLECTIONALBUM, URL_PARAMS_ALBUM, updateFieldsAlbumMusicBrainz);
    // res.json(config.http.valid.send_message_ok);
}
/**
 * Permet de mettre a jour les documents musiques de la base de données ayant une URL vers musicbrainz
 * @param {*} req 
 * @param {*} res 
 */
var getAllSongs = (req, res) => {
    getAndUpdateAll(req.db, COLLECTIONSONG, URL_PARAMS_SONG, updateFieldsSongMusicBrainz);
    res.json(config.http.valid.send_message_ok);
}
/**
 * Permet de mettre a jour le document musique de la base de données dont l'id est passé en parametre
 * @param {*} req 
 * @param {*} res 
 */
var getSong = (req, res) => {
    var id = req.params._id;
    if (!ObjectId.isValid(req.params._id)) {
        return res.status(404).json(config.http.error.objectid_404);
    }
    getAndUpdateOne(req.db, res, id, COLLECTIONSONG, URL_PARAMS_SONG, updateFieldsSongMusicBrainz);
    // res.json(config.http.valid.send_message_ok);

}


/**
 * Fonction permettant de mettre a jour la collection passé en parametre en y ajoutant des données de MusicBrainz
 * @param {*} db 
 * @param {*} collection 
 * @param {*} urlParams 
 * @param {*} updateFieldsCollectionMusicBrainz 
 */
var getAndUpdateAll = (db, collection, urlParams, updateFieldsCollectionMusicBrainz) => {
    var skip = 28000,
        limit = 10000,
        query = {
            urlMusicBrainz: {
                $ne: ""
            }
        },
        projection = {
            rdf: 0,
            wordCount: 0
        };
    db.collection(collection).count(query, function (err, nbObj) {
        console.log("There are " + nbObj + " songs with an id musicbrainz");
        (function fetchObj(skip) {
            var nb = 0;
            if (skip < nbObj) {
                db.collection(collection).find(query, projection).skip(skip).limit(limit).toArray(function (err, tObj) {
                    var i = 0;
                    (function loop(i) {
                        let url = tObj[i].urlMusicBrainz.replace(URL_TO_REPLACE, URL_MUSICBRAINZ) + urlParams;
                        requestMusicBrainz(url).then((oMB) => {
                            updateFieldsCollectionMusicBrainz(tObj[i], oMB);
                            db.collection(collection).update({
                                _id: new ObjectId(tObj[i]._id)
                            }, {
                                $set: tObj[i]
                            }, function (err) {
                                if (err) throw err;
                                nb++;
                                if (nb == tObj.length) {
                                    skip += limit;
                                    console.log("SKIP = " + skip);
                                    fetchObj(skip);
                                } else {
                                    i++;
                                    loop(i);
                                }
                            });
                        }).catch((error) => {
                            if (collection == COLLECTIONARTIST) {
                                console.log("FAIL = " + tObj[i].urlMusicBrainz + " / " + collection);
                            } else if (collection == COLLECTIONALBUM) {
                                console.log("FAIL = " + tObj[i].urlMusicBrainz + " / " + collection);
                            } else if (collection == COLLECTIONSONG) {
                                console.log("FAIL = " + tObj[i].urlMusicBrainz + " / " + collection);
                            }
                            nb++;
                            if (nb == tObj.length) {
                                skip += limit;
                                console.log("SKIP = " + skip);
                                fetchObj(skip);
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
}

/**
 * 
 * @param {*} db base de données dans laquelle enregistrer les modifications
 * @param {*} res permet de renvoyer des erreurs si besoibn
 * @param {*} id id du document a update
 * @param {*} collection collection dans laquelle on cherche le document
 * @param {*} urlParams les parametres de requete seront differents en fonction de la collection
 * @param {*} updateFieldsCollectionMusicBrainz fonction permettant d'ajouter les champs dans l'objet a enregistrer en base de données
 */
var getAndUpdateOne = (db, res, id, collection, urlParams, updateFieldsCollectionMusicBrainz) => {
    var query = {
            _id: ObjectId(id)
        },
        projection = {
            rdf: 0,
            wordCount: 0
        };
    db.collection(collection).findOne(query, projection, (err, obj) => {
        let url = obj.urlMusicBrainz.replace(URL_TO_REPLACE, URL_MUSICBRAINZ) + urlParams;
        requestMusicBrainz(url).then((oMB) => {
            updateFieldsCollectionMusicBrainz(obj, oMB);
            db.collection(collection).update(query, {
                $set: obj
            }, function (err) {
                if (err) throw err;
                if (collection == COLLECTIONARTIST) {
                    console.log("AJOUT TERMINEE: " + obj.name);
                } else if (collection == COLLECTIONALBUM) {
                    console.log("AJOUT TERMINEE: " + obj._id + " / " + collection);
                } else if (collection == COLLECTIONSONG) {
                    console.log("AJOUT TERMINEE: " + obj._id + " / " + collection);
                }
            });
            res.json(obj);
        }).catch((error) => {
            console.log(error);
            return res.status(404).json(config.http.error.musicbrainz_error_404);
        });
    });
}


/**
 * API permettant de recupérer les informations d'un artiste sur musicbrainz
 * @param {*} urlMusicBrainz : une url vers la page d'un artiste de MusicBrainz
 */
var requestMusicBrainz = (urlMusicBrainz) => {
    return new Promise((resolve, reject) => {
        request({
            url: urlMusicBrainz,
            headers: {
                'User-Agent': 'wasabi'
            }
        }, (err, resp, body) => {
            if (!err && resp.statusCode == 200) {
                resolve(JSON.parse(body));
            } else {
                console.log("erreur " + err);
                reject(err);
            }
        });
    })
};
/**
 * Permet d'ajouter des champs à l'objet objArtist de notre base de données en les récupérant de l'objet oMB venant de l'api de musicbrainz 
 * @param {*} objArtist objet artiste représente un document d'un artiste dans la base de données 
 * @param {*} oMB objet musicbrainz représente un document d'un artiste récupéré via l'api de musicbrainz 
 */
var updateFieldsArtistMusicBrainz = function (objArtist, oMB) {
    console.log("update ARTIST fields");

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
/**
 * Permet d'ajouter des champs à l'objet objAlbum de notre base de données en les récupérant de l'objet oMB venant de l'api de musicbrainz 
 * @param {*} objAlbum objet album représente un document d'un album dans la base de données 
 * @param {*} oMB objet musicbrainz représente un document d'un album récupéré via l'api de musicbrainz 
 */
var updateFieldsAlbumMusicBrainz = function (objAlbum, oMB) {
    console.log("update ALBUM fields");
}
/**
 * Permet d'ajouter des champs à l'objet objSong de notre base de données en les récupérant de l'objet oMB venant de l'api de musicbrainz 
 * @param {*} objSong objet musique représente un document d'une musique dans la base de données 
 * @param {*} oMB objet musicbrainz représente un document d'une musique récupéré via l'api de musicbrainz 
 */
var updateFieldsSongMusicBrainz = function (objSong, oMB) {
    objSong = {
        "id_song_musicbrainz": oMB.id,
        "video": oMB.video,
        "disambiguation": oMB.disambiguation ? oMB.disambiguation : "",
        "language": "",
        "begin": "",
        "end": "",
        "ended": true,
    };
    if (oMB.relations.length > 1) {
        console.log(objSong.urlMusicBrainz);
    }
    if (typeof oMB.relations[0] != "undefined") {
        objSong.language = oMB.relations[0].work ? oMB.relations[0].work.language : "";
        objSong.begin = oMB.relations[0].begin ? oMB.relations[0].begin : "";
        objSong.end = oMB.relations[0].end ? oMB.relations[0].end : "";
        objSong.ended = oMB.relations[0].ended;
    }
}




exports.getAllArtists = getAllArtists;
exports.getArtist = getArtist;
exports.getAllAlbums = getAllAlbums;
exports.getAlbum = getAlbum;
exports.getAllSongs = getAllSongs;
exports.getSong = getSong;