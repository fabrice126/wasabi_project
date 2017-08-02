import request from 'request';
import express from 'express';
import config from '../conf/conf';
import utilHandler from '../handler/utilHandler';
import {
    ObjectId
} from 'mongoskin';
const COLLECTIONARTIST = config.database.collection_artist;
const COLLECTIONALBUM = config.database.collection_album;
const COLLECTIONSONG = config.database.collection_song;

const COLLECTION_STATS_PROP_ARTIST = config.database.collection_stats_prop_artist;
const COLLECTION_STATS_PROP_ALBUM = config.database.collection_stats_prop_album;
const COLLECTION_STATS_PROP_SONG = config.database.collection_stats_prop_song;

var updatePropertiesStatsArtist = (req, res) => {
    updatePropertiesStatsCollection(COLLECTIONARTIST, COLLECTION_STATS_PROP_ARTIST, req.db);
    return res.json(config.http.valid.send_message_ok);
};

var updatePropertiesStatsAlbum = (req, res) => {
    updatePropertiesStatsCollection(COLLECTIONALBUM, COLLECTION_STATS_PROP_ALBUM, req.db);
    return res.json(config.http.valid.send_message_ok);
};
var updatePropertiesStatsSong = (req, res) => {
    updatePropertiesStatsCollection(COLLECTIONSONG, COLLECTION_STATS_PROP_SONG, req.db);
    return res.json(config.http.valid.send_message_ok);
}

var updatePropertiesStatsCollection = (collection, collectionStats, db) => {
    db.collection(collectionStats).find({}).toArray((err, result) => {
        if (err) return res.status(404).json(config.http.error.internal_error_404);
        var totalFields = result.length,
            i = 0;
        result.forEach((property) => {
            var query = {
                $and: [{
                    [property._id]: {
                        $exists: 1
                    }
                }, {
                    [property._id]: {
                        $ne: ""
                    }
                }, {
                    [property._id]: {
                        $ne: []
                    }
                }]
            };
            ((property) => {
                db.collection(collection).count(query, (err, result) => {
                    if (err) console.error(err);
                    console.log(++i + "/" + totalFields + " --> " + collection + " - " + property + " ==> " + result);
                    db.collection(collectionStats).updateOne({
                        _id: property
                    }, {
                        $set: {
                            value: result
                        }
                    });
                    if (i == totalFields) return console.log("Traitement terminé");
                });
            })(property._id)
        });
    });
};
exports.updatePropertiesStatsArtist = updatePropertiesStatsArtist;
exports.updatePropertiesStatsAlbum = updatePropertiesStatsAlbum;
exports.updatePropertiesStatsSong = updatePropertiesStatsSong;