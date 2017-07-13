import request from 'request';
import {
    ObjectId
} from 'mongoskin';

var addDocumentToElasticSearch = function (req, indexName, index_type, body, id) {
    console.log("addDocumentToElasticSearch");
    return req.elasticsearchClient.index({
        index: indexName,
        type: index_type,
        id: id,
        body: body
    });
};

/**
 *
 * @param url
 * @returns {Promise}
 */
var deleteElasticSearchIndex = function (url) {
    return new Promise(function (resolve, reject) {
        request({
            url: url,
            method: 'DELETE'
        }, function (err, resp, body) {
            //en cas de succes ou d'erreur on resolve()
            if (!err && resp.statusCode == 200) {
                resolve();
            } else {
                resolve();
            }
        });
    })
};
/**
 * request PUT /{idx_artists||idx_songs} afin de créer l'index de zéro
 * @param url
 * @param mappingObj
 * @returns {Promise}
 */
var createElasticSearchIndex = function (url, mappingObj) {
    var setting = {
        "settings": {
            "analysis": {
                "analyzer": {
                    "folding": {
                        "tokenizer": "standard",
                        "filter": ["lowercase", "asciifolding", "my_word_delimiter"]
                    }
                },
                "filter": {
                    "my_word_delimiter": {
                        "type": "word_delimiter",
                        "catenate_words": true,
                        "preserve_original": true
                    }
                }
            }
        },
        "mappings": mappingObj
    }
    return new Promise(function (resolve, reject) {
        request({
            url: url,
            method: 'PUT',
            json: setting
        }, function (err, resp, body) {
            if (!err && resp.statusCode == 200) {
                resolve();
            } else {
                reject();
            }
        });
    });
};
/**
 * request PUT /idx_artists/{artist||song}/_mapping afin de définir le type autocomplétion
 * @param url
 * @param indexMappingObj
 * @returns {Promise}
 */
var createMappingElasticSearchIndex = function (url, indexMappingObj) {
    return new Promise(function (resolve, reject) {
        request({
            url: url,
            method: 'PUT',
            json: indexMappingObj
        }, function (err, resp, body) {
            if (!err && resp.statusCode == 200) {
                resolve();
            } else {
                reject();
            }
        });
    });
};
/**
 * Fonction permettant d'ajouter une grande quantité de données rapidement dans elasticsearch
 * @param req
 * @param collectionName
 * @param projectObj
 * @param indexName
 * @param typeName
 */
var insertBulkData = function (req, collectionName, projectObj, indexName, typeName) {
    var elasticsearchClient = req.elasticsearchClient;
    var db = req.db;
    var skip = 0;
    var limit = 10000;
    (function recursivePost(skip) {
        console.log("Traitement en cours : " + skip);
        db.collection(collectionName).find({}, projectObj).skip(skip).limit(limit).toArray(function (err, obj) {
            //On insérera l'enregistrement dans cet index
            var bulk_request = [];
            for (var i = 0; i < obj.length; i++) {
                var picture = "";
                if (indexName === req.config.database.index_song) {
                    //On ajoute les images des albums pour les musiques, nous devons donc récupérer les images dans la collection album
                    ((objSong) => {
                        db.collection(req.config.database.collection_album).findOne({
                            _id: new ObjectId(objSong.id_album)
                        }, {
                            "cover.small": 1
                        }, function (err, objSongWasabi) {
                            picture = objSongWasabi.hasOwnProperty('cover') ? objSongWasabi.cover.small : "";
                            if (picture == "http://e-cdn-images.deezer.com/images/cover//56x56-000000-80-0-0.jpg") picture = "";
                            objSong.picture = picture;
                            objSong.weight = Number(objSong.rank || 0);
                            //for each line we must provide the informations below
                            //ex line1: { "index" : { "_index" : "idx_artist", "_type" : "artist", "_id" : an objectid from mongodb } }
                            //ex line2: { "field1" : "data1", "field2" : "data2" , ...}
                            bulk_request.push({
                                index: {
                                    _index: indexName,
                                    _type: typeName,
                                    _id: objSong._id
                                }
                            });
                            delete objSong._id;
                            delete objSong.id_album;
                            delete objSong.rank;
                            bulk_request.push(objSong); // Insert data
                            if (bulk_request.length / 2 == obj.length) {
                                elasticsearchClient.bulk({
                                    body: bulk_request
                                }, (err, resp) => {
                                    if (err) console.log("ERREUR ==== " + err);
                                });
                                skip += limit;
                                if (obj.length != limit) {
                                    console.log("FIN DU TRAITEMENT !");
                                    console.log(indexName + " Crée");
                                    return;
                                }
                                recursivePost(skip);
                            }
                        })
                    })(obj[i])
                } else { //on traite les artistes
                    picture = obj[i].hasOwnProperty('picture') ? obj[i].picture.small : "";
                    if (picture == "http://e-cdn-images.deezer.com/images/artist//56x56-000000-80-0-0.jpg") picture = "";
                    obj[i].nameSuggest = {};
                    obj[i].nameSuggest.input = [];
                    obj[i].nameSuggest.input.push(obj[i].name);
                    //Si le nom contient plus de deux mots ex : The Rolling Stones
                    if (obj[i].name.split(" ").length > 1) {
                        obj[i].nameSuggest.input.push(obj[i].name.substring(obj[i].name.indexOf(" ") + 1, obj[i].name.length));
                    }
                    obj[i].nameSuggest.weight = Number(obj[i].deezerFans || 0);
                    obj[i].picture = picture;
                    //for each line we must provide the informations below
                    //ex line1: { "index" : { "_index" : "idx_artist", "_type" : "artist", "_id" : an objectid from mongodb } }
                    //ex line2: { "field1" : "data1", "field2" : "data2" , ...}
                    bulk_request.push({
                        index: {
                            _index: indexName,
                            _type: typeName,
                            _id: obj[i]._id
                        }
                    });
                    //On supprime les champs ci-dessous pour ne pas les avoir dans elasticsearch, 
                    delete obj[i]._id;
                    delete obj[i].deezerFans;
                    bulk_request.push(obj[i]); // Insert data
                    if (bulk_request.length / 2 == obj.length) {
                        console.log((bulk_request.length / 2), obj.length)
                        elasticsearchClient.bulk({
                            body: bulk_request
                        }, (err, resp) => {
                            if (err) console.log("ERREUR ==== " + err);
                        });
                        skip += limit;
                        if (obj.length != limit) {
                            console.log("FIN DU TRAITEMENT !");
                            console.log(indexName + " Crée");
                            return;
                        }
                        recursivePost(skip);
                    }
                }
            }
        });
    })(skip)
};


/**
 * Permet de supprimer les chars spéciaux d'elasticsearch +-= && || ><!(){}[]^"~*?:\/
 * @param query
 * @returns {XML|string}
 */
var escapeElasticSearch = function (query) {
    return query
        .replace(/[\*\+\-=~><\"\?^\${}\(\)\:\!\/[\]]/g, '\\$&') // replace single character special characters
        .replace(/\|\|/g, '\\||') // replace ||
        .replace(/\&\&/g, '\\&&') // replace &&
        .replace(/AND/g, '\\A\\N\\D') // replace AND
        .replace(/OR/g, '\\O\\R') // replace OR
        .replace(/NOT/g, '\\N\\O\\T'); // replace NOT
};

exports.deleteElasticSearchIndex = deleteElasticSearchIndex;
exports.createElasticSearchIndex = createElasticSearchIndex;
exports.createMappingElasticSearchIndex = createMappingElasticSearchIndex;
exports.insertBulkData = insertBulkData;
exports.escapeElasticSearch = escapeElasticSearch;
exports.addDocumentToElasticSearch = addDocumentToElasticSearch;