import request from 'request';

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
                var id = obj[i]._id,
                    weight = 0;
                if (indexName === req.config.database.index_song) {
                    weight = Number(obj[i].rank || 0);
                    delete obj[i].rank;
                } else { //on traite les artistes
                    weight = Number(obj[i].deezerFans || 0);
                    delete obj[i].deezerFans;
                }
                delete obj[i]._id;
                bulk_request.push({
                    index: {
                        _index: indexName,
                        _type: typeName,
                        _id: id
                    }
                });
                // Insert index
                if (obj[i].albumTitle || obj[i].title) {
                    obj[i].weight = weight;
                } else {
                    console.log("On traite un artiste");
                    obj[i].nameSuggest = {};
                    obj[i].nameSuggest.input = [];
                    obj[i].nameSuggest.input.push(obj[i].name);
                    //Si le nom contient plus de deux mots ex : The Rolling Stones
                    if (obj[i].name.split(" ").length > 1) {
                        obj[i].nameSuggest.input.push(obj[i].name.substring(obj[i].name.indexOf(" ") + 1, obj[i].name.length));
                    }
                    obj[i].nameSuggest.weight = weight;
                }
                bulk_request.push(obj[i]); // Insert data
            }
            elasticsearchClient.bulk({
                body: bulk_request
            }, function (err, resp) {
                if (err) {
                    console.log(err);
                }
            });
            skip += limit;
            if (obj.length != limit) {
                console.log("FIN DU TRAITEMENT !");
                console.log(indexName + " Crée");
                return;
            }
            recursivePost(skip);
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