import express from 'express';
import request from 'request';
import config from './conf/conf';
import fs from "fs";
import path from 'path';
import utilHandler from './handler/utilHandler.js';
// TODO  a supprimer afin d'utiliser les promises
import Q from 'q';
const router = express.Router();



// // routing MT5/
// app.get('/', function (req, res) {
//     res.sendfile(__dirname + '/index.html');
// });
router.get('/', function (req, res) {
    console.log(path.join(__dirname, '../public/my_components/MT5/index.html'));
    res.sendFile(path.join(__dirname, '../public/my_components/MT5/index.html'));
});
// routing MT5/track
router.get('/track', function (req, res) {
    console.log("DEDANS /TRACK");

    function sendTracks(trackList) {
        if (!trackList)
            return res.status(404).send('No track found');
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(trackList));
        res.end();
    }
    getTracks(sendTracks);
});

// routing
router.get('/track/:dir/:id', function (req, res) {
    var id = req.params.id;
    var dir = req.params.dir;
    id = utilHandler.encodePathWindows(id);

    function sendTrack(track) {
        if (!track)
            return res.send(404, 'Track not found with id "' + id + '"');
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(track));
        res.end();
    }
    getTrack(id, dir, sendTrack);
});

function getTracks(callback) {
    getFiles(config.MT5.TRACKS_PATH, callback);
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function isASoundFile(fileName) {
    if (endsWith(fileName, ".mp3")) return true;
    if (endsWith(fileName, ".ogg")) return true;
    if (endsWith(fileName, ".wav")) return true;
    return false;
}

function getTrack(id, dir, callback) {
    if (!id) return;
    getFiles(config.MT5.TRACKS_PATH + dir + '/' + id, function (fileNames) {
        if (!fileNames) {
            callback(null);
            return;
        }
        var track = {
            id: id,
            instruments: []
        };
        fileNames.sort();
        for (var i = 0; i < fileNames.length; i++) {
            // filter files that are not sound files
            if (isASoundFile(fileNames[i])) {
                var instrument = fileNames[i].match(/(.*)\.[^.]+$/, '')[1];
                track.instruments.push({
                    name: instrument,
                    sound: fileNames[i]
                });
            } else {
                continue;
            }
        }
        //  heck if there is a metadata.json file
        checkForMetaDataFile(track, id, callback);
    });
}

function checkForMetaDataFile(track, id, callback) {
    var metadataFileName = config.MT5.TRACKS_PATH + id + '/' + 'metadata.json';

    Q.nfcall(fs.readFile, metadataFileName, "utf-8")
        .then(function (data) {
            //console.log('##metadata.json file has been read for track: '+id);
            track.metadata = JSON.parse(data);
            track.metadata.tabFileName = config.MT5.TRACKS_URL + id + '/' + track.metadata.tabFileName;
            //console.log(track.metadata.tabFileName);
        })
        .fail(function (err) {
            //console.log('no metadata.json file for this song: '+id);
        })
        .done(function () {
            //console.log("calling callback");
            callback(track);
        });
}


function comparator(prop) {
    return function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    };

}

function getFiles(dirName, callback) {
    fs.readdir(dirName, function (error, directoryObject) {
        if (directoryObject !== undefined) {
            directoryObject.sort();
        } else {
            console.log(error);
        }
        callback(directoryObject);
    });
}

export default router;