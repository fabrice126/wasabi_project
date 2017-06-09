import request from 'request';
import LanguageDetect from 'languagedetect';
import redirect_request from '../sparql_request/redirect_request.js';
import construct_endpoint from '../sparql_request/construct_endpoint.js';
import infos_artist from '../sparql_request/infos_artist.js';
import infos_album from '../sparql_request/infos_album.js';
import infos_song from '../sparql_request/infos_song.js';
import {parseString} from 'xml2js';
import {ObjectId} from 'mongoskin';

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
// var languageDetect = function(text){
//    console.log(lngDetector.detect(text,2));
// }


/*Avec le temps, les URIs d'un artist/album/musique peuvent changer, les anciens liens ne sont pas pour autant abandonnée, une redirection est effectuée sur le navigateur, 
chose non réalisée avec une requête ajax. Cette fonction permet donc de retrouver la nouvelle URI en cas de changement sur sur site wikipédia et donc dbpedia */
var getRedirectionOfDbpedia = function(obj,sparqlRedirect,urlEndpoint,objUrl,urlDbpediaToSplit){
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
                        //Si le resultat est undefined c'est : soit qu'il n'y a pas de redirection, soit que l'encodage a fait échouer la requete
                        if(typeof jsonBody.results.bindings[0] !== "undefined"){
                            objRedirect.redirectTo = jsonBody.results.bindings[0].redirect.value;
                            console.log("\nREDIRECT TO = "+objRedirect.redirectTo);
                            // on split le contenu sur "dbpedia.org/resource/" afin d'obtenir le nouveau nom d'artiste/album/musique
                            objRedirect.objUrl.urlDbpedia = objRedirect.redirectTo.split(urlDbpediaToSplit)[1];
                            failEncode = true;
                        }
                        //Si la condition au dessus n'est pas undefined on ne relance pas la requête avec un autre encodage
                        //Sinon on relance la requête afin d'être certain que le résultat est undefined car il n'y a pas de redirection. On vérifira donc que l'encodage est le bon
                        if(!failEncode){
                            failEncode = true;
                            getInfos(objRedirect,sparqlRedirect ,failRequest,failEncode);
                        }
                        else{
                            resolve(objRedirect);
                        }
                    }catch(e){
                        console.log("err parse getRedirectionOfDbpedia");
                        console.log(e);
                        resolve(objRedirect);
                    }//Ne pas traiter le resolve dans un finally
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
};

var handlerGetSameAsOfDbpedia = function(objSameAs,urlDbpediaToSplit,urlWikipediaToSplit){
    if (objSameAs.objUrl.sameAs != "") {//si une URI vers dbpédia fr existe
        console.log("FRENCH ARTIST FOUND : With SameAs")
        objSameAs.objUrl.country = objSameAs.objUrl.fillIfFr;
        //On transforme l'objet objUrl afin qu'il soit de même forme qu'un objUrl ayant une url pointant vers le dbpédia fr : http://en.wikipedia.org/wiki/fr:Artist_Name"
        objSameAs.obj.urlWikipedia = constructNewURLWikipedia(objSameAs.objUrl.sameAs, urlWikipediaToSplit);
        // objSameAs.objUrl.sameAs == http://fr.dbpedia.org/resource/Akhenaton_(rappeur) on ne garde que "Akhenaton_(rappeur)" pour urlDbpedia
        objSameAs.objUrl.urlDbpedia = objSameAs.objUrl.sameAs.split(urlDbpediaToSplit)[1];
    }
    else{
        //Si il n'y a pas de lien vers le dbpédia francais alors nous devons reconstruire l'objUrl afin qu'il cherche les infos sur le dbpédia anglais
        //Ci-dessous nous allons donc recréer les requetes vers le dbpedia de départ
        objSameAs.objUrl = extractInfosFromURL(objSameAs.obj.urlWikipedia, '', urlWikipediaToSplit);
    }
    objSameAs.objUrl.sameAs = "";
    objSameAs.objUrl.fillIfFr = "";
    //On recrée le endpoint et les requêtes SPARQL afin qu'elles puissent extraire les informations sur le dbpédia français
    objSameAs.redirectRequest = redirect_request.construct_request(objSameAs.objUrl.urlDbpedia, objSameAs.objUrl.country);
    //On construit l'url endpoint avec l'adresse du endpoint fr
    objSameAs.urlEndpoint = construct_endpoint.construct_endpoint(objSameAs.objUrl.country);

};


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
        requestdbpedia = urlEndpoint+fixedEncodeURIComponent(sparqlRequest)+paramRequest;
    }
    return requestdbpedia;
};

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
    if(country=='' || country =='en.' || country =='fi.' || country =='no.' || country =='ja.' || country =='sv.' || country =='tr.' || country =='bg.' || country =='pt.' || country =='af.' || country =='al.' || country =='da.' || country =='cz.' || country =='ms.' || country =='lt.' || country =='hu.' ){
        objCountry.countryLang = "en";
        objCountry.country = '';
    }
    else{
        objCountry.countryLang = country.substring(0,2);
        objCountry.country = country;
    }
    return objCountry;
};

var mergeRDFAndDBProperties = function(objArtist){
    
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
 * Cette fonction est utilisé en cas de redirection, elle permet de mettre a jour l'url Wikipédia obsolète de notre bdd
 * Retourne la nouvelle URL vers wikipédia
 * exemple : http://pl.dbpedia.org/resource/Varran_Strikes_Back_-_Alive deviendra http://en.wikipedia.org/wiki/pl:Varran_Strikes_Back_-_Alive!!!
 */
var constructNewURLWikipedia = function (urlWikipedia,urlWikipediaToSplit) {
    var str = urlWikipedia.replace("http://",'');
    var res = str.split("dbpedia.org/resource/");
    var newUrlWikipedia = urlWikipediaToSplit+res[0].replace('.',':')+res[1];
    return newUrlWikipedia;
};
/*
 *  Retourne un objet. Exemple d'un objet pouvant être retourné {country: "it.", urlDbpedia: "Adriano_Celentano",fillIfFr:"fr.", sameAs:""}
 *  Un traitement spécial est appliqué si artistLocation est un objet appartenant a un artiste francais
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
    if(/^[a-z]{2}:/.test(tUrl[1]) && tUrl[1].length>3){
        //On obtient le tableau suivant :urlDetail = ["it","Adriano_Celentano"]
        var urlDetail  = tUrl[1].split(/:(.+)?/);// on split au premier ':'
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
    //On recherche les artistes/albums/musiques francais n'ayant pas de liens vers DBpédia fr afin de réparer cette anomalie et de rediriger vers le dbpédia fr le lien
    if(artistLocation != "" && typeof artistLocation.locationInfo[0] != "undefined" && artistLocation.locationInfo[0] == "France" && !url.startsWith(urlToSplit+"fr:")){
        //Si indique qu'on veut chercher dans le dbpédia fr
        objUrl.fillIfFr = "fr.";
    }
    return objUrl;
};
var createFieldsSong = function(db,COLLECTIONSONG,SONG_RDF_PROPERTIES,id = ""){
    //Propriété présent dans le RDF et dont nous avons besoin pour accèder a l'objet musique crée par parseString
    var req;
    var proj = {wordCount:0, lyrics:0};
    (id!="")? req = {_id: ObjectId(id)} : req = { $and:[ {rdf:{$ne:""}}, {rdf:{$exists:true}} ] } ;

    db.collection(COLLECTIONSONG).find(req,proj).toArray(function(err,tObjSong){
        console.log('En cours de traitement ...');
        for(var i = 0; i<tObjSong.length;i++){
            //Pour chaque musique contenant du RDF valide
            if(typeof tObjSong[i].rdf != "undefined" && tObjSong[i].rdf.length>200){
                //Transformation du RDF en un objet JSON
                parseString(tObjSong[i].rdf, function (err, result) {
                    //Si le document est bien parsé et contient rdf:Description, c'est à dire la ou les pages DBpédia ayant servi pour l'extraction des données
                    //Dans le cas d'une musique une seul page DBpédia a été utilisée pour extraire des données
                    if(result != null && typeof result['rdf:RDF']['rdf:Description'] !== "undefined"){
                        for(var k = 0;k<result['rdf:RDF']['rdf:Description'].length;k++){
                            var description = result['rdf:RDF']['rdf:Description'][k];
                            //Pour chaque propriété on récupére les données de l'objet musique représentant le RDF
                            for(var j = 0;j<SONG_RDF_PROPERTIES.length;j++){
                                var currProperty = SONG_RDF_PROPERTIES[j];
                                //On va extraire le contenu de chaque propriété afin d'ajouter à l'objet tObjSong[i] les nouvelles propriétés
                                tObjSong[i][currProperty] = extractInfosFromRDF(description,currProperty);
                            }
                        }
                        db.collection(COLLECTIONSONG).update({_id : new ObjectId(tObjSong[i]._id)}, { $set: tObjSong[i] },function(err,result) {
                            if (err) throw err;
                        });
                    }
                });
            }
        }
        console.log('Fin du traitement');
    });
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
exports.constructNewURLWikipedia    = constructNewURLWikipedia;
exports.handlerGetSameAsOfDbpedia   = handlerGetSameAsOfDbpedia;
exports.createFieldsSong            = createFieldsSong;