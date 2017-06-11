import request from 'request';
import express from 'express';
import config from '../conf/conf';
import LanguageDetect from 'languagedetect';
import utilHandler from './utilHandler';
import {
    ObjectId
} from 'mongoskin';

const COLLECTIONSONG = config.database.collection_song;

var detectLanguage = (req, res) => {
    var skip = 0,
        limit = 10000,
        lngDetector = new LanguageDetect();
    console.log("Dans detectLanguage");
    req.db.collection(COLLECTIONSONG).count({}, function (err, nbSong) {
        console.log(nbSong);
        (function loop(skip) {
            if (skip < nbSong) {
                var i = 0;
                req.db.collection(COLLECTIONSONG).find({}, {
                    "lyrics": 1
                }).skip(skip).limit(limit).toArray(function (err, tObj) {
                    skip += tObj.length;
                    (function it(i) {
                        var language = "",
                            lyrics = tObj[i].lyrics.replace(/<br>/g, ' ');
                        lyrics = utilHandler.decodeHtmlEntities(lyrics);
                        if (lngDetector.detect(lyrics)[0]) {
                            var languages = lngDetector.detect(lyrics);
                            language = languages[0][0];
                            if (languages[0][0] == "pidgin") language = languages[1][0];
                        }
                        req.db.collection(COLLECTIONSONG).updateOne({
                            _id: ObjectId(tObj[i]._id)
                        }, {
                            $set: {
                                "language_detect": language
                            }
                        }, (err) => {
                            if (err) throw err;
                            if (i < tObj.length - 1) {
                                if (!(i % 5000)) console.log((i + ' updated'));
                                it(i + 1);
                            } else {
                                console.log("On passe au " + skip);
                                loop(skip);
                            }
                        });
                    })(i);
                })
            } else {
                console.log("TRAITEMENT TERMINE");
            }
        })(skip);
    });
    res.send("OK");
};


var updateLanguagePopularity = (req, res) => {
    req.db.collection(COLLECTIONSONG).aggregate([{
        "$match": {
            "language_detect": {
                "$exists": true,
                "$ne": ""
            }
        }
    }, {
        $group: {
            _id: "$language_detect",
            sum: {
                $sum: 1
            }
        }
    }, {
        $sort: {
            sum: -1
        }
    }, {
        "$out": "_stats_lang"
    }], (err, result) => {
        if (err) return res.status(404).json(config.http.error.internal_error_404);
    });
    return res.json(config.http.valid.send_message_ok);
}

exports.detectLanguage = detectLanguage;
exports.updateLanguagePopularity = updateLanguagePopularity;