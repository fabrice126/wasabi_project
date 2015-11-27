var express         = require('express');
var router          = express.Router();
var path            = require('path');
var url             = require('url');
var fs              = require('fs');
//fichier de configuation
var conf            = require('./conf/conf.json');
var lyricsWikia     = require('./handler/lyricsWikia.js');
var glob            = require('glob-all');


/* GET home page. */

router.get('/', function (req, res) {
    res.setHeader('Content-Type', conf.http.mime.html);
    res.render('index');
});
router.get('/search', function (req, res) {
    var categorie = req.query.categorie;
    var lettre = req.query.lettre;
    categorie = categorie.toLowerCase();
    var pathDir;
    var files;
    switch(categorie) {
        case "artist":
                pathDir = path.join(__dirname, '../public/'+categorie+'/'+lettre+'**');
                files = glob.sync([pathDir]);
                var artistName = [];
                var position;
                for(var i = 0 ;i<files.length;i++){
                    position = files[i].lastIndexOf("/");
                    artistName.push(files[i].substring(position+1,files[i].length));
                }
                res.render('index', { files: artistName });
            break;
        //ajouter un default
    }
});

//Nous permet de créer une première arborescence en récupérerant toutes les lyrics d'un abum et tous les album d'un groupe
//Si une arborescence est déja crée cette fonction doit être désactivé
router.get('/chercherLyricsWikia',function(req, res){
    console.log("dedans /chercherLyricsWikia");
    //req doit contenir le confidence,
    //Pour chaque lettre  sur wikia et chaque catégorie on récupére pour commencer les albums de 5 artistes ainsi que tous ses albums et musiques
    var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    //
    //les lyrics des albums de 10 artistes commencant par la lettre A
    //contient les liens des artistes de tout l'alphabet
    var tabIndexArtist;
    var dirArtist = path.join(__dirname+conf.http.public+'artist');
    var selector = '#mw-pages>.mw-content-ltr>table a[href]';
    var url = 'http://lyrics.wikia.com/wiki/Category:Artists_';
    var attr = 'href';//on récupérera dans allLinks les href du selector ci-dessus afin de créer les répertoires
    var removeStrHref = '/wiki/';
    //creation de la promise
    //for(var i = 0, len = alphabet.length;i<len;i++){
            lyricsWikia.getArtistFromCategorie(url+alphabet[18],selector,attr).then(function(valtLinks) {
            tabIndexArtist = lyricsWikia.createDirArtist(dirArtist,valtLinks,removeStrHref,true);
            /*for(var j = 0 ;j<tabIndexArtist.length;j++){
                console.log("tabIndexArtist = "+tabIndexArtist[j]);
            }*/
            lyricsWikia.writeArtistFileIndex(path.join(__dirname+conf.http.public),"indexArtist.txt",tabIndexArtist);

            //au clic sur href /artist/B.W.B. on ira chercher en BDD B.W.B
            //a mettre dans un autre then car le dossier dirArtist doit être crée lyricsWikia.writeArtistFileIndex(dirArtist,tabIndexArtist);
            //Une fois les dossiers crées il faut récupérer les albums des groupes ainsi que leur musique :
            //http://lyrics.wikia.com/api.php?func=getArtist&artist=Linkin_Park&fmt=html

            
        }).catch(function() { 
            console.log("error Fin asynchrone");
        });
        //lyricsWikia.getLyricsFromWikiaPageURL("http://lyrics.wikia.com/wiki/Category:Artists_"+ alphabet[0]);
    //}
});

module.exports = router;
