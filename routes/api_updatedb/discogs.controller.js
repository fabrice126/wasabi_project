import request from 'request';
import express from 'express';
import config from '../conf/conf';
import fs from 'fs';
import util from 'util';
import stream from 'stream';
import es from 'event-stream';
import {
    ObjectId
} from 'mongoskin';
import {
    parseString
} from 'xml2js';

const COLLECTIONARTIST = config.database.collection_artist;
const COLLECTIONALBUM = config.database.collection_album;
const COLLECTIONSONG = config.database.collection_song;
const PATH_ARTIST_DISCOGS = "./mongo/discogs/discogs_20170701_artists.xml";
const PATH_RELEASE_DISCOGS = "./mongo/discogs/discogs_20170701_releases.xml";
const LIMIT_XML = 10000;

var createRegexObject = function (root, node) {
    return {
        root: {
            start: new RegExp('^<' + root + '>', 'i'),
            end: new RegExp('^<\/' + root + '>', 'i'),
        },
        node: new RegExp('^<' + node + '>', 'i')
    };
}
//Add the field id_artist_discogs to each album with an urlDiscogs
var getAddFieldsIdArtistDiscogs = (req, res) => {
    getAddIdCollectionDiscogs(req.db, COLLECTIONARTIST, "id_artist_discogs");
    res.json(config.http.valid.send_message_ok);
};
//Add the field id_member_discogs to each member with an urlDiscogs
var getAddFieldsIdMemberDiscogs = (req, res) => {
    getAddIdMemberDiscogs(req.db, COLLECTIONARTIST);
    res.json(config.http.valid.send_message_ok);
};
//Add the field id_album_discogs to each album with an urlDiscogs
var getAddFieldsIdAlbumDiscogs = (req, res) => {
    getAddIdCollectionDiscogs(req.db, COLLECTIONALBUM, "id_album_discogs");
    res.json(config.http.valid.send_message_ok);
};

var getAllArtists = (req, res) => {
    //To run this API you have to download the latest dump of artist from discogs: http://data.discogs.com/?prefix=data/2017/ and put it in mongo/discogs
    getXMLAndUpdateAll(req.db, COLLECTIONARTIST, updateFieldsArtistsDiscogsFromXML, PATH_ARTIST_DISCOGS, 'artist');
    res.json(config.http.valid.send_message_ok);
};
var getAllArtistsMembers = (req, res) => {
    //To run this API you have to download the latest dump of artist from discogs: http://data.discogs.com/?prefix=data/2017/ and put it in mongo/discogs
    getXMLAndUpdateAll(req.db, COLLECTIONARTIST, updateFieldsArtistsMembersDiscogsFromXML, PATH_ARTIST_DISCOGS, 'artist');
    res.json(config.http.valid.send_message_ok);
};
var getAllAlbums = (req, res) => {
    //To run this API you have to download the latest dump of release from discogs: http://data.discogs.com/?prefix=data/2017/ and put it in mongo/discogs
    getXMLAndUpdateAll(req.db, COLLECTIONALBUM, updateFieldsAlbumsDiscogsFromXML, PATH_RELEASE_DISCOGS, 'release');
    res.json(config.http.valid.send_message_ok);
};

var getXMLAndUpdateAll = (db, collection, updateFieldsCollectionDiscogs, path_discogs, discogsTag) => {
    var currXmlObject = "",
        options = {
            flags: 'w',
            autoClose: true
        },
        nbLineRead = 0,
        nbObject = 0,
        startAtLine = 0,
        oRegex = createRegexObject(discogsTag + 's', discogsTag),
        loggerNotFound = fs.createWriteStream("./mongo/discogs/test_debug_discogsHandler.json", options);
    var s = fs.createReadStream(path_discogs).pipe(es.split()).pipe(es.mapSync(function (line) {
        // pause the readstream
        s.pause();
        nbLineRead++;
        if (nbLineRead < startAtLine) {
            console.log('nbLineRead < startAtLine');
            s.resume();
        } else {
            var line = line.trim();
            //Some xml object are splitted in several lines, so we need to join it in the same object : currXmlObject
            if ((!oRegex.root.start.test(line)) && (!oRegex.root.end.test(line))) {
                if (oRegex.node.test(line)) {
                    //It's a new line, we must parse to json the string
                    if (currXmlObject.length) {
                        //We found the entire artist object
                        nbObject++;
                        parseAndUpdate(db, collection, updateFieldsCollectionDiscogs, currXmlObject, nbObject, loggerNotFound)
                    }
                    //we set to empty currXmlObject
                    currXmlObject = "";
                }
                currXmlObject += line;
            } else {
                if (oRegex.root.end.test(line)) parseAndUpdate(db, collection, updateFieldsCollectionDiscogs, currXmlObject, nbObject);
            }
            // resume the readstream, possibly from a callback
            if (!(nbObject % LIMIT_XML)) {
                console.log("\n------------------------------------" + nbObject + " object read TIMEOUT------------------------------------");
                setTimeout(() => {
                    console.log("------------------------------------TIMEOUT ENDED, RESUME------------------------------------");
                    s.resume();
                }, 1000)
            } else s.resume();
        }
    }).on('error', (err) => console.log('Error while reading file.', err)).on('end', () => console.log('Read entire file.')));
};

var getAddIdCollectionDiscogs = (db, collection, id_field) => {
    var skip = 0,
        limit = 10000,
        query = {
            $and: [{
                urlDiscogs: {
                    $exists: 1
                }
            }, {
                urlDiscogs: {
                    $ne: ""
                }
            }]
        },
        projection = {
            urlDiscogs: 1,
            _id: 1
        };
    db.collection(collection).count(query, function (err, nbObj) {
        console.log("There are " + nbObj + " " + collection + " with an id discogs");
        (function fetchObj(skip) {
            var nb = 0;
            if (skip < nbObj) {
                console.log("skip begin = " + skip);
                db.collection(collection).find(query, projection).skip(skip).limit(limit).toArray(function (err, tObj) {
                    var i = 0;
                    (function loop(i) {
                        let url = tObj[i].urlDiscogs,
                            id = url.substring(url.lastIndexOf('/') + 1, url.length);
                        var addId = {
                            [id_field]: id
                        };
                        db.collection(collection).updateOne({
                            _id: new ObjectId(tObj[i]._id)
                        }, {
                            $set: addId
                        }, function (err) {
                            if (err) throw err;
                            nb++;
                            if (nb == tObj.length) {
                                skip += limit;
                                console.log("SKIP = " + skip);
                                fetchObj(skip);
                            } else {
                                i++
                                loop(i);
                            }
                        });
                    })(i);
                });
            } else console.log("TRAITEMENT TERMINE");
        })(skip);
    });
}

var getAddIdMemberDiscogs = (db, collection) => {
    var skip = 0,
        limit = 5000,
        query = {
            "members.urlDiscogs": {
                $exists: 1
            }
        },
        projection = {
            "_id": 1,
            "members": 1
        };
    db.collection(collection).count(query, function (err, nbObj) {
        console.log("There are " + nbObj + " " + collection + " with an id discogs");
        (function fetchObj(skip) {
            var nb = 0;
            if (skip < nbObj) {
                console.log("skip begin = " + skip);
                db.collection(collection).find(query, projection).skip(skip).limit(limit).toArray((err, tObj) => {
                    var i = 0;
                    (function loop(i) {
                        for (var j = 0, l = tObj[i].members.length; j < l; j++) {
                            if (tObj[i].members[j].urlDiscogs) {
                                let url = tObj[i].members[j].urlDiscogs,
                                    id = url.substring(url.lastIndexOf('/') + 1, url.length);
                                tObj[i].members[j].id_member_discogs = id;
                            }
                        }
                        db.collection(collection).updateOne({
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
                            } else loop(++i);
                        });
                    })(i);
                });
            } else console.log("TRAITEMENT TERMINE");
        })(skip);
    });
}

/**
/ * We fill oArtist to save it in our database 
/ * @param {*} oArtist artist object to save in our database
/ * @param {*} oDiscogs discogs object, we will extract data from this object
/ */
var updateFieldsArtistsDiscogsFromXML = (db, collection, oArtist, oDiscogs) => {
    oArtist.id_artist_discogs = oDiscogs.artist.id[0];
    oArtist.abstract = oDiscogs.artist.hasOwnProperty('profile') ? oDiscogs.artist.profile[0] : "";
    oArtist.nameVariations = oDiscogs.artist.hasOwnProperty('namevariations') ? oDiscogs.artist.namevariations[0].name : [];
    oArtist.urls = oDiscogs.artist.hasOwnProperty('urls') ? oDiscogs.artist.urls[0].url : [];
    if (oArtist.abstract && oArtist.abstract.match(/\[(.*?)\]/gi)) {
        //replace "[a=artist name]" by "artist name" which match with this regex "[l=label name]" by "label name"
        //then replace all square brackets containing matching : [b][/b] or [i] [/i] etc.
        oArtist.abstract = oArtist.abstract.replace(/\[a=(.*?)\]/gi, "$1").replace(/\[l=(.*?)\]/gi, "$1").replace(/\[\/?[a-zA-Z]\]/gi, "");
    }
    db.collection(collection).updateMany({
        id_artist_discogs: oArtist.id_artist_discogs
    }, {
        $set: oArtist
    });
};

var updateFieldsArtistsMembersDiscogsFromXML = (db, collection, oArtist, oDiscogs, nbObject) => {
    oArtist.id_member_discogs = oDiscogs.artist.hasOwnProperty('id') ? oDiscogs.artist.id[0] : "";
    oArtist.realName = oDiscogs.artist.hasOwnProperty('realname') ? oDiscogs.artist.realname[0] : "";
    oArtist.abstract = oDiscogs.artist.hasOwnProperty('profile') ? oDiscogs.artist.profile[0] : "";
    oArtist.nameVariations = oDiscogs.artist.hasOwnProperty('namevariations') ? oDiscogs.artist.namevariations[0].name : [];
    oArtist.urls = oDiscogs.artist.hasOwnProperty('urls') ? oDiscogs.artist.urls[0].url : [];
    if (oArtist.abstract && oArtist.abstract.match(/\[(.*?)\]/gi)) {
        //replace "[a=artist name]" by "artist name" which match with this regex, then replace all square brackets containing characters
        oArtist.abstract = oArtist.abstract.replace(/\[a=(.*?)\]/gi, "$1").replace(/\[l=(.*?)\]/gi, "$1").replace(/\[\/?[a-zA-Z]\]/gi, "");
    }
    db.collection(collection).updateMany({
        "members.id_member_discogs": oArtist.id_member_discogs,
    }, {
        $set: {
            "members.$.realName": oArtist.realName,
            "members.$.abstract": oArtist.abstract,
            "members.$.nameVariations": oArtist.nameVariations,
            "members.$.urls": oArtist.urls
        }
    }, (err) => {
        if (err) console.log(err);
        if (!(nbObject % LIMIT_XML)) console.log(nbObject + " Object updated");
    });
};
var updateFieldsAlbumsDiscogsFromXML = (db, collection, oAlbum, oDiscogs, nbObject) => {
    console.log("Dans updateFieldsAlbumsDiscogsFromXML");
    // db.collection(collection).updateOne({
    //     id_album_discogs: oAlbum.id_album_discogs
    // }, {
    //     $set: oAlbum
    // });
};

var parseAndUpdate = (db, collection, updateFieldsCollectionDiscogs, xml, nbObject, loggerNotFound) => {
    parseString(xml, (err, objectXMLDiscogs) => {
        if (err) console.log(err);
        var objArtist = {};
        // loggerNotFound.write(objectXMLDiscogs + "\n");
        if (objectXMLDiscogs) updateFieldsCollectionDiscogs(db, collection, objArtist, objectXMLDiscogs, nbObject);
        else console.log("OBJ ARTIST UNDEFINED");
    });
};
exports.getAllArtists = getAllArtists;
exports.getAllAlbums = getAllAlbums;
exports.getAllArtistsMembers = getAllArtistsMembers;
exports.getAddFieldsIdArtistDiscogs = getAddFieldsIdArtistDiscogs;
exports.getAddFieldsIdMemberDiscogs = getAddFieldsIdMemberDiscogs;
exports.getAddFieldsIdAlbumDiscogs = getAddFieldsIdAlbumDiscogs;