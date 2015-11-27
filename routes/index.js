var express         = require('express');
var router          = express.Router();
var path            = require('path');
var url             = require('url');
var fs              = require('fs');
var glob            = require('glob-all');
//fichier de configuation
var conf            = require('./conf/conf.json');
var lyricsWikia     = require('./handler/lyricsWikia.js');


/* GET home page. */

router.get('/', function (req, res) {
    res.setHeader('Content-Type', conf.http.mime.html);
    console.log("test");
    res.render('index',{artistNames:[]});//on initialise artistNames avec un tableau vide
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
                var artistNames = [];
                var position;
                for(var i = 0 ;i<files.length;i++){
                    position = files[i].lastIndexOf("/");
                    artistNames.push(files[i].substring(position+1,files[i].length));
                }
                console.log("test2");
                //new EJS({url: '../views/includes/listCategorie.ejs'}).update(document.querySelector('#articleMainContent_listCategorie_column1'), { artistNames: artistNames });
                res.render('index', { artistNames: artistNames });
            break;
        //ajouter un default
    }
});

router.get('/artist/*', function (req, res) {
    //Chercher le dossier req.url pour y trouver les albums
    console.log("url = "+req.url);
    res.render('index', { artistName: artistName });

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
    //contient les liens des artistes de tout l'alphabet qui sont aussi les noms des répertoires sur le disque
    var tabDirArtist;
    var dirArtist = path.join(__dirname+conf.http.public+'artist');
    var selector = '#mw-pages>.mw-content-ltr>table a[href]';
    var url = 'http://lyrics.wikia.com/wiki/Category:Artists_';
    var attr = 'href';//on récupérera dans allLinks les href du selector ci-dessus afin de créer les répertoires
    var removeStrHref = '/wiki/';
    //creation de la promise
    //for(var i = 0, len = alphabet.length;i<len;i++){
            lyricsWikia.getArtistFromCategorie(url+alphabet[14],selector,attr).then(function(valtLinks) {
            tabDirArtist = lyricsWikia.createDirArtist(dirArtist,valtLinks,removeStrHref,true);
            /*for(var j = 0 ;j<tabDirArtist.length;j++){
                console.log("tabDirArtist = "+tabDirArtist[j]);
            }*/
            lyricsWikia.getAlbumsFromArtists(tabDirArtist);
            //http://lyrics.wikia.com/api.php?func=getArtist&artist=Linkin_Park&fmt=json$

            JSON.parse();
            //au clic sur href /artist/B.W.B. on ira chercher en BDD B.W.B
            //Une fois les dossiers crées il faut récupérer les albums des groupes ainsi que leur musique :
            //http://lyrics.wikia.com/api.php?func=getArtist&artist=Linkin_Park&fmt=html
                

            
        }).catch(function() { 
            console.log("error Fin asynchrone");
        });
        //lyricsWikia.getLyricsFromWikiaPageURL("http://lyrics.wikia.com/wiki/Category:Artists_"+ alphabet[0]);
    //}
});

module.exports = router;
