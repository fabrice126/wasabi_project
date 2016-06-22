var request = require('request');


var deleteElasticSearchIndex = function(url){
    return new Promise(function(resolve, reject) {
        request({ url: url, method: 'DELETE'}, function(err, resp, body){
            //en cas de succes ou d'erreur on resolve()
            if (!err && resp.statusCode == 200) {resolve();}
            else{resolve();}
        });
    })
};
//request PUT /{idx_artists||idx_songs} afin de créer l'index de zéro
var createElasticSearchIndex = function(url,mappingObj){
    var setting = {
        "settings": {"analysis": {
                        "analyzer": {
                            "folding": {
                                "tokenizer": "standard","filter":  [ "lowercase", "asciifolding" ]}}}},
        "mappings": mappingObj
    }
    return new Promise(function(resolve, reject) {
        request({url: url, method: 'PUT',json:setting}, function (err, resp, body) {
            if (!err && resp.statusCode == 200) { resolve(); }
            else {reject();}
        });
    });
};
// request PUT /idx_artists/{artist||song}/_mapping afin de définir le type autocomplétion
var createMappingElasticSearchIndex = function(url,indexMappingObj){
    return new Promise(function(resolve, reject) {
        request({ url: url, method: 'PUT', json:indexMappingObj}, function(err, resp, body){
            if (!err && resp.statusCode == 200) {resolve();}
            else{reject();}
        });
    });
};
//Fonction permettant d'ajouter une grande quantité de données rapidement dans elasticsearch
var insertBulkData = function(req,collectioName,projectObj,indexName,typeName){
    var elasticsearchClient = req.elasticsearchClient;
    var db = req.db;
    var skip = 0;
    var limit = 10000;
    (function recursivePost(skip){
        console.log("Traitement en cours : "+skip);
        db.collection(collectioName).find({},projectObj).skip(skip).limit(limit).toArray(function(err,obj){
            //On insérera l'enregistrement dans cet index
            var bulk_request = [];
            for (var i = 0; i < obj.length; i++) {
                var id = obj[i]._id;
                delete obj[i]._id;
                bulk_request.push({index: {_index: indexName, _type: typeName,_id:id}});// Insert index
                bulk_request.push(obj[i]);// Insert data
            }
            elasticsearchClient.bulk({body : bulk_request}, function (err, resp) {
                if(err) {console.log(err);}
            });
            skip+= limit;
            if(obj.length !=limit) {
                console.log("FIN DU TRAITEMENT !");
                console.log(indexName+" Crée");
                return;
            }
            recursivePost(skip);
        });
    })(skip)
};

exports.deleteElasticSearchIndex        = deleteElasticSearchIndex;
exports.createElasticSearchIndex        = createElasticSearchIndex;
exports.createMappingElasticSearchIndex = createMappingElasticSearchIndex;
exports.insertBulkData                  = insertBulkData;