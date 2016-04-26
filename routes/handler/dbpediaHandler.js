var request = require('request');

var getArtistInfosDbpedia = function(objArtist,sparqlRequest,urlEndpoint){
    var failRequest = 0;
    var promise = new Promise(function(resolve, reject) { 
        (function getInfos(objArtist,sparqlRequest,urlEndpoint ,failRequest){
            var requestdbpedia = urlEndpoint+encodeURIComponent(sparqlRequest)+"&format=application%2Frdf%2Bxml&timeout=500000";
//            console.log(requestdbpedia);
            console.log(requestdbpedia.length);
            request(requestdbpedia, function(err, resp, body){
                if (!err && resp.statusCode == 200) {
                    console.log(resp.statusCode);
                    objArtist.rdf = body;
                    resolve(objArtist);
                }
                else{
                    if(failRequest <3){
                        console.log('=====RELANCE DE LA REQUETE EXTRACT SONG====='+objArtist.urlWikipedia);
                        failRequest++;
                        getInfos(objArtist,sparqlRequest,urlEndpoint,failRequest);
                    }
                    else{
                        console.log("=====LA REQUETE A ECHOUEE=====");
                        objArtist.rdf = '';
                        resolve(objArtist);
                    }
                }
            });
        })(objArtist,sparqlRequest,urlEndpoint,failRequest);
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
                if(err !== null && failRequest <5){
                    failRequest++;
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
                if(err !== null && failRequest <5){
                    failRequest++;
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