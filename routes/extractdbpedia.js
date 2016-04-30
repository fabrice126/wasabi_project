var express         = require('express');
var router          = express.Router();
var parseString     = require('xml2js').parseString;
var db              = require('mongoskin').db('mongodb://localhost:27017/wasabi');
var dbpediaHandler  = require('./handler/dbpediaHandler.js');
var infos_artist    = require('./sparql_request/infos_artist.js');
var infos_album     = require('./sparql_request/infos_album.js');
var infos_song     = require('./sparql_request/infos_song.js');
var construct_endpoint = require('./sparql_request/construct_endpoint.js');
var ObjectId        = require('mongoskin').ObjectID;

router.get('/artist',function(req, res){

    var limit = 5000;
    var loop = true;
    //extraire l'url de wikipedia de objArtist.urlWikipedia 
    console.log("test");
    (function getRequestArtistLoop(loop){
        if(loop){
            db.collection('artist').find({$and:[{urlWikipedia:{$ne:""}},{rdf:{$exists:false}}]},{_id:1,urlWikipedia:1}).limit(limit).toArray(function(err,tObjArtist){
//            db.collection('artist').find({urlWikipedia:/^http:\/\/en.wikipedia.org\/wiki\/[a-z]{2}:/},{_id:1,urlWikipedia:1}).limit(limit).toArray(function(err,tObjArtist){

//                 db.collection('artist').find({name:"Karim Fall"},{_id:1,urlWikipedia:1}).limit(limit).toArray(function(err,tObjArtist){
                //il y a moins d'artist que la limit donc on arrive à la fin
               
                if(tObjArtist.length <limit){ loop = false; }
                var i=0;
                (function tObjArtistLoop(i){
                    var objArtist = tObjArtist[i];                    
                    //permet d'extraire le pays et l'url de l'artist, retourn objUrl avec pour propriété : urlDbpedia et country
                    var objUrl= dbpediaHandler.extractInfosFromURL(objArtist.urlWikipedia,"http://en.wikipedia.org/wiki/");
                    var sparql_request = infos_artist.construct_request(objUrl.urlDbpedia,objUrl.country);
                    var urlEndpoint = construct_endpoint.construct_endpoint(objUrl.country);
                    console.log("\n\nTraitement de l'artiste => "+objUrl.urlDbpedia+" ...");
                    dbpediaHandler.getInfosDbpedia(objArtist,sparql_request,urlEndpoint).then(function(objArtist){
                        var rdfValue = objArtist.rdf.replace(/\n|\t/g," ").replace(/\"/g,"'");
                        db.collection('artist').update({_id : new ObjectId(objArtist._id)}, { $set: {"rdf": rdfValue} });
                        if(rdfValue<200){
                            console.log("!!!!!!!!!!!!!!!!!!!!! RDF VIDE !!!!!!!!!!!!!!!!!!!!!");
                        }
                        console.log("RDF Added => "+objArtist.urlWikipedia);
                        if(i < tObjArtist.length-1){
                            i++;
                            setTimeout(function(){ tObjArtistLoop(i); }, Math.floor((Math.random() * 100)+200));
                        }
                        else{
                            console.log("===========================NEXT LIMIT : getRequestArtistLoop = "+loop+"===========================");
                            getRequestArtistLoop(loop);
                        }
                    });
                })(i);
            });
        }
    })(loop);
    res.send("OK");
});

router.get('/artist/createfields',function(req, res){
//        db.collection('artist').find({$and:[{rdf:{$ne:""}},{rdf:{$exists:true}}]},{_id:1,urlWikipedia:1}).limit(limit).toArray(function(err,tObjArtist){
        db.collection('artist').find({rdf:{$exists:true}},{rdf:1,formerMembers:1,members:1,urlWikipedia:1}).limit(5).toArray(function(err,tObjArtist){
            for(var i = 0; i<tObjArtist.length;i++){

                var objUrl= dbpediaHandler.extractInfosFromURL();
                
                
//                console.log(tObjArtist[i]);
                var xml = tObjArtist[i].rdf;
                parseString(xml, function (err, result) {
                    if(result !=null){
//                        findObjectByLabel(result,'rdf:RDF');
                            console.log(result['rdf:RDF']['rdf:Description']['$']['dbo:birthDate']);
//                            console.log(JSON.stringify(result['rdf:RDF']));
                            console.log("\n\n\n\n");

                    }
                });
            }
//            db.collection('artist').update({_id : new ObjectId(objArtist._id)}, { $set: {"rdf": rdfValue} });
        });


});

router.get('/album',function(req, res){
    var limit = 5000;
    var loop = true;
    //extraire l'url de wikipedia de objAlbum.urlWikipedia 
    (function getRequestAlbumLoop(loop){
        if(loop){
            db.collection('album').find({$and:[{urlWikipedia:{$ne:""}},{rdf:{$exists:false}}]},{_id:1,urlWikipedia:1}).limit(limit).toArray(function(err,tObjAlbum){
//            db.collection('album').find({titre:"Iron Maiden"}).limit(limit).toArray(function(err,tObjAlbum){
                //il y a moins d'album que la limit donc on arrive à la fin
                console.log("test 1");
                if(tObjAlbum.length <limit){
                    loop = false;
                }
                var i=0;
                (function tObjAlbumLoop(i){
                    var objAlbum = tObjAlbum[i];
                    var objUrl= dbpediaHandler.extractInfosFromURL(objAlbum.urlWikipedia,"http://en.wikipedia.org/wiki/");
                    
                    var sparql_request = infos_album.construct_request(objUrl.urlDbpedia,objUrl.country);
                    var urlEndpoint = construct_endpoint.construct_endpoint(objUrl.country);
                    console.log("\n\nTraitement de l'album => "+objUrl.urlDbpedia+" ...");
                    dbpediaHandler.getInfosDbpedia(objAlbum,sparql_request,urlEndpoint).then(function(objAlbum){
                        var rdfValue= objAlbum.rdf.replace(/\n|\t/g," ").replace(/\"/g,"'");
                        db.collection('album').update({_id : new ObjectId(objAlbum._id)}, { $set: {"rdf": rdfValue} });
                        if(rdfValue<200){ console.log("!!!!!!!!!!!!!!!!!!!!! RDF VIDE !!!!!!!!!!!!!!!!!!!!!");}
                        console.log("RDF Added => "+objAlbum.urlWikipedia);
                        if(i < tObjAlbum.length-1){
                            i++;
                            setTimeout(function(){  tObjAlbumLoop(i); }, Math.floor((Math.random() * 100)+100));
                        }
                        else{
                            console.log("===========================NEXT LIMIT : getRequestAlbumLoop = "+loop+"===========================");
                            getRequestAlbumLoop(loop);
                        }
                    });
                })(i);
           
            });
        }
    })(loop);
    res.send("OK");
});

router.get('/song',function(req, res){

    var limit = 5000;
    var loop = true;
    //extraire l'url de wikipedia de objSong.urlWikipedia 
    (function getRequestSongLoop(loop){
        if(loop){
            db.collection('song').find({$and:[{urlWikipedia:{$ne:""}},{rdf:{$exists:false}}]},{_id:1,urlWikipedia:1}).limit(limit).toArray(function(err,tObjSong){
//            db.collection('song').find({name:"A Challenge Of Honour"},{_id:1,urlWikipedia:1}).limit(limit).toArray(function(err,tObjSong){
                //il y a moins de musique que la limit donc on arrive à la fin
                if(tObjSong.length <limit){
                    loop = false;
                }
                var i=0;
                (function tObjSongLoop(i){
                    var objSong = tObjSong[i];
                    var objUrl= dbpediaHandler.extractInfosFromURL(objSong.urlWikipedia,"http://en.wikipedia.org/wiki/");
                    
                    var sparql_request = infos_song.construct_request(objUrl.urlDbpedia,objUrl.country);
                    var urlEndpoint = construct_endpoint.construct_endpoint(objUrl.country);
                    console.log("\n\nTraitement de l'album => "+objUrl.urlDbpedia+" ...");
                    dbpediaHandler.getInfosDbpedia(objSong,sparql_request,urlEndpoint).then(function(objSong){
                        var rdfValue= objSong.rdf.replace(/\n|\t/g," ").replace(/\"/g,"'");
                        db.collection('song').update({_id : new ObjectId(objSong._id)}, { $set: {"rdf": rdfValue} });
                        if(rdfValue<200){ console.log("!!!!!!!!!!!!!!!!!!!!! RDF VIDE !!!!!!!!!!!!!!!!!!!!!");}
                        console.log("RDF Added => "+objSong.urlWikipedia);
                        if(i < tObjSong.length-1){
                            i++;
                            setTimeout(function(){  tObjSongLoop(i); }, Math.floor((Math.random() * 100)+200));
                        }
                        else{
                            console.log("===========================NEXT LIMIT : getRequestSongLoop = "+loop+"===========================");
                            getRequestSongLoop(loop);
                        }
                    });
                })(i);
           
            });
        }
    })(loop);
    res.send("OK");
});

module.exports = router;



