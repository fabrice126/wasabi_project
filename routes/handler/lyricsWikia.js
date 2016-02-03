var cheerio = require('cheerio');
var request = require('request');
//Le module fs  de lire/créer/supprimer/renommer/changer droits/avoir des infos sur un fichier ou répertoire etc.


//param 1 : url de la page a récupérer
//param 2 : selecteur pour récupérer la partie qui nous interesse dans leur page html
//param 3 : valeur de l'attribut à récupérer
var getArtistFromCategorie = function(url,selector,attr,removeStr){
    // La fonction de résolution est appelée avec la capacité de tenir ou de rompre la promesse
    var promise = new Promise(function(resolve, reject) { 
        //  /!\/!\/!\/!\/!\   Si dans l'avenir le nombre d'artiste sur la page de lyrics wikia change ce parametre doit changer   /!\/!\/!\/!\/!\
        var nbArtistPerPage = 200;
        request(url, function(err, resp, body){
            if (!err && resp.statusCode == 200) {
                var tAllInfoArtists = [];
                $ = cheerio.load(body);
                var links = $(selector); //#mw-pages>.mw-content-ltr>table a[href]
                //Pour itérer sur toutes les pages d'un artiste commençant par une lettre il faut avoir un url de type :
                //http://lyrics.wikia.com/wiki/Category:Artists_A?pagefrom=A+Pocket+Full+Of+Posers ou A+Pocket+Full+Of+Posers est le dernier titre d'artiste de la page analysé
                var artistPageFrom = $(links)[$(links).length-1].attribs.title;
                var nextPage = false;
                $(links).each(function(i, link){
                    //on récupére les #mw-pages>.mw-content-ltr>table a[href]
                    //Cette condition permet de ne pas remplir le dernier objet artist d'une page contenant 200 artists. Cet objet sera rempli lors de la reqête de changement de page
                    if(i<nbArtistPerPage-1){
                        var tInfoArtist = {
                            name:$(link).attr('title'),
                            urlWikia:$(link).attr(attr).replace(removeStr, ""), //on récupére les #mw-pages>.mw-content-ltr>table a[href]
                            albums:[]
                        };
                        tAllInfoArtists.push(tInfoArtist);
                    }
                });
                if($(links).length == nbArtistPerPage){
                    nextPage = true;
                }
                var objResolve = {};
                objResolve.tObjArtist = tAllInfoArtists;
                objResolve.artistPageFrom = artistPageFrom;
                objResolve.nextPage = nextPage;
                resolve(objResolve);//une fois le tAllInfoArtists rempli resolve va indiquer que la promise s'est bien executée et va donc executer le then
            }
            else{
                console.error('Error:', err);
                reject(new Error(err));
            }
        });
    });
    return promise;
};

//recupére les albums des artists via l'api de lyrics wikia
//param 1 : url de la page a récupérer
//param 2 : selecteur pour récupérer la partie qui nous interesse dans leur page html
//param 3 : valeur de l'attribut à récupérer
//param 4 : tableau représentant l'objet Artist
var getAlbumsFromArtists = function(url,selector,attr,removeStr,objArtist){
        var promise = new Promise(function(resolve, reject) { 
            var currUrlNomArtist = objArtist.urlWikia;
            var currNomArtist = objArtist.name;
            var urlWikiaArtists = url+currUrlNomArtist;
            request(urlWikiaArtists, function(err, resp, body){
                if (!err && resp.statusCode == 200) {
                    $ = cheerio.load(body);
                    var tElts = $(".albums>li")//$(selector);
                    $(tElts).each(function(i, eltAlbum){
                        var album= $(eltAlbum).find($(".albums>li>a[href]:first-child")).text();
                        var dateSortie = "";
                        if(album.lastIndexOf('_(')!==-1){
                            dateSortie = album.slice(album.lastIndexOf('_('),album.length);
                            album = album.replace(dateSortie,'');
                            dateSortie = dateSortie.substring(2,dateSortie.length-1);//on passera de _(1995) à 1995 
                        }
                        var urlAlbum = $(eltAlbum).find($(".albums>li>a[href]:first-child")).attr(attr);
                        var songs = [];//va contenir les objets objSong
                        $(eltAlbum).find($(".songs>li>a[href]")).each(function(ii,eltSong){
                            var song = $(eltSong).text();
                            var urlSong = $(eltSong).attr(attr);
                            var objSong = {
                                titre: song,
                                urlSong: urlSong,
                                lyrics:"",
                            };
                            songs.push(objSong);
                            //console.log("           Song = "+$(eltSong).text());
                        });
                        var objAlbum = {
                            titre: album,
                            dateSortie: dateSortie,
                            urlAlbum: urlAlbum,
                            songs:songs //array contenant les objets objSong
                        };
//                        console.log("Artiste :"+currNomArtist+" Album :"+objAlbum.titre);
                        //on ajoute l'objet l'album contenant le nom de l'album et ses musiques 
                        objArtist.albums.push(objAlbum);
                    });
                    resolve(objArtist);//une fois le objArtist rempli resolve va indiquer que la promise s'est bien executée et va donc executer le then
                }
                else{
                    console.error('Error:', err);
                    reject(new Error(err));
                }
            });
       });
    return promise;
};

var getAllLyricsOfArtists = function(url,selector,objArtist){
        var promise = new Promise(function(resolve, reject) { 
            var nbTitre = 0;
            var currNbTitre = 0;
            for(var nbAlbums=0;nbAlbums<objArtist.albums.length;nbAlbums++){
                nbTitre += objArtist.albums[nbAlbums].songs.length;
            }
            console.log("Nombre total de musique pour l'artiste = "+nbTitre);
            for(var nbAlbums=0;nbAlbums<objArtist.albums.length;nbAlbums++){
                for(var nbLyrics=0;nbLyrics<objArtist.albums[nbAlbums].songs.length;nbLyrics++){
                    //on récupérer l'objet correspondant a la chanson 
                    //exemple : {"titre" : "Heavy Mind","urlSong" : "http://lyrics.wikia.com/A_Dead_Silence:Heavy_Mind"}  
                    var currSong = objArtist.albums[nbAlbums].songs[nbLyrics];
                    var urlWikiaLyrics = currSong.urlSong;    
                    (function getLyricsSongRequest(urlWikiaLyrics,nbAlbums,nbLyrics,objArtist){   
                            request({ pool: {maxSockets: Infinity}, url: urlWikiaLyrics,method: "GET",timeout: 500000}, function(err, resp, body){
                                currNbTitre++;
                                if (!err && resp.statusCode == 200) {
                                    $ = cheerio.load(body);
                                    var lyrics = $(selector);
                                    $(lyrics).find("script").remove();
                                    $(lyrics).find(".lyricsbreak").remove();
                                    $(lyrics).contents().filter(function() {
                                        return this.nodeType == 8;
                                    }).remove();
                                    objArtist.albums[nbAlbums].songs[nbLyrics].lyrics = $(lyrics).html();
                                }
                                else{
                                    if(err != null){
                                        console.error('\n\n getAllLyricsOfArtists = '+objArtist.name+'    '+objArtist.albums[nbAlbums].songs[nbLyrics].titre+'  \n :Error:', err);
                                        console.error('===== RELANCE DE LA REQUETE =====');
                                        currNbTitre--;
                                        getLyricsSongRequest(urlWikiaLyrics,nbAlbums,nbLyrics,objArtist);
                                    }
                                }
                                if(currNbTitre==nbTitre){
                                    resolve(objArtist);
                                }
                            });
                    })(urlWikiaLyrics,nbAlbums,nbLyrics,objArtist);
                } 
            }
       });
    return promise;
};

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


exports.getArtistFromCategorie      = getArtistFromCategorie;
exports.getAlbumsFromArtists        = getAlbumsFromArtists;
exports.getAllLyricsOfArtists       = getAllLyricsOfArtists;
