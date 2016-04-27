var request = require('request');

var getInfosDbpedia = function(obj,sparqlRequest,urlEndpoint){
    var failRequest = 0;
    var promise = new Promise(function(resolve, reject) { 
        (function getInfos(obj,sparqlRequest,urlEndpoint ,failRequest){
            var requestdbpedia = urlEndpoint+encodeURIComponent(sparqlRequest)+"&format=application%2Frdf%2Bxml&timeout=60000";
            request(requestdbpedia, function(err, resp, body){
                if (!err && resp.statusCode == 200) {
                    obj.rdf = body;
                    resolve(obj);
                }
                else{
                    if(failRequest <2){
                        console.log('=====RELANCE DE LA REQUETE EXTRACT SONG====='+obj.urlWikipedia);
                        console.log(err);
                        failRequest++;
                        getInfos(obj,sparqlRequest,urlEndpoint,failRequest);
                    }
                    else{
                        console.log("=====LA REQUETE A ECHOUEE=====");
                        obj.rdf = '';
                        resolve(obj);
                    }
                }
            });
        })(obj,sparqlRequest,urlEndpoint,failRequest);
    });
    return promise;
};

var extractInfosFromURL = function(urlWikipedia,urlToSplit){
                var tUrl = urlWikipedia.split(urlToSplit);
                //certaine url sont de type : de:Adoro avec "de:" désignant le wikipedia allemand, il faut donc faire la redirection sur dbpedia
                var objUrl = {};
                objUrl.country = '';
                objUrl.urlDbpedia = '';
                //Si tUrl[1] de forme: "it:Adriano_Celentano"
                if(/^[a-z]{2}:/.test(tUrl[1])){
                    //On obtient le tableau suivant :urlDetail = ["it","Adriano_Celentano"]
                    var urlDetail  = tUrl[1].split(":");
                    objUrl.urlDbpedia = urlDetail[1];
                    if(objUrl.urlDbpedia[0] =='_'){
                        objUrl.urlDbpedia = objUrl.urlDbpedia.substr(1);
                    }
                    objUrl.country = urlDetail[0]+".";
                }
                else{objUrl.urlDbpedia = tUrl[1];}
                objUrl.urlDbpedia = decodeURIComponent(objUrl.urlDbpedia);
                return objUrl;
};
exports.getInfosDbpedia = getInfosDbpedia;
exports.extractInfosFromURL = extractInfosFromURL;