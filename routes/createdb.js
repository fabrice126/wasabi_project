var express         = require('express');
var router          = express.Router();
var db              = require('mongoskin').db('mongodb://localhost:27017/wasabi');
var lyricsWikia     = require('./handler/lyricsWikia.js');




//Nous permet de créer une première arborescence en récupérerant toutes les lyrics d'un abum et tous les album d'un groupe
router.get('/',function(req, res){
    console.log("dedans /createdb");
    //req doit contenir le confidence,
    //Pour chaque lettre  sur wikia et chaque catégorie on récupére pour commencer les albums de 5 artistes ainsi que tous ses albums et musiques
    var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    //les lyrics des albums de 10 artistes commencant par la lettre A
    //contient les liens des artistes de tout l'alphabet qui sont aussi les noms des répertoires sur le disque
    var urlArtists = 'http://lyrics.wikia.com/wiki/Category:Artists_';
    var selectorArtists = '#mw-pages>.mw-content-ltr>table a[href]';
    var attrArtists = 'href';//on récupérera dans allLinks les href du selector ci-dessus afin de créer les répertoires
    var removeStrHrefArtists = '/wiki/';
    
    var urlAlbums = 'http://lyrics.wikia.com/api.php?func=getArtist&artist=';
    var selectorAlbums = '.albums>li>a[href]:first-child';
    var attrAlbums = 'href';
    var removeStrHrefAlbums = 'http://lyrics.wikia.com/';
    //on supprime la collection artist de la base de données pour la recréer
    db.collection('artist').drop();
    for(var i = 0, len = alphabet.length;i<len;i++){
        lyricsWikia.getArtistFromCategorie(urlArtists+alphabet[i],selectorArtists,attrArtists,removeStrHrefArtists).then(function(valtLinks) {
            //valtLinks => liste des noms d'artistes
            console.log("Dans promise de GET createdb");
            //lyricsWikia.createDirArtit(dirArtists,valtLinks);
            for(var j = 0;j < valtLinks.length ;j++){
                lyricsWikia.getAlbumsFromArtists(urlAlbums,selectorAlbums,attrAlbums,removeStrHrefAlbums,valtLinks[j]).then(function(objArtist){
                    db.collection('artist').insert(objArtist, function(err, result) {
                        if (err) throw err;
                        if (result) console.log('Added =>'+objArtist.name);
                    });
                });
            }
            console.log("fin de GET createdb");
            //db.collection('artist').createIndex( { "albums.songs": 1 } );
        }).catch(function() { 
            console.log("error Fin asynchrone");
        });
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ status: "OK" }));
    res.end();
});

module.exports = router;