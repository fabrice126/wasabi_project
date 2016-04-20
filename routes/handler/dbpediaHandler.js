var request = require('request');



var getArtistInfosDbpedia = function(objArtist,sparqlRequest){
    var failRequest = 0;
    function getInfos(objArtist,failRequest){
        request({ pool: {maxSockets: Infinity}, url: objArtist.urlWikipedia,method: "GET",timeout: 50000000}, function(err, resp, body){
            if (!err && resp.statusCode == 200) {

            }
            else{
                if(err != null && failRequest <5){
                    failRequest++
                    console.error('=====RELANCE DE LA REQUETE EXTRACT SONG====='+objArtist.urlWikipedia);
                    getInfos(objArtist,failRequest);
                }
            }
        });
    }(objArtist,failRequest);
};
var getAlbumInfosDbpedia = function(objAlbum,sparqlRequest){
    var failRequest = 0;
    function getInfos(objAlbum,failRequest){
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
    }(objAlbum,failRequest);
};
var getSongInfosDbpedia = function(objSong,sparqlRequest){
    var failRequest = 0;
    function getInfos(objSong,failRequest){
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
    }(objSong,failRequest);

};
exports.getArtistInfosDbpedia = getArtistInfosDbpedia;
exports.getAlbumInfosDbpedia = getAlbumInfosDbpedia;
exports.getSongInfosDbpedia = getSongInfosDbpedia;