var express             = require('express');
var router              = express.Router();
var parseString         = require('xml2js').parseString;
var dbpediaHandler      = require('./handler/dbpediaHandler.js');
var utilHandler         = require('./handler/utilHandler.js');
var construct_endpoint  = require('./sparql_request/construct_endpoint.js');
var redirect_request    = require('./sparql_request/redirect_request.js');
var sameas_request      = require('./sparql_request/sameas_request.js');
var ObjectId            = require('mongoskin').ObjectID;

//Lorsque nous récupérons le champ urlWikipedia nous devons le spliter pour ne garder que le nom de l'artiste dans le but de construct la requête sparql
var urlWikipediaToSplit = "http://en.wikipedia.org/wiki/";
var urlDbpediaToSplit = "dbpedia.org/resource/";
//WEBSERVICE permettant d'extraire les données de dbpédia en fonction de la propriété urlWikipedia présent dans chaque document de notre base de données
router.get('/:collection',function(req, res){
    var db = req.db;
    var collection = req.params.collection;
    if(collection !="artist" && collection !="album" && collection !="song"){
        return res.status(404).send([{error:"Page not found"}]);
    }
    var loop = true;
    var skip = 0;
    //extraire l'url de wikipedia de objAlbum.urlWikipedia
    (function getRequestLoop(loop,skip){
        if(!loop){
            return;
        }
        // var objRequest = {$and:[{urlWikipedia:{$ne:""}},{$where: "this.rdf.length <200"}]};//Permet d'avoir les documents n'ayant pas d'informations dans le RDF
        var objRequest = {urlWikipedia:{$ne:""}}; // permet de mettre a jour le RDF
        // var objRequest = {urlWikipedia:{$eq:"http://en.wikipedia.org/wiki/Roulette_russe"}};
        // var objRequest = {$and:[{"urlWikipedia":{$ne:''}},{$where:"this.locationInfo.length>0" },{"locationInfo.0":{$eq:'France'}}]};
        // var objRequest = {$and:[{urlWikipedia:{$ne:""}},{rdf:{$exists:false}}]}; // permet de créer le RDF
        var objProjection = {_id:1,urlWikipedia:1,name:1,locationInfo:1};
        var limit = 1000;
        //find sur les artistes / albums / musiques
        db.collection(collection).find(objRequest,objProjection).skip(skip).limit(limit).toArray(function(err,tObjCollection){
            //il y a moins d'objet dans la collection recherché que la limit donc on arrive à la fin
            if(tObjCollection.length <limit){
                loop = false;
            }
            var i=0;
            if(tObjCollection.length != 0){
                //Utilisation de la récursivité afin de ne pas se faire bannir par DBpédia pour avoir envoyé trop de requêtes
                (function tObjCollectionLoop(i){
                    var objCollection = tObjCollection[i];
                    //On doit récupérer l'attribut locationInfo afin de vérifier si l'artiste est francais, si il l'ai on cherchera sur le dbpédia francais meme si le lien wikipèdia de la bdd
                    // pointe vers le wikipèdia anglais ou un autre wikipèdia
                    db.collection("artist").findOne({$and:[{$where:"this.locationInfo.length>0 && this.locationInfo[0] == 'France' "},{name : objCollection.name}]}, objProjection,function(err,artistLocation){//{name : objCollection.name}
                        //fonction nous retournant un objet ayant 2 propriétés :{ country: 'fr.', urlDbpedia: 'Georges_Brassens', fillIfFr:'' }
                        if(artistLocation == null){
                            if (i < tObjCollection.length - 1) {
                                i++;
                                //On attend avant l'envoie de la prochaine requête -> évite de se faire bannir
                                setTimeout(function () {
                                    tObjCollectionLoop(i);
                                }, Math.floor((Math.random() * 100) + 100));
                            }
                            else {
                                console.log("===========================NEXT LIMIT : getRequestLoop = " + loop + "===========================");
                                if (!loop) {
                                    console.log("===========================TRAITEMENT TERMINEE===========================");
                                }
                                skip+=limit;
                                console.log("SKIP = "+ skip);
                                getRequestLoop(loop,skip);
                            }
                        }
                        else{
                            var objUrl = dbpediaHandler.extractInfosFromURL(objCollection.urlWikipedia, artistLocation, urlWikipediaToSplit);
                            //On construit la requête permettant de verifier si la page a une redirection
                            var redirectRequest = redirect_request.construct_request(objUrl.urlDbpedia, objUrl.country);
                            //On construit l'url endpoint
                            var urlEndpoint = construct_endpoint.construct_endpoint(objUrl.country);
                            console.log("\n\n");
                            console.log("Verification de l'objet "+collection+" => "+objUrl.urlDbpedia+" ...");
                            (function requestsDbpedia(objCollection, redirectRequest, urlEndpoint, objUrl) {
                                //On vérifie si l'url à une redirection vers la bonne page DBpédia
                                dbpediaHandler.getRedirectionOfDbpedia(objCollection, redirectRequest, urlEndpoint, objUrl).then(function (objRedirect) {
                                    console.log("Traitement de l'objet "+collection+" => "+objRedirect.objUrl.urlDbpedia+" ...");
                                    //Si nous l'artiste/album/musique est français et que l'urlWikipedia ne pointe pas vers le dbpédia fr
                                    if (objRedirect.objUrl.fillIfFr == 'fr.') {
                                        console.log("FRENCH ARTIST FOUND");
                                        // on lance la requête SPARQL vers le dbpédia non français afin de récupérer l'attribut sameAs contenant une URI vers dbpédia fr
                                        var sameAsRequest = sameas_request.construct_request(objRedirect.objUrl.urlDbpedia, objRedirect.objUrl.country);
                                        dbpediaHandler.getSameAsOfDbpedia(objRedirect, sameAsRequest).then(function (objSameAs) {
                                            console.log(objSameAs);
                                            if (objSameAs.objUrl.sameAs != "") {//si une URI vers dbpédia fr existe
                                                console.log("FRENCH ARTIST FOUND : With SameAs")
                                                objSameAs.objUrl.country = objSameAs.objUrl.fillIfFr;
                                                //On transforme l'objet objUrl afin qu'il soit de même forme qu'un objUrl ayant une url pointant vers le dbpédia fr : http://en.wikipedia.org/wiki/fr:Artist_Name"
                                                console.log(objSameAs.obj.urlWikipedia)
                                                objSameAs.obj.urlWikipedia = dbpediaHandler.constructNewURLWikipedia(objSameAs.objUrl.sameAs, urlWikipediaToSplit);
                                                console.log(objSameAs.obj.urlWikipedia)
                                                // objSameAs.objUrl.sameAs == http://fr.dbpedia.org/resource/Akhenaton_(rappeur) on ne garde que "Akhenaton_(rappeur)" pour urlDbpedia
                                                objSameAs.objUrl.urlDbpedia = objSameAs.objUrl.sameAs.split(urlDbpediaToSplit)[1];
                                            }
                                            objSameAs.objUrl.sameAs = "";
                                            objSameAs.objUrl.fillIfFr = "";
                                            //On recrée le endpoint et les requêtes SPARQL afin qu'elles puissent extraire les informations sur le dbpédia français
                                            var redirectRequest = redirect_request.construct_request(objSameAs.objUrl.urlDbpedia, objSameAs.objUrl.country);
                                            //On construit l'url endpoint avec l'adresse du endpoint fr
                                            var urlEndpoint = construct_endpoint.construct_endpoint(objSameAs.objUrl.country);
                                            //On relance la fonction requestsDbpedia avec l'objUrl ne contenant plus de fillIfFr afin de passer dans le ELSE ci-dessous
                                            requestsDbpedia(objSameAs.obj, redirectRequest, urlEndpoint, objSameAs.objUrl)
                                        });
                                    } else {
                                        //Permet de construire les requêtes d'éxtraction de RDF pour un artiste, album ou musique
                                        var sparql_request = dbpediaHandler.constructExtractionRequest(collection, objRedirect);
                                        dbpediaHandler.getInfosDbpedia(objRedirect.obj, sparql_request, objRedirect.urlEndpoint).then(function (objCollection) {
                                            var rdfValue = objCollection.rdf.replace(/\n|\t/g, " ").replace(/\"/g, "'");
                                            console.log("______________________________________________");
                                            //On reconstruit l'URL pour la mettre a jour dans notre base de données :
                                            console.log(objCollection.urlWikipedia);
                                            if (objRedirect.redirectTo != '') {
                                                objCollection.urlWikipedia = dbpediaHandler.constructNewURLWikipedia(objRedirect.redirectTo, urlWikipediaToSplit);
                                            }
                                            console.log(objCollection.urlWikipedia);
                                            console.log("______________________________________________");
                                            db.collection(collection).update({_id : new ObjectId(objCollection._id)}, { $set: {"urlWikipedia":objCollection.urlWikipedia,"rdf": rdfValue} });
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
                                            }
                                            else {
                                                console.log("===========================NEXT LIMIT : getRequestLoop = " + loop + "===========================");
                                                if (!loop) {
                                                    console.log("===========================TRAITEMENT TERMINEE===========================");
                                                }
                                                skip+=limit;
                                                console.log("SKIP = "+ skip);
                                                getRequestLoop(loop,skip);
                                            }
                                        });
                                    }
                                });
                            })(objCollection, redirectRequest, urlEndpoint, objUrl)
                        }
                    });
                })(i);
            }
        });
    })(loop,skip);
    res.send("OK");
});

//TODO
router.get('/artist/createfields',function(req, res){
        var db = req.db;
//        db.collection('artist').find({$and:[{rdf:{$ne:""}},{rdf:{$exists:true}}]},{wordCount:0}).limit(5000).toArray(function(err,tObjArtist){
        db.collection('artist').find({name:"Metallica"},{wordCount:0}).toArray(function(err,tObjArtist){
            var inc = 0 ;
            var nbWasabiMember = 0;
            var nbWasabiFormerMember = 0;
            var nbRDFMember = 0;
            var nbRDFFormerMember = 0;
            for(var i = 0; i<tObjArtist.length;i++){
                if(tObjArtist[i].rdf.length>200){
                    //On nettoie les propriétés de la base de données
                    tObjArtist[i] = utilHandler.sanitizeProperties(tObjArtist[i]);
                    parseString(tObjArtist[i].rdf, function (err, result) {
                        if(result !=null && typeof result['rdf:RDF']['rdf:Description'] !== "undefined"){
                            //On veut traiter le groupe avant de traiter les membres afin de connaitre les divers members/formerMembers
                            var artistDone = false;
                            //Pour chaque description, c'est a dire, pour les members et anciens membres + pour l'artiste
                            for(var k = 0;k<result['rdf:RDF']['rdf:Description'].length;k++){
                                var description = result['rdf:RDF']['rdf:Description'][k];
                                var objUrl = dbpediaHandler.extractInfosFromURL(tObjArtist[i].urlWikipedia,"",urlWikipediaToSplit);
                                //On traite l'artiste/groupe
                                if("http://"+objUrl.country+"dbpedia.org/resource/"+objUrl.urlDbpedia == description['$']['rdf:about'] && artistDone == false){
                                    artistDone = true;
                                    var rdfProperties = ['dct:subject','dbo:associatedMusicalArtist','dbo:bandMember','dbo:formerBandMember','dbo:genre',
                                                         'dbo:recordLabel','dbo:abstract','dbo:activeYearsStartYear'];
                                    //console.log(description['$']['rdf:about']);
                                    for(var j = 0;j<rdfProperties.length;j++){
//                                        console.log(rdfProperties[j]);
                                        var currProperty = rdfProperties[j].substring(rdfProperties[j].indexOf(':')+1); //ex : dct:subject deviendra subject
                                        tObjArtist[i][currProperty] = dbpediaHandler.extractInfosFromRDF(description,rdfProperties[j]);
                                    }
                                    tObjArtist[i] = dbpediaHandler.mergeRDFAndDBProperties(tObjArtist[i]);

                                    
//                                    console.log(tObjArtist[i]);
                                    
//                                    console.log(tObjArtist[i].bandMember);
//                                    console.log(tObjArtist[i].formerBandMember);
//                                    console.log(tObjArtist[i].members);
//                                    console.log(tObjArtist[i].formerMembers);
//                                    for(var j = 0 ;j<tObjArtist[i].bandMember.length; j++){
//                                        var sanitizeStrMemberRDF = tObjArtist[i].bandMember[j].replace(/(\s+)|(\((.+)\))/g, "");
//                                        for(var x = 0 ;x<tObjArtist[i].members.length;x++){
//                                            var sanitizeStrMemberDB = tObjArtist[i].members[x].name.replace(/(\s+)|(\((.+)\))/g, "");
//                                            var relevance = dbpediaHandler.levenshteinDistance(sanitizeStrMemberRDF,sanitizeStrMemberDB);
//                                            if(relevance==0){
//                                                console.log(inc++);
//                                            }
//                                        }
//                                    }
                                    k=0;//On a traité le groupe maintenant on peut traiter les membres
                                }
                                else{//on traite les membres et anciens membres du groupe
//                                    var rdfProperties = ['dct:subject','dbo:birthDate','dbp:birthName','dbp:instrument','rdfs:label','dbo:abstract','dbo:activeYearsStartYear'];
//                                    console.log("\n\n")
//                                    var formerOrMember = {};
//                                    //On construit le member ou le former member en itérant sur les propriétés rdfProperties
//                                    
//                                    for(var j = 0;j<rdfProperties.length;j++){
//                                        var currProperty = rdfProperties[j].substring(rdfProperties[j].indexOf(':')+1); //ex : dct:subject deviendra subject
//                                        //on ajoute des propriétés a l'objet formerOrMember
//                                        formerOrMember[currProperty] = dbpediaHandler.extractInfosFromRDF(description,rdfProperties[j]);
//                                    }
//                                    //On verifie si il y a des members ou des formerMembers
//                                        //Si des membrers || formerMembers existes
//                                        if(tObjArtist[i].members.length>0){
//                                            
//                                        }
//                                        else{
//
//                                        }
//                                        if(tObjArtist[i].formerMembers.length>0){
//                                            
//                                        }
//                                        else{
//
//                                        }
//                                        console.log(dbpediaHandler.levenshteinDistance(formerOrMember.label,formerOrMember.birthName));
//                                            //Vérifier si il existe un match entre le label issu du rdf et (formerMember||members)[x].name issu de la bd wasabi
//                                            //Si ce match n'est pas concluant on utilise l'algorithme de levenshtein
//                                                //Si un match est réalisé on va ajouter la birthDate, subject, abstract
//                                                //Si (formerMember||members)[x].instrument.length>0
//                                                    //On ajoute verifie si il existe un match entre les instruments + levenshtein
//                                                //Si (formerMember||members)[x].instrument est vide 
//                                                    //On ajoute les instruments (split ',')
//                                                //Si des (formerMember||members)[x].activeYears.length ==0
//                                                    //on ajoute en bdd activeYearsStartYear
//                                        //Si aucun members||formerMembers alors
//                                            //On ajoute en BDD subject,birthDate, birthName->name, si aucun birthName ajouter label->name, instrument,abstract et activeYearsStartYear-> activeYears
//                                    console.log(formerOrMember)
                                }
                            }
//                                    nbWasabiMember += tObjArtist[i].members.length;
//                                    nbWasabiFormerMember += tObjArtist[i].formerMembers.length;
//                                    if(Boolean(tObjArtist[i].bandMember)){
//                                        nbRDFMember += tObjArtist[i].bandMember.length;
//                                    }
//                                    if(Boolean(tObjArtist[i].formerBandMember)){
//                                           nbRDFFormerMember += tObjArtist[i].formerBandMember.length; 
//                                    }
                                    
                            
                        }
                    });
                }
            }
            console.log("Nombre de wasabi member ="+nbWasabiMember);
            console.log("Nombre de wasabi former member ="+nbWasabiFormerMember);
            console.log("Nombre de RDF member ="+nbRDFMember);
            console.log("Nombre de RDF formerMember ="+nbRDFFormerMember);
            console.log('Fin du traitement');
//            db.collection('artist').update({_id : new ObjectId(objArtist._id)}, { $set: {"rdf": rdfValue} });
        });
    res.send("OK");
});

//TODO
router.get('/album/createfields',function(req, res){
    var db = req.db;
    //Propriété présent dans le RDF et dont nous avons besoin pour accèder a l'objet musique crée par parseString
    var rdfPropertiesAlbum = [   'abstract','artist','genre','producer','recordDate','recordLabel','releaseDate','runtime','subject','award','studio'];
    var rdfPropertiesProducer = ['abstract','associatedMusicalArtist','recordLabel','subject','artist','occupation'];
    // db.collection('album').find({$and:[{titre:"Help!"},{name:"The Beatles"}]},{wordCount:0}).toArray(function(err,tObjAlbum){
    db.collection('album').find({$and:[{rdf:{$ne:""}},{rdf:{$exists:true}}]},{wordCount:0, lyrics:0}).toArray(function(err,tObjAlbum){
        console.log('En cours de traitement ...');
        for(var i = 0; i<tObjAlbum.length;i++){
            //Pour chaque musique contenant du RDF valide
            if(tObjAlbum[i].rdf.length>200){
                //Transformation du RDF en un objet JSON
                parseString(tObjAlbum[i].rdf, function (err, result) {
                    //Si le document est bien parsé il contiendra 'rdf:Description', correspondant à la ou les pages DBpédia ayant servi pour l'extraction des données
                    //Par exemple lors de l'extraction d'un album l'extraction se fera sur la page contenant des informations sur l'albums mais aussi sur la/les page(s) correspondant au(x) producteur(s) de l'album
                    if(result != null && typeof result['rdf:RDF']['rdf:Description'] !== "undefined"){
                        var objUrl= dbpediaHandler.extractInfosFromURL(tObjAlbum[i].urlWikipedia,'',urlWikipediaToSplit);
                        var found = false;
                        var tDescription = [];
                        for(var k = 0;k<result['rdf:RDF']['rdf:Description'].length;k++){
                            var description = result['rdf:RDF']['rdf:Description'][k];
                            tDescription.push(description['$']['rdf:about']);
                            // console.log(decodeURIComponent(objUrl.urlDbpedia));
                            //On traite l'album
                            if(decodeURIComponent(description['$']['rdf:about']).endsWith(decodeURIComponent(objUrl.urlDbpedia)) ){
                                found=true;
                            // //Pour chaque propriété on récupére les données de l'objet musique représentant le RDF
                            //
                            //     for(var j = 0;j<rdfPropertiesAlbum.length;j++){
                            //         var currProperty = rdfPropertiesAlbum[j];
                            //         //On va extraire le contenu de chaque propriété afin d'ajouter à l'objet tObjAlbum[i] les nouvelles propriétés
                            //         tObjAlbum[i][currProperty] = dbpediaHandler.extractInfosFromRDF(description,currProperty);
                            //         // console.log(currProperty);
                            //         // console.log(tObjAlbum[i][currProperty])
                            //     }
                            //     console.log('\n\n\n')
                            }
                            // //On traite le / les producteurs
                            // else{
                            //     for(var j = 0;j<rdfPropertiesProducer.length;j++){
                            //         var currProperty = rdfPropertiesProducer[j];
                            //         //On va extraire le contenu de chaque propriété afin d'ajouter à l'objet tObjAlbum[i] les nouvelles propriétés
                            //         tObjAlbum[i][currProperty] = dbpediaHandler.extractInfosFromRDF(description,currProperty);
                            //         // console.log(currProperty);
                            //         // console.log(tObjAlbum[i][currProperty])
                            //     }
                            //     console.log('\n\n\n')
                            // }
                        }
                        if(!found){
                            console.log(tObjAlbum[i].urlWikipedia+" = !!!!!!!! Le groupe n'a pas été trouvé !!!!!!!! = "+decodeURIComponent(objUrl.urlDbpedia));
                            console.log(tDescription);
                            console.log("________________________");

                        }
                        // db.collection('song').update({_id : new ObjectId(tObjAlbum[i]._id)}, { $set: tObjAlbum[i] },function(err,result) {
                        //     if (err) throw err;
                        // });
                    }
                });
            }
        }
        console.log('Fin du traitement');
    });
    res.send("OK");
});

router.get('/song/createfields',function(req, res){
    var db = req.db;
    //Propriété présent dans le RDF et dont nous avons besoin pour accèder a l'objet musique crée par parseString
    var rdfProperties = ['subject','format','genre','producer','recordLabel','writer','recorded','abstract','releaseDate','runtime','award'];
        // db.collection('song').find({$and:[{albumTitre:"Help!"},{titre:"Help!"}]},{wordCount:0, lyrics:0}).toArray(function(err,tObjSong){
        db.collection('song').find({$and:[{rdf:{$ne:""}},{rdf:{$exists:true}}]},{wordCount:0, lyrics:0}).toArray(function(err,tObjSong){
            console.log('En cours de traitement ...');
            for(var i = 0; i<tObjSong.length;i++){
                //Pour chaque musique contenant du RDF valide
                if(tObjSong[i].rdf.length>200){
                    //Transformation du RDF en un objet JSON
                    parseString(tObjSong[i].rdf, function (err, result) {
                        //Si le document est bien parsé et contient rdf:Description, c'est à dire la ou les pages DBpédia ayant servi pour l'extraction des données
                        //Dans le cas d'une musique une seul page DBpédia a été utilisée pour extraire des données
                        if(result != null && typeof result['rdf:RDF']['rdf:Description'] !== "undefined"){
                            for(var k = 0;k<result['rdf:RDF']['rdf:Description'].length;k++){
                                var description = result['rdf:RDF']['rdf:Description'][k];
                                //Pour chaque propriété on récupére les données de l'objet musique représentant le RDF
                                for(var j = 0;j<rdfProperties.length;j++){
                                    var currProperty = rdfProperties[j];
                                    //On va extraire le contenu de chaque propriété afin d'ajouter à l'objet tObjSong[i] les nouvelles propriétés
                                    tObjSong[i][currProperty] = dbpediaHandler.extractInfosFromRDF(description,currProperty);
                                }
                            }
                            db.collection('song').update({_id : new ObjectId(tObjSong[i]._id)}, { $set: tObjSong[i] },function(err,result) {
                                if (err) throw err;
                            });
                        }
                    });
                }
            }
            console.log('Fin du traitement');
        });
    res.send("OK");
});


module.exports = router;



