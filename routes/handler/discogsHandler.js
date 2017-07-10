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
const PATH_LABEL_DISCOGS = "./mongo/discogs/discogs_20170701_labels_test.xml";

var getAddFieldsIdArtistDiscogs = (req, res) => {
    getAddIdDiscogs(req.db, COLLECTIONARTIST);
    res.json(config.http.valid.send_message_ok);
};

var getAllArtists = (req, res) => {
    //To run this API you have to download the latest dump of artist from discogs: http://data.discogs.com/?prefix=data/2017/ and put it in mongo/discogs
    getXMLAndUpdateAll(req.db, COLLECTIONARTIST, updateFieldsArtistsDiscogsFromXML);
    res.json(config.http.valid.send_message_ok);
};

var getAllAlbums = (req, res) => {
    getAndUpdateAll(req.db, COLLECTIONARTIST, updateFieldsAlbumsDiscogs);
    res.json(config.http.valid.send_message_ok);
};

var getAllSongs = (req, res) => {
    getAndUpdateAll(req.db, COLLECTIONARTIST, updateFieldsSongsDiscogs);
    res.json(config.http.valid.send_message_ok);
};

var getXMLAndUpdateAll = (db, collection, updateFieldsCollectionDiscogs) => {
    var lineNr = 0,
        currXmlObject = "",
        options = {
            flags: 'w',
            autoClose: true
        },
        nbLineRead = 0,
        loggerNotFound = fs.createWriteStream("./mongo/discogs/test_debug_discogsHandler.json", options);
    var s = fs.createReadStream(PATH_ARTIST_DISCOGS).pipe(es.split()).pipe(es.mapSync(function (line) {
        // pause the readstream
        s.pause();
        lineNr += 1;
        var line = line.trim();
        //Some xml object are splitted in several lines, so we need to join it in the same object : currXmlObject
        if ((!/^<artists>/i.test(line)) && (!/^<\/artists>/i.test(line))) {
            if (/^<artist>/i.test(line)) {
                //It's a new line, we must parse to json the string
                if (currXmlObject.length) {
                    if (!(nbLineRead % 10000)) console.log(nbLineRead + " lines read");
                    nbLineRead++;
                    parseAndUpdate(db, collection, updateFieldsCollectionDiscogs, currXmlObject);
                }
                //we set to empty currXmlObject
                currXmlObject = "";
            }
            currXmlObject += line;
        } else {
            if (/^<\/artists>/i.test(line)) parseAndUpdate(db, collection, updateFieldsCollectionDiscogs, currXmlObject);
        }
        // resume the readstream, possibly from a callback
        s.resume();
    }).on('error', (err) => console.log('Error while reading file.', err)).on('end', () => console.log('Read entire file.')));
};



var getAddIdDiscogs = (db, collection) => {
    var skip = 0,
        limit = 10000,
        query = {
            urlDiscogs: {
                $ne: ""
            }
        },
        projection = {
            rdf: 0,
            wordCount: 0
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
                        console.log(id, tObj[i]._id);
                        db.collection(collection).updateOne({
                            _id: new ObjectId(tObj[i]._id)
                        }, {
                            $set: {
                                id_artist_discogs: id
                            }
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


/**
/ * We fill oArtist to save it in our database 
/ * @param {*} oArtist artist object to save in our database
/ * @param {*} oDiscogs discogs object, we will extract data from this object
/ */
var updateFieldsArtistsDiscogsFromXML = (oArtist, oDiscogs) => {
    oArtist.id_artist_discogs = oDiscogs.artist.id[0];
    oArtist.abstract = oDiscogs.artist.hasOwnProperty('profile') ? oDiscogs.artist.profile[0] : "";
    oArtist.nameVariations = oDiscogs.artist.hasOwnProperty('namevariations') ? oDiscogs.artist.namevariations[0].name : [];
    oArtist.urls = oDiscogs.artist.hasOwnProperty('urls') ? oDiscogs.artist.urls[0].url : [];
};
var updateFieldsArtistMemberDiscogs = (oArtist, oDiscogs) => {
    console.log(membersDiscogs.length);
    console.log(oArtist.members.length);
    //We retrieve the API from discogs about a member of a band
};
var updateFieldsAlbumsDiscogs = (oAlbum, oDiscogs) => {};
var updateFieldsSongsDiscogs = (oSong, oDiscogs) => {};


var parseAndUpdate = (db, collection, updateFieldsCollectionDiscogs, xml) => {
    parseString(xml, (err, objectXMLDiscogs) => {
        if (err) console.log(err);
        var objArtist = {};
        updateFieldsCollectionDiscogs(objArtist, objectXMLDiscogs);
        db.collection(collection).updateOne({
            id_artist_discogs: objArtist.id_artist_discogs
        }, {
            $set: objArtist
        });
    });
};
exports.getAllArtists = getAllArtists;
exports.getAllAlbums = getAllAlbums;
exports.getAllSongs = getAllSongs;
exports.getAddFieldsIdArtistDiscogs = getAddFieldsIdArtistDiscogs;