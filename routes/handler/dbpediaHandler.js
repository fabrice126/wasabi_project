var request = require('request');
var urlEndpoint = "http://dbpedia.org/sparql?default-graph-uri=http://dbpedia.org&query=";

var getArtistInfosDbpedia = function(objArtist,sparqlRequest){
    var failRequest = 0;
    urlEndpoint
    var promise = new Promise(function(resolve, reject) { 
        (function getInfos(objArtist,sparqlRequest,failRequest){
            var requestdbpedia = urlEndpoint+encodeURIComponent(sparqlRequest)+"&format=application%2Frdf%2Bxml";//ou xml a voir
            request(requestdbpedia, function(err, resp, body){
                console.log(resp.statusCode);
                if (!err && resp.statusCode == 200) {                
                    objArtist.rdf = body;
                    resolve(objArtist);
                }
                else{
                    if(err != null && failRequest <5){
                        console.error('=====RELANCE DE LA REQUETE EXTRACT SONG====='+objArtist.urlWikipedia);
                        failRequest++
                        getInfos(objArtist,sparqlRequest,failRequest);
                    }
                    else{
                        console.log("=====LA REQUETE A ECHOUEE=====")
                        objArtist.rdf = '';
                        resolve(objArtist);
                    }
                }
            });
        })(objArtist,sparqlRequest,failRequest);
    });
    return promise;
};





var getAlbumInfosDbpedia = function(objAlbum,sparqlRequest){
    var failRequest = 0;
    (function getInfos(objAlbum,failRequest){
        request({ pool: {maxSockets: Infinity}, url: objAlbum.urlWikipedia,method: "GET",timeout: 50000000}, function(err, resp, body){
            if (!err && resp.statusCode == 200) {

            }
            else{
                if(err != null && failRequest <5){
                    failRequest++
                    console.error('=====RELANCE DE LA REQUETE EXTRACT SONG====='+objAlbum.urlWikipedia);
                    getInfos(objAlbum,failRequest);
                }
            }
        });
    })(objAlbum,failRequest);
};





var getSongInfosDbpedia = function(objSong,sparqlRequest){
    var failRequest = 0;
    (function getInfos(objSong,failRequest){
        request({ pool: {maxSockets: Infinity}, url: objSong.urlWikipedia,method: "GET",timeout: 50000000}, function(err, resp, body){
            if (!err && resp.statusCode == 200) {

            }
            else{
                if(err != null && failRequest <5){
                    failRequest++
                    console.error('=====RELANCE DE LA REQUETE EXTRACT SONG====='+objSong.urlWikipedia);
                    getInfos(objSong,failRequest);
                }
            }
        });
    })(objSong,failRequest);

};
exports.getArtistInfosDbpedia = getArtistInfosDbpedia;
exports.getAlbumInfosDbpedia = getAlbumInfosDbpedia;
exports.getSongInfosDbpedia = getSongInfosDbpedia;