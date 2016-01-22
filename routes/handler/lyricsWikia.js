var cheerio = require('cheerio');
var request = require('request');
//Le module fs  de lire/créer/supprimer/renommer/changer droits/avoir des infos sur un fichier ou répertoire etc.


//var getLyricsFromWikiaPageURL = function(url) {
//    return Q.Promise(function(resolve, reject, notify) {
//        var request = new XMLHttpRequest();
//        console.log("URL getLyricsFromWikiaPageURL = "+url);
//        request.open("GET", url, true);
//        request.onload = onload;
//        request.onerror = onerror;
//        request.onprogress = onprogress;
//        request.send();
//
//        function onload() {
//            if (request.status === 200) 
//            {
//                this.response = this.response.replace(/\<a+s*(.*?)\>+/g,"");
//                $ = cheerio.load(this.response);
//                var x = $(".lyricbox")[0];
//                var y = $(x).find("script").remove();
//                var z = $(x).find("div").first().remove();
//                console.log("########## lyricbox var x = "+ $(x).html());
//                $(x).html();
//                console.log(""+$(x).html());
//            } 
//            else 
//            {
//                reject(new Error("Status code was " + request.status));
//            }
//        }
//        function onerror() {
//            reject(new Error("Can't XHR " + JSON.stringify(url)));
//        }
//        function onprogress(event) {
//            notify(event.loaded / event.total);
//        }
//    });
//};


//param 1 : url de la page a récupérer
//param 2 : selecteur pour récupérer la partie qui nous interesse dans leur page html
//param 3 : valeur de l'attribut à récupérer
var getArtistFromCategorie = function(url,selector,attr,removeStr){
    // La fonction de résolution est appelée avec la capacité de tenir ou de rompre la promesse
    var promise = new Promise(function(resolve, reject) { 
        request(url, function(err, resp, body){
            if (!err && resp.statusCode == 200) {
                var tAllInfoArtists = [];
                $ = cheerio.load(body);
                var links = $(selector); //#mw-pages>.mw-content-ltr>table a[href]
                $(links).each(function(i, link){
                    //tAllInfoArtists.push($(link).attr(attr).replace(removeStr, ""));//on récupére les #mw-pages>.mw-content-ltr>table a[href]
                    var tInfoArtist = {
                        name:$(link).attr('title'),
                        urlWikia:$(link).attr(attr).replace(removeStr, ""), //on récupére les #mw-pages>.mw-content-ltr>table a[href]
                        albums:[]
                    };
                    tAllInfoArtists.push(tInfoArtist);
                });
                resolve(tAllInfoArtists);//une fois le tAllInfoArtists rempli resolve va indiquer que la promise s'est bien executée et va donc executer le then
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
    //faire comme la fonction getArtistFromCategorie
        var promise = new Promise(function(resolve, reject) { 
            var currUrlNomArtist = objArtist.urlWikia;
            var currNomArtist = objArtist.name;
            var urlWikiaArtists = url+currUrlNomArtist;
            request(urlWikiaArtists, function(err, resp, body){
                if (!err && resp.statusCode == 200) {
                    $ = cheerio.load(body);
                    var tElts = $(".albums>li")//$(selector);
                    //console.log("artist = "+currNomArtist);
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
                        //console.log("       Album = "+album);
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
            for(var nbAlbums=0;nbAlbums<objArtist.albums.length;nbAlbums++){
                for(var nbLyrics=0;nbLyrics<objArtist.albums[nbAlbums].songs.length;nbLyrics++){
                    //on récupérer l'objet correspondant a la chanson 
                    //exemple : {"titre" : "Heavy Mind","urlSong" : "http://lyrics.wikia.com/A_Dead_Silence:Heavy_Mind"}  
                    var currSong = objArtist.albums[nbAlbums].songs[nbLyrics];
//                    sleep(300);
                    var urlWikiaLyrics = currSong.urlSong;
                    console.log("urlWikiaLyrics = "+urlWikiaLyrics);
                    
                    

                    
                    (function(urlWikiaLyrics,mynbAlbums,mynbLyrics,objArtist){

                        
                        request(urlWikiaLyrics, function(err, resp, body){
                            if (!err && resp.statusCode == 200) {
                                $ = cheerio.load(body);
                                var lyrics = $(selector);
                                $(lyrics).find("script").remove();
                                $(lyrics).find(".lyricsbreak").remove();
                                $(lyrics).contents().filter(function() {
                                    return this.nodeType == 8;
                                }).remove();
            //                    console.log("########## lyricbox = \n\n\n"+ $(lyrics).html());


//                                console.log("Request : "+objArtist.albums[nbAlbums].songs[nbLyrics]);
    //                            currSong.lyrics = $(lyrics).html();
                                objArtist.albums[mynbAlbums].songs[mynbLyrics].lyrics = $(lyrics).html();
                                if((objArtist.albums.length-1) == (mynbAlbums) && (objArtist.albums[mynbAlbums].songs.length-1) == (mynbLyrics)){
                                    console.log("Dans resolve = "+(objArtist.albums.length-1)+"="+(mynbAlbums)+" <et>  "+(objArtist.albums[mynbAlbums].songs.length-1)+"="+(mynbLyrics));
                                    resolve(objArtist);//une fois le objArtist rempli resolve va indiquer que la promise s'est bien executée et va donc executer le then
                                }
                            }
                            else{
                                console.error('Error:', err);
                                reject(new Error(err));
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
