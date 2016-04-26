var express         = require('express');
var router          = express.Router();
var db              = require('mongoskin').db('mongodb://localhost:27017/wasabi');
var dbpediaHandler  = require('./handler/dbpediaHandler.js');
var infos_artist    = require('./sparql_request/infos_artist.js');
var ObjectId        = require('mongoskin').ObjectID;

router.get('/artist',function(req, res){

    var limit = 5000;
    var loop = true;
    //extraire l'url de wikipedia de objArtist.urlWikipedia 
    (function getRequestArtistLoop(loop){
        if(loop){
            db.collection('artist').find({$and:[{urlWikipedia:{$ne:""}},{rdf:{$exists:false}}]},{_id:1,urlWikipedia:1}).limit(limit).toArray(function(err,tObjArtist){
//            db.collection('artist').find({name:"A Challenge Of Honour"},{_id:1,urlWikipedia:1}).limit(limit).toArray(function(err,tObjArtist){
                //il y a moins d'artist que la limit donc on arrive à la fin
                if(tObjArtist.length <limit){
                    loop = false;
                }
                var i=0;
                (function tObjArtistLoop(i){
                    var objArtist = tObjArtist[i];
                    //toutes nos urlWikipedia commence par : http://en.wikipedia.org/wiki/
                    var url = objArtist.urlWikipedia.split("http://en.wikipedia.org/wiki/");
                    //certaine url sont de type : de:Adoro avec "de:" désignant le wikipedia allemand, il faut donc faire la redirection sur dbpedia
                    var country = '';
                    var urlDbpedia = '';
                    //Si url[1] de forme: "it:Adriano_Celentano"
                    if(/^[a-z]{2}:/.test(url[1])){
                        //On obtient le tableau suivant :urlDetail = ["it","Adriano_Celentano"]
                        var urlDetail  = url[1].split(":");
                        urlDbpedia = urlDetail[1];
                        country = urlDetail[0]+".";
                    }
                    else{
                        urlDbpedia = url[1];
                    }
                    console.log("country    = "+country);
                    console.log("urlDbpedia = "+urlDbpedia);
                    var sparql_request = infos_artist.construct_request(urlDbpedia,country);
                    var urlEndpoint = infos_artist.construct_endpoint(country);
                    dbpediaHandler.getArtistInfosDbpedia(objArtist,sparql_request,urlEndpoint).then(function(objArtist){
                        var rdfValue= objArtist.rdf.replace(/\n|\t/g," ").replace(/\"/g,"'");
                        db.collection('artist').update({_id : new ObjectId(objArtist._id)}, { $set: {"rdf": rdfValue} });
                        console.log("RDF Added => "+objArtist.urlWikipedia);
                        if(i < tObjArtist.length-1){
                            i++;
                            setTimeout(function(){ 
                                tObjArtistLoop(i);           
                            }, Math.floor((Math.random() * 200)+400));
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

router.get('/artist/decode',function(req, res){

    infos_artist.decode_request;
    res.send("OK");
});



//router.get('/album',function(req, res){
//        db.collection('album').find({urlWikipedia:{$ne:""}});
//
//        dbpediaHandler.getAlbumInfosDbpedia(objArtist,sparqlRequest);
//});
//router.get('/song',function(req, res){
//        db.collection('song').find({urlWikipedia:{$ne:""}});
//
//        dbpediaHandler.getSongInfosDbpedia(objArtist,sparqlRequest);
//});
module.exports = router;



