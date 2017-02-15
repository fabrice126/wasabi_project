import express from 'express';
import config from './conf/conf.json';
import request from 'request';
import {
    ObjectId
} from 'mongoskin';
const router = express.Router();
const COLLECTIONARTIST = config.database.collection_artist;
const COLLECTIONALBUM = config.database.collection_album;
const COLLECTIONSONG = config.database.collection_song;
const LIMIT = config.request.limit;


router.get('/artist_all/:start', function (req, res, next) {
    var db = req.db;
    var start = Number.parseInt(req.params.start);
    if (!Number.isInteger(start) || start < 0) {
        return res.status(404).send({
            error: config.http.error.global_404
        });
    }
    db.collection(COLLECTIONARTIST).find({}, {
        wordCount: 0,
        rdf: 0
    }).skip(start).limit(LIMIT).toArray((err, artists) => {
        for (var i = 0, l = artists.length; i < l; i++) {
            (function (i) {
                db.collection(COLLECTIONALBUM).find({
                    id_artist: artists[i]._id
                }, {
                    wordCount: 0,
                    rdf: 0
                }).toArray((err, albums) => {
                    artists[i].albums = albums;
                    for (var j = 0, k = albums.length; j < k; j++) {
                        (function (j) {
                            db.collection(COLLECTIONSONG).find({
                                id_album: albums[j]._id
                            }, {
                                wordCount: 0,
                                rdf: 0,
                                name: 0,
                                albumTitre: 0,
                                dateSortieAlbum: 0,
                                lengthAlbum: 0
                            }).toArray((err, songs) => {
                                artists[i].albums[j].songs = songs;
                                if (i == (artists.length - 1) && j == (artists[i].albums.length - 1)) {
                                    return res.json(artists);
                                }
                            });
                        })(j);
                    }
                });
            })(i);
        }
    });
});


//Une API pour tester si la ram est suffisante pour éxecuter l'api api/artist_all
router.get('/api_test/artist_all', (req, res) => {
    var start = 0;
    (function callRequest(start) {
        request('http://localhost/api/artist_all/' + start, (error, response, artists) => {
            var artists = JSON.parse(artists);
            start += LIMIT;
            if (!error && response.statusCode == 200) {
                console.log("LengthArtist = " + artists.length);
                if (artists.length != 200) {
                    console.log("C'est fini");
                    return true;
                } else {
                    callRequest(start)
                }
            } else {
                console.log("error = " + error);
                return false;
            }
        });
    })(start);
    res.json({
        "message": "OK"
    });
})


export default router;