var express         = require('express');
var router          = express.Router();
var db              = require('mongoskin').db('mongodb://localhost:27017/wasabi');
var dbpediaHandler  = require('./handler/dbpediaHandler.js');
var infos_artist    = require('./sparql_request/infos_artist.js');

router.get('/artist',function(req, res){

    //Requête mongo db cherchant les urlWikipedia non equal a ""
    //db.collection('artist').find({urlWikipedia:{$ne:""}}.toArray(function(err, artists) {
//        console.log(artists[0].urlWikipedia);
//    });
    //extraire l'url de wikipedia de objArtist.urlWikipedia
    db.collection('artist').findOne({name:"Iron Maiden"}, function(err, objArtist) {
        console.log(objArtist.urlWikipedia);
        //toutes nos urlWikipedia commence par : http://en.wikipedia.org/wiki/
        var url = objArtist.urlWikipedia.split("http://en.wikipedia.org/wiki/");
        var sparql_request = infos_artist.construct_request(url[1]);
        dbpediaHandler.getArtistInfosDbpedia(objArtist,sparql_request).then(function(objArtist){
            console.log(objArtist);
        });
    });

    res.send("OK");
});

router.get('/album',function(req, res){
        db.collection('album').find({urlWikipedia:{$ne:""}});

        dbpediaHandler.getAlbumInfosDbpedia(objArtist,sparqlRequest);
});
router.get('/song',function(req, res){
        db.collection('song').find({urlWikipedia:{$ne:""}});

        dbpediaHandler.getSongInfosDbpedia(objArtist,sparqlRequest);
});
module.exports = router;



