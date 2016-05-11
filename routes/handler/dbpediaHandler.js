var request = require('request');

var getInfosDbpedia = function(obj,sparqlRequest,urlEndpoint){
    var failRequest = 0;
    var promise = new Promise(function(resolve, reject) { 
        (function getInfos(obj,sparqlRequest,urlEndpoint ,failRequest){
            var requestdbpedia = urlEndpoint+encodeURIComponent(sparqlRequest)+"&format=application%2Frdf%2Bxml";//&timeout=120000
//            console.log(requestdbpedia);
            request(requestdbpedia, function(err, resp, body){
                if (!err && resp.statusCode == 200) {
                    obj.rdf = body;
                    resolve(obj);
                }
                else{
                    if(failRequest <2){
                        console.log('=====RELANCE DE LA REQUETE EXTRACT====='+obj.urlWikipedia);
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
var extractInfosFromRDF = function(description,property){
    var tInfos = [];
    var infos = '';
    if(typeof description[property] !== "undefined"){
        //On va itérer sur les champs de la variable property 
        for(var j = 0;j<description[property].length;j++){
            //Traitement des champs RDF de type tableau d'objets
            if(typeof description[property][j]['_'] === "undefined"){
                var resourceDbpedia = description[property][j]['$']['rdf:resource'];
                var subStr = "dbpedia.org/resource/";
                //exemple : resourceDbpedia = http://fr.dbpedia.org/resource/The_Rolling_Stones
                var splitInfo = resourceDbpedia.substring(resourceDbpedia.indexOf("dbpedia.org/resource/")+subStr.length);
                //exemple : splitInfo = The_Rolling_Stones
                if(property == 'dct:subject' || property == 'dbo:associatedMusicalArtist'){
                    tInfos.push(splitInfo);
                }
                else{
                    tInfos.push(splitInfo.replace(/_/g,' '));
                }
            }
            //Traitement des champs RDF de type tableau de primitive
            else{
                //Le champs abstract ne doit pas être un tableau
                if(property == 'dbo:abstract' || property == 'dbo:birthDate' || property == 'dbp:birthName' || property == 'rdfs:label'){
                    tInfos = '';
//                    console.log(property+": "+description[property][j]['_']);
                    tInfos = description[property][j]['_'];  
                }
                else{
//                    console.log(property+": "+description[property][j]['_']);
                    tInfos.push(description[property][j]['_']);  
                }

            }
        }
    }
    return tInfos;
};


var extractInfosFromURL = function(urlWikipedia,urlToSplit){
        var tUrl = urlWikipedia.split(urlToSplit);
        //certaine url sont de type : de:Adoro avec "de:" désignant le wikipedia allemand, il faut donc faire la redirection sur le endpoint allemand de dbpedia
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

/*
Copyright (c) 2011 Andrei Mackenzie
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Compute the edit distance between the two given strings
var levenshteinDistance = function(a, b){
    if(a.length == 0) return b.length; 
    if(b.length == 0) return a.length; 
    var matrix = [];
    // increment along the first column of each row
    var i;
    for(i = 0; i <= b.length; i++){
        matrix[i] = [i];
    }
    // increment each column in the first row
    var j;
    for(j = 0; j <= a.length; j++){
        matrix[0][j] = j;
    }
    // Fill in the rest of the matrix
    for(i = 1; i <= b.length; i++){
        for(j = 1; j <= a.length; j++){
            if(b.charAt(i-1) == a.charAt(j-1)){
                matrix[i][j] = matrix[i-1][j-1];
            } 
            else {
                matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                        Math.min(matrix[i][j-1] + 1, // insertion
                                        matrix[i-1][j] + 1)); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
};
exports.getInfosDbpedia     = getInfosDbpedia;
exports.extractInfosFromURL = extractInfosFromURL;
exports.extractInfosFromRDF = extractInfosFromRDF;
exports.levenshteinDistance = levenshteinDistance;

