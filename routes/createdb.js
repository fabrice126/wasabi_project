var express         = require('express');
var router          = express.Router();
var db              = require('mongoskin').db('mongodb://localhost:27017/wasabi');
var lyricsWikia     = require('./handler/lyricsWikia.js');
/**

*/




router.get('/',function(req, res){
    console.log("dedans /createdb");
    //Pour chaque lettre  sur wikia et chaque catégorie on récupére pour commencer les albums de 5 artistes ainsi que tous ses albums et musiques
    //pour chaque categorie ex: http://lyrics.wikia.com/wiki/Category:Artists_A on récupére les artistes ici les artistes commencant par la lettre A
    lyricsWikia.fetchData(lyricsWikia.urlArtists,lyricsWikia.alphabet[lyricsWikia.idxAlphabet],lyricsWikia.paramNextPage,lyricsWikia.selectorArtists,lyricsWikia.attrArtists,lyricsWikia.removeStrHrefArtists);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ status: "OK" }));
    res.end();
});

router.get('/:urlArtist',function(req, res){
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



module.exports = router;