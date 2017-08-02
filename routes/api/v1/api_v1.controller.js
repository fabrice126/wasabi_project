import config from '../../conf/conf';
import {
    ObjectId
} from 'mongoskin';
const COLLECTIONARTIST = config.database.collection_artist;
const COLLECTIONALBUM = config.database.collection_album;
const COLLECTIONSONG = config.database.collection_song;

const COLLECTION_STATS_PROP_ARTIST = config.database.collection_stats_prop_artist;
const COLLECTION_STATS_PROP_ALBUM = config.database.collection_stats_prop_album;
const COLLECTION_STATS_PROP_SONG = config.database.collection_stats_prop_song;

const LIMIT = config.request.limit;

var get_artistAll = (req, res) => {
    var db = req.db,
        start = Number.parseInt(req.params.start),
        cntAlbum = 0,
        cntArtist = 0,
        nbAlbum = 0;
    if (!Number.isInteger(start) || start < 0) return res.status(404).json(config.http.error.global_404);
    db.collection(COLLECTIONARTIST).find({}, {
        wordCount: 0,
        rdf: 0
    }).skip(start).limit(LIMIT).toArray((err, artists) => {
        if (err || !artists.length) return res.status(404).json(config.http.error.internal_error_404);
        for (var i = 0, l = artists.length; i < l; i++) {
            (function (i) {
                db.collection(COLLECTIONALBUM).find({
                    id_artist: artists[i]._id
                }, {
                    wordCount: 0,
                    rdf: 0
                }).toArray((err, albums) => {
                    if (err) return res.status(404).json(config.http.error.internal_error_404);
                    cntArtist++;
                    nbAlbum += albums.length;
                    artists[i].albums = albums;
                    //Si le dernier artist ne possède pas d'album alors on retourne ici le resultat car il ne pourra pas entrer dans le callback de la collection song ci-dessous
                    for (var j = 0, k = albums.length; j < k; j++) {
                        (function (j) {
                            db.collection(COLLECTIONSONG).find({
                                id_album: albums[j]._id
                            }, {
                                wordCount: 0,
                                rdf: 0,
                                name: 0,
                                albumTitle: 0,
                                publicationDateAlbum: 0,
                                lengthAlbum: 0
                            }).toArray((err, songs) => {
                                if (err) return res.status(404).json(config.http.error.internal_error_404);
                                artists[i].albums[j].songs = songs;
                                cntAlbum++;
                                if (cntArtist == artists.length && cntAlbum == nbAlbum) {
                                    return res.json(artists);
                                }
                            });
                        })(j);
                    }
                });
            })(i);
        }
    });
};

var get_artistAllById = (req, res) => {

    var db = req.db,
        id = req.params.id,
        cnt = 0;
    if (!ObjectId.isValid(id)) return res.status(404).json(config.http.error.objectid_404);
    db.collection(COLLECTIONARTIST).findOne({
        _id: new ObjectId(id)
    }, {
        wordCount: 0,
        rdf: 0
    }, (err, artist) => {
        if (err || !artist) return res.status(404).json(config.http.error.internal_error_404);
        db.collection(COLLECTIONALBUM).find({
            id_artist: artist._id
        }, {
            wordCount: 0,
            rdf: 0
        }).toArray((err, albums) => {
            if (err) return res.status(404).json(config.http.error.internal_error_404);
            artist.albums = albums;
            //si il n'y a aucun album on retourne l'artiste
            if (!artist.albums.length) return res.json(artist);
            for (var i = 0, l = albums.length; i < l; i++) {
                (function (i) {
                    db.collection(COLLECTIONSONG).find({
                        id_album: albums[i]._id
                    }, {
                        wordCount: 0,
                        rdf: 0,
                        name: 0,
                        albumTitle: 0,
                        publicationDateAlbum: 0,
                        lengthAlbum: 0
                    }).toArray((err, songs) => {
                        if (err) return res.status(404).json(config.http.error.internal_error_404);
                        artist.albums[i].songs = songs;
                        cnt++;
                        if (cnt == artist.albums.length) {
                            return res.send(artist);
                        }
                    });
                })(i);
            }
        });
    });
};
var get_artistAllByName = (req, res) => {
    var db = req.db,
        name = req.params.name,
        cnt = 0;
    db.collection(COLLECTIONARTIST).findOne({
        name: name
    }, {
        wordCount: 0,
        rdf: 0
    }, (err, artist) => {
        //si il y a une erreur ou que l'artiste n'existe pas on retourne une erreur
        if (err || !artist) return res.status(404).json(config.http.error.internal_error_404);
        db.collection(COLLECTIONALBUM).find({
            id_artist: artist._id
        }, {
            wordCount: 0,
            rdf: 0
        }).toArray((err, albums) => {
            if (err) return res.status(404).json(config.http.error.internal_error_404);
            artist.albums = albums;
            //si un artist n'a pas d'album alors on envoie l'objet artist contenant les infos de l'artiste et ayant un tableau artist.albums == []
            if (!artist.albums.length) return res.json(artist);
            for (var i = 0, l = albums.length; i < l; i++) {
                (function (i) {
                    db.collection(COLLECTIONSONG).find({
                        id_album: albums[i]._id
                    }, {
                        wordCount: 0,
                        rdf: 0,
                        name: 0,
                        albumTitle: 0,
                        publicationDateAlbum: 0,
                        lengthAlbum: 0
                    }).toArray((err, songs) => {
                        if (err) return res.status(404).json(config.http.error.internal_error_404);
                        artist.albums[i].songs = songs;
                        cnt++;
                        if (cnt == artist.albums.length) {
                            return res.send(artist);
                        }
                    });
                })(i);
            }
        });
    });
};

var get_artistById = (req, res) => {
    var id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(404).json(config.http.error.objectid_404);
    req.db.collection(COLLECTIONARTIST).findOne({
        _id: new ObjectId(id)
    }, {
        wordCount: 0,
        rdf: 0
    }, (err, artist) => {
        if (err) return res.status(404).json(config.http.error.internal_error_404);
        return res.json(artist);
    });
};
var get_artistByName = (req, res) => {
    var artistName = req.params.artistName;
    req.db.collection(COLLECTIONARTIST).findOne({
        name: artistName
    }, {
        wordCount: 0,
        rdf: 0
    }, (err, artist) => {
        if (err) return res.status(404).json(config.http.error.internal_error_404);
        return res.json(artist);
    });
};
var get_albumById = (req, res) => {
    var id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(404).json(config.http.error.objectid_404);
    req.db.collection(COLLECTIONALBUM).findOne({
        _id: new ObjectId(id)
    }, {
        wordCount: 0,
        rdf: 0
    }, (err, album) => {
        if (err) return res.status(404).json(config.http.error.internal_error_404);
        return res.json(album);
    });
};
var get_songAll = (req, res) => {
    var project = {},
        start = Number.parseInt(req.params.start);
    if (!Number.isInteger(start) || start < 0) return res.status(404).json(config.http.error.global_404);
    if (req.query.project) {
        var splitedquery = req.query.project.split(",");
        for (var i = 0; i < splitedquery.length; i++) project[splitedquery[i]] = 1;
    } else {
        project = {
            wordCount: 0,
            rdf: 0,
            availableCountries: 0
        }
    }
    req.db.collection(COLLECTIONSONG).find({}, project).skip(start).limit(LIMIT).toArray((err, songs) => {
        if (err) return res.status(404).json(config.http.error.internal_error_404);
        return res.json(songs);
    });
};
var get_songById = (req, res) => {
    var id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(404).json(config.http.error.objectid_404);
    req.db.collection(COLLECTIONSONG).findOne({
        _id: new ObjectId(id)
    }, {
        wordCount: 0,
        rdf: 0
    }, (err, song) => {
        if (err) return res.status(404).json(config.http.error.internal_error_404);
        return res.json(song);
    });
};
var get_memberByName = (req, res) => {
    var memberName = req.params.memberName.trim();
    req.db.collection(COLLECTIONARTIST).find({
        "members.name": memberName
    }, {
        wordCount: 0,
        rdf: 0
    }).toArray((err, artists) => {
        if (err) return res.status(404).json(config.http.error.internal_error_404);
        return res.json(artists);
    });
};
var get_animuxAll = (req, res) => {
    var start = Number.parseInt(req.params.start);
    if (!Number.isInteger(start) || start < 0) return res.status(404).json(config.http.error.global_404);
    req.db.collection(COLLECTIONSONG).find({
        animux_path: {
            $exists: 1
        }
    }, {
        wordCount: 0,
        rdf: 0,
    }).skip(start).limit(LIMIT).toArray((err, songs) => {
        if (err || !songs.length) return res.status(404).json(config.http.error.internal_error_404);
        return res.json(songs);
    });
};

var get_artistGenresByPopularity = (req, res) => {
    var limit = Number.parseInt(req.query.limit) || 20,
        skip = Number.parseInt(req.query.skip) || 0;
    if (limit < 0 || skip < 0 || limit > 500) return res.status(404).json(config.http.error.global_404);
    req.db.collection(COLLECTIONARTIST).aggregate([{
        "$unwind": "$genres"
    }, {
        "$group": {
            "_id": "$genres",
            "sum": {
                "$sum": 1
            }
        }
    }, {
        "$project": {
            "genres": 1,
            "sum": 1
        }
    }, {
        "$sort": {
            "sum": -1
        }
    }, {
        "$skip": skip
    }, {
        "$limit": limit
    }], (err, result) => {
        if (err) return res.status(404).json(config.http.error.internal_error_404);
        return res.json(result);
    });
};

var get_artistLabelsByPopularity = (req, res) => {
    var limit = Number.parseInt(req.query.limit) || 20,
        skip = Number.parseInt(req.query.skip) || 0;
    if (limit < 0 || skip < 0 || limit > 500) return res.status(404).json(config.http.error.global_404);
    req.db.collection(COLLECTIONARTIST).aggregate([{
        "$unwind": "$labels"
    }, {
        "$group": {
            "_id": "$labels",
            "sum": {
                "$sum": 1
            }
        }
    }, {
        "$project": {
            "labels": 1,
            "sum": 1
        }
    }, {
        "$sort": {
            "sum": -1
        }
    }, {
        "$skip": skip
    }, {
        "$limit": limit
    }], (err, result) => {
        if (err) return res.status(404).json(config.http.error.internal_error_404);;
        return res.json(result);
    });
};


var get_artistCountryByPopularity = (req, res) => {
    var limit = Number.parseInt(req.query.limit) || 20,
        skip = Number.parseInt(req.query.skip) || 0;
    if (limit < 0 || skip < 0 || limit > 500) return res.status(404).json(config.http.error.global_404);
    req.db.collection(COLLECTIONARTIST).aggregate([{
        "$match": {
            "location.country": {
                "$exists": true,
                "$ne": ""
            }
        }
    }, {
        "$group": {
            "_id": "$location.country",
            "sum": {
                "$sum": 1
            }
        }
    }, {
        "$project": {
            "location.country": 1,
            "sum": 1
        }
    }, {
        "$sort": {
            "sum": -1
        }
    }, {
        "$skip": skip
    }, {
        "$limit": limit
    }], (err, result) => {
        if (err) return res.status(404).json(config.http.error.internal_error_404);;
        return res.json(result);
    });
};

var get_artistCityByPopularity = (req, res) => {
    var limit = Number.parseInt(req.query.limit) || 20,
        skip = Number.parseInt(req.query.skip) || 0;
    if (limit < 0 || skip < 0 || limit > 500) return res.status(404).json(config.http.error.global_404);
    req.db.collection(COLLECTIONARTIST).aggregate([{
        "$match": {
            "location.city": {
                "$exists": true,
                "$ne": ""
            }
        }
    }, {
        $group: {
            _id: "$location.id_city_musicbrainz",
            sum: {
                $sum: 1
            },
            city: {
                $first: "$location.city"
            }
        }
    }, {
        $sort: {
            sum: -1
        }
    }, {
        "$skip": skip
    }, {
        "$limit": limit
    }], (err, result) => {
        if (err) return res.status(404).json(config.http.error.internal_error_404);;
        return res.json(result);
    });
};

var get_artistInstrumentByPropularity = (req, res) => {
    var limit = Number.parseInt(req.query.limit) || 20,
        skip = Number.parseInt(req.query.skip) || 0,
        order = (Number.parseInt(req.query.order) == 1) ? 1 : -1;
    if (limit < 0 || skip < 0 || limit > 500) return res.status(404).json(config.http.error.global_404);
    req.db.collection(COLLECTIONARTIST).aggregate([{
        $unwind: "$members"
    }, {
        $unwind: "$members.instruments"
    }, {
        $group: {
            _id: "$members.instruments",
            sum: {
                $sum: 1
            }
        }
    }, {
        $sort: {
            sum: order
        }
    }, {
        $skip: skip
    }, {
        $limit: limit
    }], (err, result) => {
        if (err) return res.status(404).json(config.http.error.internal_error_404);;
        return res.json(result);
    });
};
var get_songProducerByPropularity = (req, res) => {
    var limit = Number.parseInt(req.query.limit) || 20,
        skip = Number.parseInt(req.query.skip) || 0;
    if (limit < 0 || skip < 0 || limit > 500) return res.status(404).json(config.http.error.global_404);
    req.db.collection(COLLECTIONSONG).aggregate([{
        $unwind: "$producer"
    }, {
        $group: {
            _id: '$producer',
            sum: {
                $sum: 1
            }
        }
    }, {
        $project: {
            producer: 1,
            sum: 1
        }
    }, {
        $sort: {
            sum: -1
        }
    }, {
        $skip: skip
    }, {
        $limit: limit
    }], (err, result) => {
        if (err) return res.status(404).json(config.http.error.internal_error_404);;
        return res.json(result);
    });
};


var get_artistWithMostSong = (req, res) => {
    var limit = Number.parseInt(req.query.limit) || 20,
        skip = Number.parseInt(req.query.skip) || 0;
    if (limit < 0 || skip < 0 || limit > 500) return res.status(404).json(config.http.error.global_404);
    req.db.collection(COLLECTIONSONG).aggregate([{
        "$group": {
            _id: "$name",
            sum: {
                $sum: 1
            }
        }
    }, {
        $sort: {
            sum: -1
        }
    }, {
        $skip: skip
    }, {
        $limit: limit
    }], (err, result) => {
        if (err) return res.status(404).json(config.http.error.internal_error_404);;
        return res.json(result);
    });
};
var get_lyricsLanguageByPopularity = (req, res) => {
    req.db.collection("_stats_lang").find({}).toArray((err, statsLang) => {
        if (err) return res.status(404).json(config.http.error.internal_error_404);;
        return res.json(statsLang);
    });
}

var get_artistWithMostAlbum = (req, res) => {
    var limit = Number.parseInt(req.query.limit) || 20,
        skip = Number.parseInt(req.query.skip) || 0;
    if (limit < 0 || skip < 0 || limit > 500) return res.status(404).json(config.http.error.global_404);
    req.db.collection(COLLECTIONALBUM).aggregate([{
        "$group": {
            _id: "$id_artist",
            sum: {
                $sum: 1
            },
            name: {
                $first: "$name"
            },
        }
    }, {
        $project: {
            "name": 1,
            sum: 1
        }
    }, {
        $sort: {
            sum: -1
        }
    }, {
        $skip: skip
    }, {
        $limit: limit
    }], (err, result) => {
        if (err) return res.status(404).json(config.http.error.internal_error_404);;
        return res.json(result);
    });
};


var get_artistMemberWithMostGroup = (req, res) => {
    var limit = Number.parseInt(req.query.limit) || 20,
        skip = Number.parseInt(req.query.skip) || 0;
    if (limit < 0 || skip < 0 || limit > 500) return res.status(404).json(config.http.error.global_404);
    req.db.collection(COLLECTIONARTIST).aggregate([{
        $match: {
            type: "Group"
        }
    }, {
        $unwind: "$members"
    }, {
        $group: {
            _id: "$members.id_member_musicbrainz",
            sum: {
                $sum: 1
            },
            membername: {
                $first: "$members.name"
            },
        }
    }, {
        $sort: {
            sum: -1
        }
    }, {
        $skip: skip
    }, {
        $limit: limit
    }], (err, result) => {
        if (err) return res.status(404).json(config.http.error.internal_error_404);;
        return res.json(result);
    });
};

var get_statsArtistCount = (req, res) => {
    req.db.collection(COLLECTION_STATS_PROP_ARTIST).find({}).toArray((err, statsPropArtist) => {
        if (err) return res.status(404).json(config.http.error.internal_error_404);;
        return res.json(statsPropArtist);
    });
}
var get_statsAlbumCount = (req, res) => {
    req.db.collection(COLLECTION_STATS_PROP_ALBUM).find({}).toArray((err, statsPropAlbum) => {
        if (err) return res.status(404).json(config.http.error.internal_error_404);;
        return res.json(statsPropAlbum);
    });
}
var get_statsSongCount = (req, res) => {
    req.db.collection(COLLECTION_STATS_PROP_SONG).find({}).toArray((err, statsPropSong) => {
        if (err) return res.status(404).json(config.http.error.internal_error_404);;
        return res.json(statsPropSong);
    });
}

exports.get_artistAll = get_artistAll;
exports.get_artistAllById = get_artistAllById;
exports.get_artistAllByName = get_artistAllByName;
exports.get_artistById = get_artistById;
exports.get_artistByName = get_artistByName;
exports.get_albumById = get_albumById;
exports.get_songById = get_songById;
exports.get_songAll = get_songAll;
exports.get_memberByName = get_memberByName;
exports.get_animuxAll = get_animuxAll;
exports.get_artistGenresByPopularity = get_artistGenresByPopularity;
exports.get_artistLabelsByPopularity = get_artistLabelsByPopularity;
exports.get_artistCountryByPopularity = get_artistCountryByPopularity;
exports.get_artistCityByPopularity = get_artistCityByPopularity;
exports.get_songProducerByPropularity = get_songProducerByPropularity;
exports.get_artistWithMostAlbum = get_artistWithMostAlbum;
exports.get_artistWithMostSong = get_artistWithMostSong;
exports.get_lyricsLanguageByPopularity = get_lyricsLanguageByPopularity;
exports.get_artistInstrumentByPropularity = get_artistInstrumentByPropularity;
exports.get_artistMemberWithMostGroup = get_artistMemberWithMostGroup;
exports.get_statsArtistCount = get_statsArtistCount;
exports.get_statsAlbumCount = get_statsAlbumCount;
exports.get_statsSongCount = get_statsSongCount;