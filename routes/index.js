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
    res.render('index',{categorieFile:[]});//on initialise categorieFile avec un tableau vide
});

router.get('/search', function (req, res) {
    var categorie = req.query.categorie;
    var lettre = req.query.lettre;
    categorie = categorie.toLowerCase();
    var pathDir;
    var files;
    switch(categorie) {
        case "artist":
                getCategorieByLetter(res,'index',categorie,'../public/'+categorie+'/'+lettre+'**');
            break;
        case "album":
                getCategorieByLetter(res,'index',categorie,'../public/**/'+lettre+'**');
            break;
        case "songs":
                getCategorieByLetter(res,'index',categorie,'../public/**/**/'+lettre+'**');
            break;
        //ajouter un default
    }
});

router.get('/artist/*', function (req, res) {
    //Chercher le dossier req.url pour y trouver les albums
    console.log("url = "+req.url);
    res.render('albumArtist', { albumFile: albumFile });

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
    var tabDirArtists;
    var dirArtists = path.join(__dirname+conf.http.public+'artist');
    var urlArtists = 'http://lyrics.wikia.com/wiki/Category:Artists_';
    var selectorArtists = '#mw-pages>.mw-content-ltr>table a[href]';
    var attrArtists = 'href';//on récupérera dans allLinks les href du selector ci-dessus afin de créer les répertoires
    var removeStrHrefArtists = '/wiki/';
    
    var urlAlbums = 'http://lyrics.wikia.com/api.php?func=getArtist&artist=';
    var selectorAlbums = '.albums>li>a[href]:first-child';
    var attrAlbums = 'href';
    var removeStrHrefAlbums = 'http://lyrics.wikia.com/';

    //creation de la promise
    for(var i = 0, len = alphabet.length;i<len;i++){
        lyricsWikia.getArtistFromCategorie(urlArtists+alphabet[i],selectorArtists,attrArtists,removeStrHrefArtists).then(function(valtLinks) {
            //valtLinks => liste des noms d'artistes
            lyricsWikia.createDirArtist(dirArtists,valtLinks);
            console.log("createDirArtist "+alphabet[i]);
            for(var j = 0;j<valtLinks.length;j++){
                //console.log("myVal = "+valtLinks[j]);
                lyricsWikia.getAlbumsFromArtists(urlAlbums,selectorAlbums,attrAlbums,removeStrHrefAlbums,dirArtists,valtLinks[j]);
            }      
        }).catch(function() { 
            console.log("error Fin asynchrone");
        });
    }
});


function getCategorieByLetter(res,renderPage,nomCategorie,pattern){
    pathDir = path.join(__dirname, pattern);
    var categorieFile = [];
    console.log("pathDir = "+pathDir);
    files = glob.sync([pathDir]);
    var position;
    for(var i = 0 ;i<files.length;i++){
        position = files[i].lastIndexOf("/");
        categorieFile.push(files[i].substring(position+1,files[i].length));
    }
    console.log("test2");
    //new EJS({url: '../views/index.ejs'}).update(document.querySelector('#articleMainContent_listCategorie'), { categorieFile: categorieFile,nomCategorie:nomCategorie});
    res.render(renderPage, { categorieFile: categorieFile,nomCategorie:nomCategorie });
}

module.exports = router;
