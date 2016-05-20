var request = require('request');

var getInfosDbpedia = function(obj,sparqlRequest,urlEndpoint){
    var failRequest = 0;
    var failEncode = false;
    var promise = new Promise(function(resolve, reject) { 
        (function getInfos(obj,sparqlRequest,urlEndpoint ,failRequest,failEncode){
            var requestdbpedia = "";
            if(!failEncode){
                requestdbpedia = urlEndpoint+encodeURIComponent(sparqlRequest)+"&format=application%2Frdf%2Bxml&timeout=60000";
            }else{
                console.log("=====DEDANS FAILENCODE=====")
                requestdbpedia = urlEndpoint+fixedEncodeURIComponent(sparqlRequest)+"&format=application%2Frdf%2Bxml&timeout=60000";  
            }
//            console.log(requestdbpedia);
            request(requestdbpedia, function(err, resp, body){
                if (!err && resp.statusCode == 200) {
                    obj.rdf = body;
                    if(obj.rdf.length < 200 && !failEncode){
                        failEncode = true;
                        console.log("=====RELANCE DE LA REQUETE FAILENCODE=====")
                        getInfos(obj,sparqlRequest,urlEndpoint,failRequest,failEncode);
                    }else{
                           resolve(obj); 
                    }
                }
                else{
                    if(failRequest <2){
                        console.log('=====RELANCE DE LA REQUETE EXTRACT====='+obj.urlWikipedia);
                        console.log(err);
                        failRequest++;
                        getInfos(obj,sparqlRequest,urlEndpoint,failRequest,failEncode);
                    }
                    else{
                        console.log("=====LA REQUETE A ECHOUEE=====");
                        obj.rdf = '';
                        resolve(obj);
                    }
                }
            });
        })(obj,sparqlRequest,urlEndpoint,failRequest,failEncode);
    });
    return promise;
};

//Permet de trouver la bonne URI en cas de changement d'URI sur wikipédia/dbpedia 
var getRedirectionOfDbpedia = function(obj,sparqlRedirect,urlEndpoint,objUrl){
    var failRequest = 0;
    var failEncode = false;
    var promise = new Promise(function(resolve, reject) { 
        //Pour passer les parametres à la promise suivante
        var objRedirect = {obj:obj, redirectTo:"",urlEndpoint : urlEndpoint,objUrl:objUrl};
        (function getInfos( objRedirect,sparqlRedirect ,failRequest,objUrl,failEncode){
            var requestdbpedia = "";
            if(!failEncode){
                requestdbpedia = urlEndpoint+encodeURIComponent(sparqlRedirect)+"&format=application%2Fsparql-results%2Bjson&timeout=30000";
            }else{
                requestdbpedia = urlEndpoint+fixedEncodeURIComponent(sparqlRedirect)+"&format=application%2Fsparql-results%2Bjson&timeout=30000";  
            }
//            console.log(requestdbpedia);
            request(requestdbpedia, function(err, resp, body){
                if (!err && resp.statusCode == 200) {
                    try{
                        var jsonBody = JSON.parse(body);
                        //si il y a un redirection a faire
                        if(typeof jsonBody.results.bindings[0] !== "undefined"){
//                            objRedirect.redirectTo = decodeURIComponent(jsonBody.results.bindings[0].redirect.value);
                            objRedirect.redirectTo = jsonBody.results.bindings[0].redirect.value;
                            console.log("\n\n\nREDIRECT TO = "+objRedirect.redirectTo);
                            failEncode = true;
                        }
                        if(!failEncode){
                            failEncode = true;
                            getInfos(objRedirect,sparqlRedirect ,failRequest,objUrl,failEncode);
                        }
                        else{
                            resolve(objRedirect);
                        }
                    }catch(e){
                        console.log(e);
                    }
                    finally {
                         resolve(objRedirect);
                    }

                }
                else{
                    if(failRequest <2){
                        console.log('=====RELANCE DE LA getRedirectionOfDbpedia=====');
                        console.log(err);
                        failRequest++;
                        getInfos(objRedirect,sparqlRedirect ,failRequest,objUrl,failEncode);
                    }
                    else{
                        console.log("=====LA REQUETE A ECHOUEE=====");
                        resolve( objRedirect);
                    }
                }
            });
        })( objRedirect,sparqlRedirect ,failRequest,objUrl,failEncode);
    });
    return promise;
};
//encode uniquement les caractères présents dans le replace
//Cette fonction est utilisé 
var fixedEncodeURIComponent = function (str) {
    //Le caractère '%' n'est pas présent car cette fonction encode les requêtes contenant des URI encodés : Are_You_Dead_Yet%3F rajouter le '% re encodera cette uri déja encodé'
    return str.replace(/[\s"#?<>`{}|^\[\]\\]/g, function(c) {
        return encodeURIComponent(c);
  });
};  

var getCountryOfEndpoint = function(country){
    var objCountry = {country:'',countryLang:''};
    //Si les sparql endpoint des pays n'existe pas on envoie la requete sur le endpoint anglais
    if(country=='' || country =='en.' || country =='fi.' || country =='no.' || country =='ja.' || country =='sv.' || country =='tr.' || country =='pt.' || country =='af.' || country =='al.' || country =='da.' || country =='cz.' || country =='ms.' || country =='lt.' || country =='hu.' ){
        objCountry.countryLang = "en";
        objCountry.country = '';
    }
    else{
        objCountry.countryLang = country.substring(0,2);
        objCountry.country = country;
    }
    return objCountry;
}

var mergeRDFAndDBProperties = function(objArtist){
//    objArtist.activeYears = objArtist.activeYears.;
    
    console.log(objArtist.activeYears.length);
    //Si activeYears est vide ou est de forme "89" "89' " on la modifie si notre activeYearsStartYear du RDF n'est pas aussi de cette forme
    if(objArtist.activeYears.length<4 && objArtist.activeYearsStartYear[0].length>=4){
        //Contrairement a un bandMember ou formerBandMember a qui peut avoir rejoint et quitté un groupe plusieurs fois
        //un artiste/groupe n'a qu'une seule date de début(activeYearsStartYear)
        objArtist.activeYears = objArtist.activeYearsStartYear[0]; 
    }
    if(objArtist.labels.length==0){
        objArtist.labels = objArtist.recordLabel; 
    }
    else{

    }
    console.log(objArtist.activeYears+" = "+objArtist.activeYears.length);
    //On supprime les propriétés qui ont été merges
    delete objArtist.activeYearsStartYear;    
    return objArtist;
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
                if(property == 'dct:subject'){
                    //Les subjects ont cette forme : Category:Songs_written_by_James_Hetfield, on supprime dont "Category:"
                    tInfos.push(splitInfo.substring(splitInfo.indexOf(':')+1));
                }
                else if (property == 'dbo:associatedMusicalArtist'){
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

//Retourne un objet avec les propriétés, country: "it" et urlDbpedia: "Adriano_Celentano"
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
exports.getRedirectionOfDbpedia = getRedirectionOfDbpedia;
exports.mergeRDFAndDBProperties = mergeRDFAndDBProperties;
exports.getCountryOfEndpoint = getCountryOfEndpoint;
exports.fixedEncodeURIComponent = fixedEncodeURIComponent;
