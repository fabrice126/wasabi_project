import config from '../conf/conf';

/**
 *
 * @param field
 * @param tParamToFind
 * @returns {Array}
 */
var constructData = function (field, tParamToFind) {
    'use strict';
    var tObjectRequest, i, objRequest;
    tObjectRequest = [];
    for (i = 0; i < tParamToFind.length; i += 1) {
        objRequest = {};
        objRequest[field] = tParamToFind[i];
        tObjectRequest.push(objRequest);
    }
    return tObjectRequest;
};
/**
 * Fonction permettant d'optimiser le find de mongodb. En utilisant: /^AB/ /^Ab/ /^aB/ /^ab/ cela utilise l'index contrairement à lieu /^AB/i qui n'utilise pas l'index
 * @param lettre
 * @returns {Array}
 */
var optimizeFind = function (lettre) {
    var tParamToFind = [];
    if (lettre.length == 2) {
        tParamToFind.push(new RegExp('^' + lettre[0].toUpperCase() + lettre[1].toUpperCase()));
        tParamToFind.push(new RegExp('^' + lettre[0].toUpperCase() + lettre[1].toLowerCase()));
        tParamToFind.push(new RegExp('^' + lettre[0].toLowerCase() + lettre[1].toUpperCase()));
        tParamToFind.push(new RegExp('^' + lettre[0].toLowerCase() + lettre[1].toLowerCase()));
    } else {
        tParamToFind.push(new RegExp('^' + lettre.toUpperCase()));
        tParamToFind.push(new RegExp('^' + lettre.toLowerCase()));
    }
    return tParamToFind;
};

/**
 * Permet de construire les requetes elasticsearch
 * @param req
 * @param maxinfo
 * @param queryArtist
 * @param querySong
 * @param maxinfoselected
 * @returns {Promise}
 */
var fullTextQuery = function (req, maxinfo, queryArtist, querySong, maxinfoselected) {
    var promise = new Promise(function (resolve, reject) {
        var result = [];
        req.elasticsearchClient.search({
            index: config.database.index_artist,
            type: config.database.index_type_artist,
            body: queryArtist
        }).then(function (respArtists) {
            var artist = [];
            for (var i = 0; i < respArtists.hits.hits.length; i++) {
                artist.push(respArtists.hits.hits[i]._source);
            }
            req.elasticsearchClient.search({
                index: config.database.index_song,
                type: config.database.index_type_song,
                body: querySong
            }).then(function (respSongs) {
                var song = [];
                for (var i = 0; i < respSongs.hits.hits.length; i++) {
                    song.push(respSongs.hits.hits[i]._source);
                }
                if (artist.length < maxinfoselected) { //Si on a moins d'artiste que de musique on ajoute plus de musique
                    song = song.slice(0, maxinfoselected + maxinfoselected - artist.length);
                } else { //il y a autant de musique que d'artist
                    artist = artist.slice(0, maxinfoselected);
                    song = song.slice(0, maxinfoselected);
                }
                result = artist.concat(song);
                resolve(JSON.stringify(result));
            }, function (err) {
                reject("Error: Song " + err);
            });
        }, function (err) {
            reject("Error: Artist " + err);
        });
    });
    return promise;
};
/**
 *
 * @param req
 * @param objSong
 * @param idSong
 */
var updateSongES = function (req, objSong, idSong) {
    req.elasticsearchClient.update({
        index: config.database.index_song,
        type: config.database.index_type_song,
        id: idSong,
        body: {
            // put the partial document under the `doc` key
            doc: {
                "name": objSong.name,
                "albumTitle": objSong.albumTitle,
                "title": objSong.title
            }
        }
    }, function (err) {
        if (err) throw err;
    });
};
//Si un title de musique est modifié et qu'il comporte l'attribut multitrack_path (indiquant que cette musique possède du multipiste)
// alors on modifie le nom du dossier dans le filesystem et dans la bdd
var updateDirMultitrack = function (objSong) {

};
exports.constructData = constructData;
exports.optimizeFind = optimizeFind;
exports.fullTextQuery = fullTextQuery;
exports.updateSongES = updateSongES;