var express         = require('express');
var router          = express.Router();
var request         = require('request');
var lyricsWikia     = require('./handler/lyricsWikia.js');


//createdb, permet de créer entierement la base de données
router.get('/',function(req, res){
    console.log("dedans /createdb");
    //Pour chaque lettre  sur wikia et chaque catégorie on récupére pour commencer les albums de 5 artistes ainsi que tous ses albums et musiques
    //pour chaque categorie ex: http://lyrics.wikia.com/wiki/Category:Artists_A on récupére les artistes ici les artistes commencant par la lettre A
    lyricsWikia.fetchData(lyricsWikia.urlArtists,lyricsWikia.alphabet[lyricsWikia.idxAlphabet],lyricsWikia.paramNextPage,lyricsWikia.selectorArtists,lyricsWikia.attrArtists,lyricsWikia.removeStrHrefArtists);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ status: "OK" }));
    res.end();
});

//Permet d'ajouter la discographie d'un artiste manquant dans notre base de données en allant la chercher sur lyrics wikia
router.get('/add/:urlArtist',function(req, res){
    var newLyricsWikia = lyricsWikia;
    var urlApiWikiaArtist = newLyricsWikia.urlApiWikia + req.params.urlArtist
    console.log("dedans /createdb/"+ req.params.urlArtist);
    var objArtist = {
            name:"",
            urlWikipedia:"",
            urlOfficialWebsite : "",
            urlFacebook:"",
            urlMySpace:"",
            urlTwitter:"",
            urlWikia: req.params.urlArtist, 
            activeYears:"",
            members:[],
            formerMembers:[],
            locationInfo:[],
            genres:[],
            labels:[],
            albums:[]
        };
    newLyricsWikia.idxAlphabet = newLyricsWikia.alphabet.length;
    newLyricsWikia.getOneArtist(urlApiWikiaArtist, objArtist,newLyricsWikia.selectorName, newLyricsWikia.selectorAlbums, newLyricsWikia.attrAlbums).then(function(objArtist) {
        //objArtist.tObjArtist => tableau d'objet représentant les artists: [{ name: 'A Dying God', urlWikia: 'A_Dying_God', albums: [] },{objet2}, etc]
        console.log("objArtist.tObjArtist.length  ==="+objArtist.tObjArtist.length );
        newLyricsWikia.getArtistDiscography(objArtist,"","",0);
        console.log("fin de GET createdb");
    })
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ status: "OK" }));
    res.end();
});


router.get('/createdbelasticsearchsong', function(req, res){
    var elasticsearchClient = req.elasticsearchClient;
    var db = req.db;
    var skip = 0;
    var limit = 10000;
    (function recursivePost(skip){
        console.log("createdbelasticsearch 1 ="+ skip);
        db.collection('song').find({},{"titre":1,"name":1,"albumTitre":1}).skip(skip).limit(limit).toArray(function(err,songs){
            var bulk_request = [];
            for (var i = 0; i < songs.length; i++) {
                var id = songs[i]._id;
                delete songs[i]._id;
                // Insert index
                bulk_request.push({index: {_index: 'idx_songs', _type: 'string',_id:id}});
                // Insert data
                bulk_request.push(songs[i]);    
            }
            elasticsearchClient.bulk({body : bulk_request}, function (err, resp) {
                if(err) {console.log(err);}
            });
            skip+= limit;
            if(songs.length !=limit){
                console.log("FIN DU TRAITEMENT !");
                return ;
            }
            recursivePost(skip);
        });
    })(skip)
    res.send("OK");
});
router.get('/createdbelasticsearchartist', function(req, res){
    var elasticsearchClient = req.elasticsearchClient;
    var db = req.db;
    var skip = 0;
    var limit = 10000;
    (function recursivePost(skip){
        console.log("createdbelasticsearch 1 ="+ skip);
        db.collection('artist').find({},{"name":1}).skip(skip).limit(limit).toArray(function(err,artists){
            var bulk_request = [];
            for (var i = 0; i < artists.length; i++) {
                var id = artists[i]._id;
                delete artists[i]._id;
                // Insert index
                bulk_request.push({index: {_index: 'idx_artists', _type: 'string',_id:id}});
                // Insert data
                bulk_request.push(artists[i]);    
            }
            elasticsearchClient.bulk({body : bulk_request}, function (err, resp) {
                if(err) {console.log(err);}
            });
            skip+= limit;
            if(artists.length !=limit){
                console.log("FIN DU TRAITEMENT !");
                return ;
            }
            recursivePost(skip);
        });
    })(skip)
    res.send("OK");
});
router.get('*', function(req, res){
    //On renvoie index.html qui ira match l'url via <app-router> de index.html ce qui renverra la page 404 si la page n'existe pas
    res.sendFile(path.join(__dirname ,'public',  'index.html'));
});

module.exports = router;