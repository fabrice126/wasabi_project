import express from 'express';
import dbpediaHandler from './extractdbpedia.controller.js';
import utilHandler from '../handler/utilHandler.js';
import construct_endpoint from './sparql_request/construct_endpoint.js';
import redirect_request from './sparql_request/redirect_request.js';
import same_as_request from './sparql_request/same_as_request.js';
import config from '../conf/conf';
import {
    ObjectId
} from 'mongoskin';
import {
    parseString
} from 'xml2js';

const router = express.Router();
const COLLECTIONARTIST = config.database.collection_artist;
const COLLECTIONALBUM = config.database.collection_album;
const COLLECTIONSONG = config.database.collection_song;
//Lorsque nous récupérons le champ urlWikipedia nous devons le spliter pour ne garder que le nom de l'artiste dans le but de construct la requête sparql
const urlWikipediaToSplit = "http://en.wikipedia.org/wiki/";
const urlDbpediaToSplit = "dbpedia.org/resource/";
//propriétés RDF à extraire pour les musiques
const SONG_RDF_PROPERTIES = ['subject', 'format', 'genre', 'producer', 'recordLabel', 'writer', 'recorded', 'abstract', 'releaseDate', 'runtime', 'award'];

//WEBSERVICE permettant d'extraire les données de dbpédia en fonction de la propriété urlWikipedia présent dans chaque document de notre base de données
router.get('/:collection', function (req, res) {
    var db = req.db;
    var collection = req.params.collection;
    if (collection != COLLECTIONARTIST && collection != COLLECTIONALBUM && collection != COLLECTIONSONG) {
        return res.status(404).send([{
            error: "Page not found"
        }]);
    }
    var loop = true;
    var skip = 0;
    //extraire l'url de wikipedia de objAlbum.urlWikipedia
    (function getRequestLoop(loop, skip) {
        if (!loop) {
            return;
        }
        // var objRequest = {$and:[{urlWikipedia:{$ne:""}},{$where: "this.rdf.length <200"}]};//Permet d'avoir les documents n'ayant pas d'informations dans le RDF
        var objRequest = {
            urlWikipedia: {
                $ne: ""
            }
        }; // permet de mettre a jour le RDF
        // var objRequest = {urlWikipedia:{$eq:"http://en.wikipedia.org/wiki/Roulette_russe"}};
        // var objRequest = {$and:[{"urlWikipedia":{$ne:''}},{$where:"this.locationInfo.length>0" },{"locationInfo.0":{$eq:'France'}}]};
        // var objRequest = {$and:[{urlWikipedia:{$ne:""}},{rdf:{$exists:false}}]}; // permet de créer le RDF
        var objProjection = {
            _id: 1,
            urlWikipedia: 1,
            name: 1,
            locationInfo: 1
        };
        var limit = 100;
        //find sur les artistes / albums / musiques
        db.collection(collection).find(objRequest, objProjection).skip(skip).limit(limit).toArray(function (err, tObjCollection) {
            //il y a moins d'objet dans la collection recherché que la limit donc on arrive à la fin
            if (tObjCollection.length < limit) {
                loop = false;
            }
            var i = 0;
            if (tObjCollection.length != 0) {
                //Utilisation de la récursivité afin de ne pas se faire bannir par DBpédia pour avoir envoyé trop de requêtes
                (function tObjCollectionLoop(i) {
                    var objCollection = tObjCollection[i];
                    //On doit récupérer l'attribut locationInfo afin de vérifier si l'artiste est francais, si il l'ai on cherchera sur le dbpédia francais meme si le lien wikipèdia de la bdd
                    // pointe vers le wikipèdia anglais ou un autre wikipèdia
                    db.collection(COLLECTIONARTIST).findOne({
                        name: objCollection.name
                    }, objProjection, function (err, artistLocation) {
                        //fonction nous retournant un objet ayant 3 propriétés :{ country: 'fr.', urlDbpedia: 'Georges_Brassens', fillIfFr:'' }
                        var objUrl = dbpediaHandler.extractInfosFromURL(objCollection.urlWikipedia, artistLocation, urlWikipediaToSplit);
                        //On construit la requête permettant de verifier si la page a une redirection
                        var redirectRequest = redirect_request.construct_request(objUrl.urlDbpedia, objUrl.country);
                        //On construit l'url endpoint
                        var urlEndpoint = construct_endpoint.construct_endpoint(objUrl.country);
                        (function requestsDbpedia(objCollection, redirectRequest, urlEndpoint, objUrl) {
                            //On vérifie si l'url à une redirection vers la bonne page DBpédia
                            dbpediaHandler.getRedirectionOfDbpedia(objCollection, redirectRequest, urlEndpoint, objUrl, urlDbpediaToSplit).then(function (objRedirect) {
                                //Si l'artiste/album/musique est français et que l'urlWikipedia ne pointe pas vers le dbpédia fr alors fillIfFr sera rempli
                                if (objRedirect.objUrl.fillIfFr == 'fr.') {
                                    console.log("FRENCH ARTIST FOUND");
                                    // on lance la requête SPARQL vers le dbpédia non français afin de récupérer l'attribut sameAs contenant une URI vers dbpédia fr
                                    var sameAsRequest = same_as_request.construct_request(objRedirect.objUrl.urlDbpedia, objRedirect.objUrl.country);
                                    dbpediaHandler.getSameAsOfDbpedia(objRedirect, sameAsRequest).then(function (objSameAs) {
                                        dbpediaHandler.handlerGetSameAsOfDbpedia(objSameAs, urlDbpediaToSplit, urlWikipediaToSplit);
                                        //On relance la fonction requestsDbpedia avec l'objUrl ne contenant plus de fillIfFr afin de passer dans le ELSE ci-dessous
                                        requestsDbpedia(objSameAs.obj, objSameAs.redirectRequest, objSameAs.urlEndpoint, objSameAs.objUrl)
                                    });
                                } else {
                                    //Permet de construire les requêtes d'éxtraction de RDF pour un artiste, album ou musique
                                    var sparql_request = dbpediaHandler.constructExtractionRequest(collection, objRedirect);
                                    dbpediaHandler.getInfosDbpedia(objRedirect.obj, sparql_request, objRedirect.urlEndpoint).then(function (objCollection) {
                                        var rdfValue = objCollection.rdf.replace(/\n|\t/g, " ").replace(/\"/g, "'");
                                        //On reconstruit l'URL pour la mettre a jour dans notre base de données :
                                        if (objRedirect.redirectTo != '') {
                                            console.log("Change urlWikipedia with redirectTo");
                                            objCollection.urlWikipedia = dbpediaHandler.constructNewURLWikipedia(objRedirect.redirectTo, urlWikipediaToSplit);
                                        }
                                        db.collection(collection).update({
                                            _id: new ObjectId(objCollection._id)
                                        }, {
                                            $set: {
                                                "urlWikipedia": objCollection.urlWikipedia,
                                                "rdf": rdfValue
                                            }
                                        });
                                        if (rdfValue.length < 200) {
                                            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! RDF VIDE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                        }
                                        console.log(rdfValue.length + " RDF Added => " + objRedirect.objUrl.urlDbpedia);
                                        if (i < tObjCollection.length - 1) {
                                            i++;
                                            //On attend avant l'envoie de la prochaine requête -> évite de se faire bannir
                                            setTimeout(function () {
                                                tObjCollectionLoop(i);
                                            }, Math.floor((Math.random() * 100) + 100));
                                        } else {
                                            console.log("===========================NEXT LIMIT : getRequestLoop = " + loop + "===========================");
                                            if (!loop) {
                                                console.log("===========================TRAITEMENT TERMINEE===========================");
                                            }
                                            skip += limit;
                                            console.log("SKIP = " + skip);
                                            getRequestLoop(loop, skip);
                                        }
                                    });
                                }
                            });
                        })(objCollection, redirectRequest, urlEndpoint, objUrl)
                    });
                })(i);
            }
        });
    })(loop, skip);
    res.send("OK");
});

router.get('/add/:collection/:_id', function (req, res) {
    var db = req.db,
        id = req.params._id,
        collection = req.params.collection;
    if (collection != COLLECTIONARTIST && collection != COLLECTIONALBUM && collection != COLLECTIONSONG) {
        return res.status(404).send([{
            error: "Page not found"
        }]);
    }
    var objRequest = {
        _id: ObjectId(id)
    }; // permet de mettre a jour le RDF
    var objProjection = {
        _id: 1,
        urlWikipedia: 1,
        name: 1,
        locationInfo: 1
    };
    new Promise(function (resolve, reject) {
        //On récupère le document dans lequel doit être inséré du RDf
        db.collection(collection).findOne(objRequest, objProjection, function (err, objCollection) {
            resolve(objCollection);
        });
    }).then(function (objCollection) {
        return new Promise((resolve, reject) => {
            db.collection(COLLECTIONARTIST).findOne({
                name: objCollection.name
            }, objProjection, function (err, artistLocation) {
                var obj = {};
                var objUrl = dbpediaHandler.extractInfosFromURL(objCollection.urlWikipedia, artistLocation, urlWikipediaToSplit);
                //On construit la requête permettant de verifier si la page a une redirection
                var redirectRequest = redirect_request.construct_request(objUrl.urlDbpedia, objUrl.country);
                //On construit l'url endpoint
                var urlEndpoint = construct_endpoint.construct_endpoint(objUrl.country);
                obj.objUrl = objUrl;
                obj.objCollection = objCollection;
                obj.redirectRequest = redirectRequest;
                obj.urlEndpoint = urlEndpoint;
                resolve(obj);
            });
        });
    }).then(function (obj) {
        (function requestsDbpedia(objCollection, redirectRequest, urlEndpoint, objUrl) {
            //On vérifie si l'url à une redirection vers la bonne page DBpédia
            dbpediaHandler.getRedirectionOfDbpedia(objCollection, redirectRequest, urlEndpoint, objUrl, urlDbpediaToSplit).then(function (objRedirect) {
                //Si l'artiste/album/musique est français et que l'urlWikipedia ne pointe pas vers le dbpédia fr alors fillIfFr sera rempli
                if (objRedirect.objUrl.fillIfFr == 'fr.') {
                    console.log("FRENCH ARTIST FOUND");
                    // on lance la requête SPARQL vers le dbpédia non français afin de récupérer l'attribut sameAs contenant une URI vers dbpédia fr
                    var sameAsRequest = same_as_request.construct_request(objRedirect.objUrl.urlDbpedia, objRedirect.objUrl.country);
                    dbpediaHandler.getSameAsOfDbpedia(objRedirect, sameAsRequest).then(function (objSameAs) {
                        dbpediaHandler.handlerGetSameAsOfDbpedia(objSameAs, urlDbpediaToSplit, urlWikipediaToSplit);
                        //On relance la fonction requestsDbpedia avec l'objUrl ne contenant plus de fillIfFr afin de passer dans le ELSE ci-dessous
                        requestsDbpedia(objSameAs.obj, objSameAs.redirectRequest, objSameAs.urlEndpoint, objSameAs.objUrl)
                    });
                } else {
                    //Permet de construire les requêtes d'éxtraction de RDF pour un artiste, album ou musique
                    var sparql_request = dbpediaHandler.constructExtractionRequest(collection, objRedirect);
                    dbpediaHandler.getInfosDbpedia(objRedirect.obj, sparql_request, objRedirect.urlEndpoint).then(function (objCollection) {
                        var rdfValue = objCollection.rdf.replace(/\n|\t/g, " ").replace(/\"/g, "'");
                        //On reconstruit l'URL pour la mettre a jour dans notre base de données :
                        if (objRedirect.redirectTo != '') {
                            console.log("Change urlWikipedia with redirectTo");
                            objCollection.urlWikipedia = dbpediaHandler.constructNewURLWikipedia(objRedirect.redirectTo, urlWikipediaToSplit);
                        }
                        db.collection(collection).update({
                            _id: new ObjectId(objCollection._id)
                        }, {
                            $set: {
                                "urlWikipedia": objCollection.urlWikipedia,
                                "rdf": rdfValue
                            }
                        }, function () {
                            if (rdfValue.length < 200) {
                                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! RDF VIDE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                            }
                            res.send("OK");
                        });
                        console.log(rdfValue.length + " RDF Added => " + objRedirect.objUrl.urlDbpedia);
                        console.log("===========================TRAITEMENT TERMINEE===========================");
                    });
                }
            });
        })(obj.objCollection, obj.redirectRequest, obj.urlEndpoint, obj.objUrl)
    }).catch(function (e) {
        console.log('catch: ', e);
    });
});

/**
 * API used to insert RDF field into wasabi
 */
router.get('/createfields/artist', function (req, res) {
    var db = req.db;
    db.collection(COLLECTIONARTIST).find({
        name: "Metallica"
        // $and: [{
        //     rdf: {
        //         $ne: ""
        //     }
        // }, {
        //     rdf: {
        //         $exists: true
        //     }
        // }]
    }).toArray((err, tObjArtist) => {
        var inc = 0;
        var nbWasabiMember = 0;
        var nbWasabiFormerMember = 0;
        var nbRDFMember = 0;
        var nbRDFFormerMember = 0;
        for (var i = 0; i < tObjArtist.length; i++) {
            if (tObjArtist[i].rdf.length > 200) {
                //On nettoie les propriétés de la base de données
                parseString(tObjArtist[i].rdf, function (err, result) {
                    if (result != null && typeof result['rdf:RDF']['rdf:Description'] !== "undefined") {
                        //Pour chaque description, c'est a dire, pour les members et anciens membres + pour l'artiste
                        for (var k = 0; k < result['rdf:RDF']['rdf:Description'].length; k++) {
                            var description = result['rdf:RDF']['rdf:Description'][k];
                            var objUrl = dbpediaHandler.extractInfosFromURL(tObjArtist[i].urlWikipedia, "", urlWikipediaToSplit);
                            //On traite l'artiste/groupe
                            if ("http://" + objUrl.country + "dbpedia.org/resource/" + objUrl.urlDbpedia == description['$']['rdf:about']) {
                                var rdfProperties = ['dct:subject', 'dbo:associatedMusicalArtist', 'dbo:genre', 'dbo:recordLabel', 'dbo:abstract'];
                                for (var j = 0; j < rdfProperties.length; j++) {
                                    var currProperty = rdfProperties[j].substring(rdfProperties[j].indexOf(':') + 1); //ex : dct:subject deviendra subject
                                    if (currProperty == "genre" || currProperty == "abstract") {
                                        tObjArtist[i]["dbp_" + currProperty] = dbpediaHandler.extractInfosFromRDF(description, rdfProperties[j]);
                                    } else {
                                        tObjArtist[i][currProperty] = dbpediaHandler.extractInfosFromRDF(description, rdfProperties[j]);
                                    }
                                }
                            } else { //we add news fields to members
                                var rdfProperties = ['dct:subject', 'dbo:birthDate', 'dbo:abstract'];
                                var urlDbpediaMember = description['$']['rdf:about'];
                                var endUrlDbpediaMember = urlDbpediaMember.substring(urlDbpediaMember.lastIndexOf('/') + 1);
                                var formerOrMember = {};
                                //On construit le member ou le former member en itérant sur les propriétés rdfProperties
                                for (var m = 0; m < tObjArtist[i].members.length; m++) {
                                    var urlWikipediaMember = tObjArtist[i].members[m].urlWikipedia;
                                    var endUrlWikipediaMember = urlWikipediaMember.substring(urlWikipediaMember.lastIndexOf('/') + 1);
                                    if (endUrlWikipediaMember == endUrlDbpediaMember || tObjArtist[i].members[m].name == description['rdfs:label'][0]['_']) {
                                        console.log(tObjArtist[i].members[m].name, description['rdfs:label'][0]['_']);
                                        console.log(endUrlWikipediaMember, endUrlDbpediaMember);
                                        for (var j = 0; j < rdfProperties.length; j++) {
                                            //https://en.wikipedia.org/wiki/Ron_McGovney -> Ron_McGovney now we can check with the end of dbpedia url
                                            var currProperty = rdfProperties[j].substring(rdfProperties[j].indexOf(':') + 1); //ex : dct:subject deviendra subject
                                            //on ajoute des propriétés a l'objet formerOrMember
                                            formerOrMember[currProperty] = dbpediaHandler.extractInfosFromRDF(description, rdfProperties[j]);
                                        }
                                    }
                                }
                                console.log(formerOrMember)
                            }
                        }
                    }
                });
            }
            // db.collection(COLLECTIONARTIST).update({
            //     _id: new ObjectId(tObjArtist[i]._id)
            // }, {
            //     $set: tObjArtist[i]
            // });
        }
        console.log('Fin du traitement');
    });
    res.send("OK");
});

//TODO
router.get('/createfields/album', function (req, res) {
    var db = req.db;
    var total = 0;
    var totalProd = 0;
    var totalOk = 0;
    //Propriété présent dans le RDF et dont nous avons besoin pour accèder a l'objet musique crée par parseString
    var rdfPropertiesAlbum = ['abstract', 'artist', 'genre', 'producer', 'recordDate', 'recordLabel', 'releaseDate', 'runtime', 'subject', 'award', 'studio'];
    var rdfPropertiesProducer = ['abstract', 'associatedMusicalArtist', 'recordLabel', 'subject', 'artist', 'occupation'];
    db.collection(COLLECTIONALBUM).find({
        $and: [{
            title: "Help!"
        }, {
            name: "The Beatles"
        }, {
            $where: "this.rdf.length>200"
        }]
    }, {
        wordCount: 0
    }).toArray(function (err, tObjAlbum) {
        // db.collection(COLLECTIONALBUM).find({$and:[{rdf:{$ne:""}},{rdf:{$exists:true}},{$where:"this.rdf.length>200"}]},{wordCount:0, lyrics:0}).toArray(function(err,tObjAlbum){
        console.log('En cours de traitement ...');
        for (var i = 0; i < tObjAlbum.length; i++) {
            //Pour chaque musique contenant du RDF valide
            total++;
            //Transformation du RDF en un objet JSON
            parseString(tObjAlbum[i].rdf, function (err, result) {
                //Si le document est bien parsé il contiendra 'rdf:Description', correspondant à la ou les pages DBpédia ayant servi pour l'extraction des données
                //Par exemple lors de l'extraction d'un album l'extraction se fera sur la page contenant des informations sur l'albums mais aussi sur la/les page(s) correspondant au(x) producteur(s) de l'album
                if (result != null && typeof result['rdf:RDF']['rdf:Description'] !== "undefined") {
                    var objUrl = dbpediaHandler.extractInfosFromURL(tObjAlbum[i].urlWikipedia, '', urlWikipediaToSplit);
                    var found = false;
                    var tDescription = [];
                    for (var k = 0; k < result['rdf:RDF']['rdf:Description'].length; k++) {
                        var description = result['rdf:RDF']['rdf:Description'][k];
                        tDescription.push(description['$']['rdf:about']);
                        // console.log(decodeURIComponent(objUrl.urlDbpedia));
                        //On traite l'album
                        if (decodeURIComponent(description['$']['rdf:about']).endsWith(decodeURIComponent(objUrl.urlDbpedia))) {
                            totalOk++;
                            // console.log(description['$']['rdf:about']);
                            found = true;
                            // //Pour chaque propriété on récupére les données de l'objet musique représentant le RDF
                            //
                            for (var j = 0; j < rdfPropertiesAlbum.length; j++) {
                                var currProperty = rdfPropertiesAlbum[j];
                                //On va extraire le contenu de chaque propriété afin d'ajouter à l'objet tObjAlbum[i] les nouvelles propriétés
                                tObjAlbum[i][currProperty] = dbpediaHandler.extractInfosFromRDF(description, currProperty);
                                console.log("________________________________________________________________________" + currProperty + "________________________________________________________________________");
                                console.log(tObjAlbum[i][currProperty])
                            }
                            //     console.log('\n\n\n')
                        }
                        // //On traite le / les producteurs
                        else {
                            totalProd++;
                            console.log("________________________________________________________________________________________________________________________________________________________________");
                            console.log("________________________________________________________________________START Producteur________________________________________________________________________");
                            console.log("________________________________________________________________________________________________________________________________________________________________");
                            for (var j = 0; j < rdfPropertiesProducer.length; j++) {
                                var currProperty = rdfPropertiesProducer[j];
                                //On va extraire le contenu de chaque propriété afin d'ajouter à l'objet tObjAlbum[i] les nouvelles propriétés
                                tObjAlbum[i][currProperty] = dbpediaHandler.extractInfosFromRDF(description, currProperty);
                                console.log("________________________________________________________________________" + currProperty + "________________________________________________________________________");
                                console.log(tObjAlbum[i][currProperty])
                                // console.log(currProperty);
                                // console.log(tObjAlbum[i][currProperty])
                            }
                            console.log("________________________________________________________________________________________________________________________________________________________________");
                            console.log("_________________________________________________________________________END Producteur_________________________________________________________________________");
                            console.log("________________________________________________________________________________________________________________________________________________________________");
                            console.log('\n\n\n')
                        }
                    }
                    if (!found) {
                        console.log(objUrl);

                        console.log(tObjAlbum[i].urlWikipedia + " = !!!!!!!! Le groupe n'a pas été trouvé !!!!!!!! = " + decodeURIComponent(objUrl.urlDbpedia));
                        console.log(tDescription);
                        console.log("________________________");

                    }
                    // db.collection(COLLECTIONSONG).update({_id : new ObjectId(tObjAlbum[i]._id)}, { $set: tObjAlbum[i] },function(err,result) {
                    //     if (err) throw err;
                    // });
                }
            });
        }
        console.log("TOTAL PRODUCTEUR = " + totalProd);
        console.log("TOTAL OK = " + totalOk);
        console.log("TOTAL = " + total);
        console.log('Fin du traitement');
    });
    res.send("OK");
});

//permet d'extraire le RDF contenu dans chaque document de la collection 'song' et de créer les attributs issus du RDF
router.get('/createfields/song', function (req, res) {
    var db = req.db;
    dbpediaHandler.createFieldsSong(db, COLLECTIONSONG, SONG_RDF_PROPERTIES);
    res.send("OK");
});
//permet d'extraire le RDF contenu le document song ayant pour id :id
router.get('/createfields/song/:_id', function (req, res) {
    var db = req.db,
        id = req.params._id;
    dbpediaHandler.createFieldsSong(db, COLLECTIONSONG, SONG_RDF_PROPERTIES, id);
    res.send("OK");
});

export default router;