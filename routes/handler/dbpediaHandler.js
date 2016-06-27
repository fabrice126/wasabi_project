var request         = require('request');
var LanguageDetect  = require('languagedetect');
var redirect_request= require('../sparql_request/redirect_request.js');
var construct_endpoint = require('../sparql_request/construct_endpoint.js');
var infos_artist    = require('../sparql_request/infos_artist.js');
var infos_album     = require('../sparql_request/infos_album.js');
var infos_song      = require('../sparql_request/infos_song.js');
var urlDbpediaToSplit = "dbpedia.org/resource/";

var lngDetector = new LanguageDetect();

var getInfosDbpedia = function(obj,sparqlRequest,urlEndpoint){
    var failRequest = 0;
    var failEncode = false;
    var promise = new Promise(function(resolve, reject) { 
        (function getInfos(obj,sparqlRequest,urlEndpoint ,failRequest,failEncode){
            var requestdbpedia = checkURLEncode(failEncode,urlEndpoint,sparqlRequest,"&format=application%2Frdf%2Bxml&timeout=60000");
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
//var languageDetect = function(text){
//    console.log(lngDetector.detect(text,2));
//}


/*Avec le temps, les URIs d'un artist/album/musique peuvent changer, les anciens liens ne sont pas pour autant abandonnée, une redirection est effectuée sur le navigateur, 
chose non réalisée avec une requête ajax. Cette fonction permet donc de retrouver la nouvelle URI en cas de changement sur sur site wikipédia et donc dbpedia */
var getRedirectionOfDbpedia = function(obj,sparqlRedirect,urlEndpoint,objUrl){
    var failRequest = 0;
    var failEncode = false;
    var promise = new Promise(function(resolve, reject) { 
        //Pour passer les parametres à la promise suivante
        var objRedirect = {obj:obj, redirectTo:"",urlEndpoint : urlEndpoint,objUrl:objUrl};
        (function getInfos( objRedirect,sparqlRedirect ,failRequest,failEncode){
            var requestdbpedia = checkURLEncode(failEncode,urlEndpoint,sparqlRedirect,"&format=application%2Fsparql-results%2Bjson&timeout=30000");
//            console.log(requestdbpedia);
            request(requestdbpedia, function(err, resp, body){
                if (!err && resp.statusCode == 200) {
                    try{
                        var jsonBody = JSON.parse(body);
                        if(typeof jsonBody.results.bindings[0] !== "undefined"){
                            objRedirect.redirectTo = jsonBody.results.bindings[0].redirect.value;
                            console.log("\nREDIRECT TO = "+objRedirect.redirectTo);
                            // on split le contenu sur "dbpedia.org/resource/" afin d'obtenir le nouveau nom d'artiste/album/musique
                            objRedirect.objUrl.urlDbpedia = objRedirect.redirectTo.split(urlDbpediaToSplit)[1];
                            failEncode = true;
                        }
                        if(!failEncode){
                            failEncode = true;
                            getInfos(objRedirect,sparqlRedirect ,failRequest,failEncode);
                        }
                        else{
                            resolve(objRedirect);
                        }
                    }catch(e){console.log(e); }//Ne pas traiter le resolve dans un finally
                }
                else{
                    if(failRequest <2){
                        console.log('=====RELANCE DE LA getRedirectionOfDbpedia=====');
                        console.log(err);
                        failRequest++;
                        getInfos(objRedirect,sparqlRedirect ,failRequest,failEncode);
                    }
                    else{
                        console.log("=====LA REQUETE A ECHOUEE=====");
                        resolve( objRedirect);
                    }
                }
            });
        })( objRedirect,sparqlRedirect ,failRequest,failEncode);
    });
    return promise;
};

//Si l'artiste /l'album/musique est d'un artiste francais alors on doit chercher dans le dbpédia francais pour cela il faut envoyer une requ^te vers la page non francaise pour recupérer l'attribut
//same as contenant pouvant contenir l'URI vers dbpédia fr
var getSameAsOfDbpedia = function(objSameAs,sameAsRequest){
    var failEncode = false;
    var promise = new Promise(function(resolve, reject) {
        (function getInfos(objSameAs,sameAsRequest, failEncode){
            var requestdbpedia = checkURLEncode(failEncode,objSameAs.urlEndpoint,sameAsRequest,"&format=application%2Fsparql-results%2Bjson&timeout=30000");
           // console.log(requestdbpedia);
            request(requestdbpedia, function(err, resp, body){
                if (!err && resp.statusCode == 200) {
                    try{
                        var jsonBody = JSON.parse(body);
                        if(typeof jsonBody.results.bindings[0] !== "undefined"){
                            objSameAs.objUrl.sameAs = jsonBody.results.bindings[0].sameAs.value;
                            failEncode = true;
                        }
                        if(!failEncode){
                            failEncode = true;
                            getInfos(objSameAs,sameAsRequest ,failEncode);
                        }
                        else{
                            resolve(objSameAs);
                        }
                    }catch(e){ console.log(e);}//Ne pas traiter le resolve dans un finally
                }
                else{
                    resolve(objSameAs);
                }
            });
        })(objSameAs,sameAsRequest,failEncode);
    });
    return promise;
}
//encode uniquement les caractères présents dans le replace
//Cette fonction est utilisé 
var fixedEncodeURIComponent = function (str) {
    //Le caractère '%' n'est pas présent car cette fonction encode les requêtes contenant des URI encodés : Are_You_Dead_Yet%3F rajouter le '% re encodera cette uri déja encodé'
    return str.replace(/[\s"#?<>`{}|^\[\]\\]/g, function(c) {
        return encodeURIComponent(c);
  });
};

//Permet de gérer certains cas d'URL : le '?' doit être encodé deux fois dans la partie de l'url représentant l'artiste/album/musique et qu'une seule fois pour les variables sparql ?mavar
var checkURLEncode = function(failEncode,urlEndpoint,sparqlRequest,paramRequest){
    requestdbpedia = "";
    if(!failEncode){
        requestdbpedia = urlEndpoint+encodeURIComponent(sparqlRequest)+paramRequest;
    }else{
        console.log("===== FAILENCODE REDO REQUEST=====")
        requestdbpedia = urlEndpoint+fixedEncodeURIComponent(sparqlRequest)+paramRequest;
    }
    return requestdbpedia;
}

var constructExtractionRequest = function(collection,objRedirect){
    var sparql_request;
    if(collection == "artist"){
        sparql_request = infos_artist.construct_request(objRedirect.objUrl.urlDbpedia,objRedirect.objUrl.country);
    }else if (collection == "album"){
        sparql_request = infos_album.construct_request(objRedirect.objUrl.urlDbpedia,objRedirect.objUrl.country);
    }else {//sinon c'est une musique
        sparql_request = infos_song.construct_request(objRedirect.objUrl.urlDbpedia,objRedirect.objUrl.country);
    }
    return sparql_request;
};

//Fonction permettant de récupérer le prefix du pays afin de récupérer des données sur les differents dbpédia dans le monde
var getCountryOfEndpoint = function(country){
    var objCountry = {country:'',countryLang:''};
    //Si les sparql endpoint des pays n'existe pas on envoie la requete sur le endpoint anglais c'est a dire un endpoint sans préfix
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
    //On supprime les propriétés qui ont été merges
    delete objArtist.activeYearsStartYear;    
    return objArtist;
};


var extractInfosFromRDF = function(description,property){
    var tInfos = [];
    var infos = '';
    var tProperties = Object.keys(description);
    //Permet de trouver uniquement la propriété passé en parametre
    for(var i = 0 ; i<tProperties.length;i++){
        if(tProperties[i].endsWith(property)){
            property = tProperties[i];
            break;
        }
    }
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
                if(property.endsWith('subject')){// property == 'dct:subject'
                    //Les subjects ont cette forme : Category:Songs_written_by_James_Hetfield, on supprime dont "Category:"
                    tInfos.push(splitInfo.substring(splitInfo.indexOf(':')+1).replace(/_/g," "));
                }
                else if (property.endsWith('associatedMusicalArtist')){
                    tInfos.push(splitInfo);
                }
                else{
                    tInfos.push(splitInfo.replace(/_/g,' '));
                }
            }
            //Traitement des champs RDF de type tableau de primitive
            else{
                //Le champs abstract ne doit pas être un tableau
                if(property.endsWith('abstract') || property.endsWith('birthDate') || property.endsWith('birthName') || property.endsWith('label')){
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
/*
 *  Retourne un objet .Exemple d'un objet pouvant être crée {country: "it.", urlDbpedia: "Adriano_Celentano",fillIfFr:"fr.", sameAs:""}
 *  PARAM 1 : string, urlWikipédia de l'objet
 *  PARAM 2 : object, objet artiste contenant la localisation de l'artiste et son urlWikipédia
 *  PARAM 3 : string, chaine a couper afin d'avoir le prefix  permettant"http://en.wikipedia.org/wiki/"
 */
var extractInfosFromURL = function(url,artistLocation,urlToSplit){
        var tUrl = url.split(urlToSplit);
        //certaine url sont de type : de:Adoro avec "de:" désignant le wikipedia allemand, il faut donc faire la redirection sur le endpoint allemand de dbpedia
        var objUrl = {};
        objUrl.country = '';
        objUrl.urlDbpedia = '';
        objUrl.fillIfFr = '';
        objUrl.sameAs = '';
        //Si tUrl[1] de forme: "it:Adriano_Celentano"
        if(/^[a-z]{2}:/.test(tUrl[1])){
            //On obtient le tableau suivant :urlDetail = ["it","Adriano_Celentano"]
            var urlDetail  = tUrl[1].split(":");
            objUrl.urlDbpedia = urlDetail[1];
            //certain nom d'artiste commence par '_' -> _Un_Artist on supprime donc ce char
            if(objUrl.urlDbpedia[0] =='_'){
                objUrl.urlDbpedia = objUrl.urlDbpedia.substr(1);
            }
            objUrl.country = urlDetail[0]+".";
        }
        else{
            objUrl.urlDbpedia = tUrl[1];
        }
        //Demande spécifique afin d'aller chercher les artistes français dans le DBpédia français
        //On recherche les artistes/albums/musiques francais n'ayant pas de liens vers DBpédia fr mais vers un autre dbpédia (anglais par exemple)
        if(artistLocation != "" && typeof artistLocation.locationInfo[0] != "undefined" && artistLocation.locationInfo[0] == "France" && !url.startsWith(urlToSplit+"fr:")){
            //Si indique qu'on veut chercher dans le dbpédia fr
            objUrl.fillIfFr = "fr.";
        }
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
exports.getInfosDbpedia             = getInfosDbpedia;
exports.extractInfosFromURL         = extractInfosFromURL;
exports.extractInfosFromRDF         = extractInfosFromRDF;
exports.levenshteinDistance         = levenshteinDistance;
exports.getRedirectionOfDbpedia     = getRedirectionOfDbpedia;
exports.mergeRDFAndDBProperties     = mergeRDFAndDBProperties;
exports.getCountryOfEndpoint        = getCountryOfEndpoint;
exports.fixedEncodeURIComponent     = fixedEncodeURIComponent;
exports.constructExtractionRequest  = constructExtractionRequest;
exports.getSameAsOfDbpedia          = getSameAsOfDbpedia;