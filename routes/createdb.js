var express         = require('express');
var router          = express.Router();
var db              = require('mongoskin').db('mongodb://localhost:27017/wasabi');
var lyricsWikia     = require('./handler/lyricsWikia.js');




        
var paramNextPage = "?pagefrom=Banda Estrellas De Sinaloa De German Lizarraga";
//les lyrics des albums de 10 artistes commencant par la lettre A
//contient les liens des artistes de tout l'alphabet qui sont aussi les noms des répertoires sur le disque
var urlArtists = 'http://lyrics.wikia.com/wiki/Category:Artists_';
var selectorArtists = '#mw-pages>.mw-content-ltr>table a[href]';
var attrArtists = 'href';//on récupérera dans allLinks les href du selector ci-dessus afin de créer les répertoires
var removeStrHrefArtists = '/wiki/';

//http://lyrics.wikia.com/wiki/AC/DC
var urlPageArtist = "http://lyrics.wikia.com/wiki/";

var urlAlbums = 'http://lyrics.wikia.com/api.php?func=getArtist&artist=';
var selectorAlbums = '.albums>li>a[href]:first-child';
var attrAlbums = 'href';
var urlLyrics = 'http://lyrics.wikia.com/api.php?func=getArtist&artist=';
var selectorLyrics = 'div.lyricbox';
var countArtist =0;       
//Nous permet de créer une première arborescence en récupérerant toutes les lyrics d'un abum et tous les album d'un groupe

router.get('/',function(req, res){
    console.log("dedans /createdb");
    //Pour chaque lettre  sur wikia et chaque catégorie on récupére pour commencer les albums de 5 artistes ainsi que tous ses albums et musiques
    var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    //pour chaque categorie ex: http://lyrics.wikia.com/wiki/Category:Artists_A on récupére les artistes ici les artistes commencant par la lettre A
//    for(var i = 0, len = alphabet.length;i<len;i++){
        fetchData(urlArtists,alphabet[1],paramNextPage,selectorArtists,attrArtists,removeStrHrefArtists);
    //}
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ status: "OK" }));
    res.end();
});

var fetchData = function(url,lettre,paramNextPage,selectorArtists,attrArtists,removeStrHrefArtists){
    //Quand les artistes commencant par A sont récupérés (la requete ajax terminée) on entre dans le then
    lyricsWikia.getArtistFromCategorie(url+lettre+paramNextPage,selectorArtists,attrArtists,removeStrHrefArtists).then(function(objArtist) {
        //objArtist.tObjArtist => tableau d'objet représentant les artists: [{ name: 'A Dying God', urlWikia: 'A_Dying_God', albums: [] },{objet2}, etc]
        console.log("objArtist.tObjArtist.length  ==="+objArtist.tObjArtist.length );
        var j=0;
        setIntervalLoop(objArtist,url,lettre,j);
        console.log("fin de GET createdb");
        //db.collection('artist').createIndex( { "albums.songs": 1 } );
    }).catch(function() { 
        console.log("error Fin asynchrone");
    });
};

var setIntervalLoop = function(newObjArtist,url,lettre,j){
    //On récupére les albums (musiques incluses) des artistes commencant par la lettre A
    //Seul facon de faire pour simuler une boucle avec un timeout a chaque tour (settimout ne fonctionne pas dans une boucle) on appel donc cette fonction récusivement
    setTimeout(function(){
        console.log("En cours : "+newObjArtist.tObjArtist[j].name);
        lyricsWikia.getAlbumsAndSongsOfArtist(urlAlbums,selectorAlbums,attrAlbums,newObjArtist.tObjArtist[j]).then(function(objArtist){
            //lorsque la requete ajax pour récupérer les artistes est terminé on obtient un objet (voir ci-dessous la structure json)
            //Nous allons maintenant ajouter dans chaque objet représentant l'artiste, les paroles des musiques
            lyricsWikia.getInfosFromPageArtist(urlPageArtist,objArtist).then(function(objArtist){
                lyricsWikia.getAllLyricsOfArtists(urlLyrics,selectorLyrics,objArtist).then(function(objArtist){
                    //Quand on a traiter complétement une page d'artiste => albums avec ses musiques insérés en base de données, on passe a la page suivante
                    db.collection('artist').insert(objArtist, function(err, result) {
                        if (err) throw err;
                        if (result) {
                            console.log('Added =>'+objArtist.name);
                        }

                        if(j < newObjArtist.tObjArtist.length-1){
                            j++;
                            console.log("j == "+j+" newObjArtist.tObjArtist.length == "+newObjArtist.tObjArtist.length+" newObjArtist.nextPage =="+newObjArtist.nextPage+" \n\n");
                            setIntervalLoop(newObjArtist,url,lettre,j);
                        }
                        else{
                            console.log("================== NEXT PAGE ================== \n\n\n\n")
                            if(newObjArtist.nextPage){
                                fetchData(url,lettre,"?pagefrom="+newObjArtist.artistPageFrom,selectorArtists,attrArtists,removeStrHrefArtists);
                            }
                        }
                    }); 
                });
            }); 
        });

    }, Math.floor((Math.random() * 1500) + 300));
};

//{
//    "name" : "A Dead Silence",
//    "urlWikia" : "A_Dead_Silence",
//     +Autres infos de l'artiste, 
//    "albums" : [ 
//        {
//            "titre" : "Catharsis",
//            "dateSortie" : "2012",
//            "urlAlbum" : "http://lyrics.wikia.com/A_Dead_Silence:Catharsis_%282012%29",
//            "songs" : [ 
//                {
//                    "titre" : "Calling Forth The Waves",
//                    "urlSong" : "http://lyrics.wikia.com/A_Dead_Silence:Calling_Forth_The_Waves",
//                    "lyrics" : "",
//                }, 
//                {
//                    "titre" : "Modern Transfigurement",
//                    "urlSong" : "http://lyrics.wikia.com/A_Dead_Silence:Modern_Transfigurement",
//                    "lyrics" : ""
//                }
//            ]
//        }, 
//        {
//            "titre" : "Other Songs",
//            "dateSortie" : "",
//            "urlAlbum" : "http://lyrics.wikia.com/A_Dead_Silence:Other_Songs",
//            "songs" : [ 
//                {
//                    "titre" : "Heavy Mind",
//                    "urlSong" : "http://lyrics.wikia.com/A_Dead_Silence:Heavy_Mind",
//                    "lyrics" : ""
//                }
//            ]
//        }
//    ]
//}

module.exports = router;