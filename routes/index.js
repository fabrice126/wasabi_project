var express         = require('express');
var router          = express.Router();
var path            = require('path');
var url             = require('url');
var fs              = require('fs');
var glob            = require('glob-all'); 
var db              = require('mongoskin').db('mongodb://localhost:27017/wasabi');
var lyricsWikia     = require('./handler/lyricsWikia.js');
//fichier de configuation
var conf            = require('./conf/conf.json');



/* GET home page. */

//router.get('/', function (req, res) {
//    res.setHeader('Content-Type', conf.http.mime.html);
//    console.log("test");
//    res.render('index',{categorieFile:[],displayCategorie:true });//on initialise categorieFile avec un tableau vide
//});

router.get('/search', function (req, res) {
    var lettre = req.query.lettre;
    var nomCategorie = req.query.categorie.toLowerCase();
    var categorieFile = [];
    var renderPage = 'includes/listCategorie';
    switch(nomCategorie) {
        case "artist":
                /*
                db.artist.distinct('albums.titre'); 
                        ou  
                db.runCommand({
                  distinct: 'artist',
                  key: 'albums.titre'
                });
                */
                categorieFile= getDataByPattern('../public/'+nomCategorie+'/'+lettre+'**');
            break;
        case "album":
                categorieFile = getDataByPattern('../public/**/'+lettre+'**');
            break;
        case "songs":
                categorieFile = getDataByPattern('../public/**/**/'+lettre+'**');
            break;
        default:
     
            break;
    }
    //res.render(renderPage, { categorieFile: categorieFile,nomCategorie:nomCategorie,displayCategorie:true });

    res.render(renderPage,{ categorieFile: categorieFile,nomCategorie:nomCategorie});
});

router.get('/artist/*', function (req, res) {
    //Chercher le dossier req.url pour y trouver les albums
    console.log("url = "+req.url);
    getDataByPattern(res, 'index','artist');
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
    //on supprime la collection artist de la base de données pour la recréer
    db.collection('artist').drop();
    for(var i = 0, len = alphabet.length;i<len;i++){
        lyricsWikia.getArtistFromCategorie(urlArtists+alphabet[i],selectorArtists,attrArtists,removeStrHrefArtists).then(function(valtLinks) {
            //valtLinks => liste des noms d'artistes
            console.log("Dans promise de GET chercherLyricsWikia");
            //lyricsWikia.createDirArtit(dirArtists,valtLinks);
            for(var j = 0;j < valtLinks.length ;j++){
                lyricsWikia.getAlbumsFromArtists(urlAlbums,selectorAlbums,attrAlbums,removeStrHrefAlbums,valtLinks[j]).then(function(objArtist){
                    db.collection('artist').insert(objArtist, function(err, result) {
                        if (err) throw err;
                        if (result) console.log('Added!');
                    });
                });
            }
            db.collection('artist').createIndex( { "albums.songs": 1 } );
        }).catch(function() { 
            console.log("error Fin asynchrone");
        });
    }
    console.log("fin de GET chercherLyricsWikia");
});
//Lorsque l'utilisateur clique sur un lien cette fonction est appelé elle permet de récupérer ce qui est contenu dans le dossier artist
function getDataByPattern(pattern){
    var pathDir = path.join(__dirname, pattern);
    var categorieFile = [];
    var files = glob.sync([pathDir]);
    var position;
    for(var i = 0 ;i<files.length;i++){
        position = files[i].lastIndexOf("/");
        categorieFile.push(files[i].substring(position+1,files[i].length));
    }
    return categorieFile;
    //new EJS({url: '../views/index.ejs'}).update(document.querySelector('#articleMainContent_listCategorie'), { categorieFile: categorieFile,nomCategorie:nomCategorie});
}

module.exports = router;
