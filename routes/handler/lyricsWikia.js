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
        (function requestArtistFromCategorie(url,selector,attr,removeStr){

            var nbArtistPerPage = 200;
            request(url, function(err, resp, body){
                if (!err && resp.statusCode == 200) {
                    var tObjArtist = [];
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
                            var objArtist = {
                                name:$(link).attr('title'),
                                urlWikipedia:"",
                                urlOfficialWebsite : "",
                                urlFacebook:"",
                                urlMySpace:"",
                                urlTwitter:"",
                                urlWikia:$(link).attr(attr).replace(removeStr, ""), //on récupére les #mw-pages>.mw-content-ltr>table a[href]
                                activeYears:"",
                                members:[],
                                formerMembers:[],
                                locationInfo:[],
                                genres:[],
                                labels:[],
                                albums:[]
                            };
                            tObjArtist.push(objArtist);
                        }
                    });
                    if($(links).length == nbArtistPerPage){
                        nextPage = true;
                    }
                    var objResolve = {};
                    objResolve.tObjArtist = tObjArtist;
                    objResolve.artistPageFrom = artistPageFrom;
                    objResolve.nextPage = nextPage;
                    resolve(objResolve);//une fois le tObjArtist rempli resolve va indiquer que la promise s'est bien executée et va donc executer le then
                }
                else{
                    console.error('=====getArtistFromCategorie RELANCE DE LA REQUETE ====='+url);
                    console.error(new Error(err));
                    requestArtistFromCategorie(url,selector,attr,removeStr);
                }
            });
        })(url,selector,attr,removeStr);
    });
    return promise;
};

//Extraction des données sur les pages d'artistes de lyrics wikia
var getInfosFromPageArtist = function(url,objArtist){
    // La fonction de résolution est appelée avec la capacité de tenir ou de rompre la promesse
    var promise = new Promise(function(resolve, reject) { 
        var urlArtist = url+objArtist.urlWikia;
        request(urlArtist, function(err, resp, body){
            if (!err && resp.statusCode == 200) {
                $ = cheerio.load(body);
                objArtist.urlWikipedia = $("table.plainlinks a:contains('Wikipedia article')").attr('href')!=null? $("table.plainlinks a:contains('Wikipedia article')").attr('href') : "";
                objArtist.urlOfficialWebsite = $("table.plainlinks a:contains('Official Website')").attr('href')!=null? $("table.plainlinks a:contains('Official Website')").attr('href') :"";
                objArtist.urlFacebook = $("table.plainlinks a:contains('Facebook Profile')").attr('href') !=null?$("table.plainlinks a:contains('Facebook Profile')").attr('href') :"";
                objArtist.urlMySpace = $("table.plainlinks a:contains('MySpace Profile')").attr('href') != null?$("table.plainlinks a:contains('MySpace Profile')").attr('href') :"";
                objArtist.urlTwitter = $("table.plainlinks a:contains('Twitter Profile')").attr('href') !=null ?$("table.plainlinks a:contains('Twitter Profile')").attr('href') :"";
                objArtist.activeYears = $("#mw-content-text>table div:contains('Years active') + div") != null ?$("#mw-content-text>table div:contains('Years active') + div").text() : ""; 
                objArtist.genres = $("#mw-content-text>table div>ul>li>a[title^='Category:Genre/']").map(function() { return $(this).text() !=""?$(this).text():""; }).get();
                objArtist.labels = $("#mw-content-text>table div>ul>li>a[title^='Category:Label/']").map(function() { return $(this).text() !=""?$(this).text():""; }).get();
                objArtist.locationInfo = $("table.plainlinks a[title^='Category:Hometown/']").map(function() { return $(this).text() !=""?$(this).text():""; }).get();
                
                //Si memberName != "" alors c'est un artiste solo
                var memberName = $("#mw-content-text>table div:contains('Real name') + div").text();
                var members;
                //Si c'est un groupe
                if(memberName == ""){
                    console.log("C'EST UN GROUPE");
                    members = $("#mw-content-text>table div:contains('Band members') + div>ul>li").map(function() { return extractMembersAndFormerMembers(this);}).get();
                    var formerMembers = $("#mw-content-text>table div:contains('Former members') + div>ul>li").map(function() { return extractMembersAndFormerMembers(this); }).get();
                    objArtist.members = members;
                    objArtist.formerMembers = formerMembers;
                }
                else{
                    console.log("C'EST UN ARTISTE SOLO");
                    var objMember = {name:"",instruments:[],activeYears:[]};
                    members = $("#mw-content-text>table div:contains('Real name') + div").map(function() {objMember.name = $(this).text(); return objMember; }).get();
                    objArtist.members = members;
                    objArtist.formerMembers = [];
                }
            }
            resolve(objArtist);
        });
    });
    return promise;
};

var extractMembersAndFormerMembers = function(membre){
    var objMember = {name:"",instruments:[],activeYears:[]};
    if( $(membre).text() !=""){
        var text = $(membre).text();
        if(new RegExp(" - ").test(text)){
            var memberTmp = text.split(' - ');
            objMember.name = memberTmp[0];
            if(new RegExp("([(])([0-9]+)").test(memberTmp[1])){
                var memberTmpInstruDate = memberTmp[1].split("(");
                var memberTmpDate = memberTmpInstruDate[1].replace(')','');
                objMember.instruments = memberTmpInstruDate[0].split(',');
                objMember.activeYears = memberTmpDate.split(',');
            }
        }
        else{
            objMember.name = $(membre).text();
        }              
        return objMember;
    }else{
        return objMember;
    }
};

var getInfosFromPageAlbum = function(objArtist){
    var promise = new Promise(function(resolve, reject) { 
        var currNbAlbum = 0 ;
        var nbAlbum = objArtist.albums.length;
        for(var i = 0;i <nbAlbum;i++){
            (function requestInfoAlbums(objArtist, i){
                request(objArtist.albums[i].urlAlbum, function(err, resp, body){
                    currNbAlbum++ ;
                    if (!err && resp.statusCode == 200) {
                        var tAllInfoArtists = [];
                        $ = cheerio.load(body);

                        objArtist.albums[i].genre = $("#mw-content-text>.plainlinks table tr:contains('Genre') td>a:last-child").html() != null ? $("#mw-content-text>.plainlinks table tr:contains('Genre') td>a:last-child").html() :"";
                        objArtist.albums[i].length = $("#mw-content-text>.plainlinks table tr:contains('Length:') td:last-child").html() != null ? $("#mw-content-text>.plainlinks table tr:contains('Length:') td:last-child").html() : "";
                        objArtist.albums[i].urlWikipedia = $("#mw-content-text>.plainlinks div>i>b>a:contains('Wikipedia')").attr('href') != null ? $("#mw-content-text>.plainlinks div>i>b>a:contains('Wikipedia')").attr('href') : "";
                    }
                    else{
                        if(err != null){
                            console.error('=====getInfosFromPageAlbum RELANCE DE LA REQUETE ====='+objArtist.albums[i].titre);
                            currNbAlbum--;
                            requestInfoAlbums(objArtist,i);
                        }
                    }
                    if(currNbAlbum==nbAlbum){
                        resolve(objArtist);
                    }
                });
             })(objArtist, i);
        }
        
    });
    return promise;
    
};

//recupére les albums des artists via l'api de lyrics wikia
//param 1 : url de la page a récupérer
//param 2 : selecteur pour récupérer la partie qui nous interesse dans leur page html
//param 3 : valeur de l'attribut à récupérer
//param 4 : tableau représentant l'objet Artist
var getAlbumsAndSongsOfArtist = function(url,selector,attr,objArtist){
        var promise = new Promise(function(resolve, reject) { 
            (function requestAlbumsAndSongs(url,selector,attr,objArtist){//permet de relancer la requête si il y a un probleme
                var urlWikiaArtists = url+objArtist.urlWikia;
                request({ pool: {maxSockets: Infinity}, url: urlWikiaArtists,method: "GET",timeout: 50000000}, function(err, resp, body){
                    if (!err && resp.statusCode == 200) {
                        $ = cheerio.load(body);
                        var tElts = $(".albums>li")//$(selector);
                        $(tElts).each(function(i, eltAlbum){
                            var album= $(eltAlbum).find($(".albums>li>a[href]:first-child")).text();
                            var dateSortie = "";
                            if(album.lastIndexOf('_(')!==-1){//Si il existe une date :
                                dateSortie = album.slice(album.lastIndexOf('_('),album.length);
                                album = album.replace(dateSortie,'');
                                dateSortie = dateSortie.substring(2,dateSortie.length-1);//on passera de _(1995) à 1995 
                            }
                            var songs = [];//va contenir les objets objSong
                            $(eltAlbum).find($(".songs>li>a[href]")).each(function(ii,eltSong){
                                //Création de l'objet song
                                var objSong = {
                                    titre: $(eltSong).text(),
                                    urlSong: $(eltSong).attr(attr),
                                    lyrics:"",
                                    urlWikipedia:"",
                                };
                                songs.push(objSong);//On met l'objet song dans le tableau contenant les autres musiques de l'album
                            });
                            var objAlbum = {
                                titre: album,
                                dateSortie: dateSortie,
                                urlWikipedia:"",
                                genre:"",
                                length:"",
                                urlAlbum: $(eltAlbum).find($(".albums>li>a[href]:first-child")).attr(attr),
                                songs:songs //array contenant les objets représentant les musiques d'un album
                            };

                            objArtist.albums.push(objAlbum);//on ajoute à l'ojet artiste l'objet album contenant le nom de l'album et ses musiques 
                        });
                        resolve(objArtist);//une fois le objArtist rempli resolve va indiquer que la promise s'est bien executée et va donc executer le then
                    }
                    else{
                        console.error('=====getAlbumsAndSongsOfArtist RELANCE DE LA REQUETE ====='+url);
                        console.error('=====getAlbumsAndSongsOfArtist RELANCE DE LA REQUETE ====='+objArtist.urlWikia);
                        console.error('=====getAlbumsAndSongsOfArtist RELANCE DE LA REQUETE ====='+selector);
                        console.error('=====getAlbumsAndSongsOfArtist RELANCE DE LA REQUETE ====='+attr);
                        requestAlbumsAndSongs(url,selector,attr,objArtist);
                    }
                });
            })(url,selector,attr,objArtist);
       });
    return promise;
};

var getAllLyricsOfArtists = function(url,selector,objArtist){
        var promise = new Promise(function(resolve, reject) { 
            var nbTitre = 0;
            var currNbTitre = 0;
            for(var nbLoopAlbums=0;nbLoopAlbums<objArtist.albums.length;nbLoopAlbums++){
                nbTitre += objArtist.albums[nbLoopAlbums].songs.length;
            }
            var nbAlbums=0;

//            console.log("Nombre total de musique pour l'artiste = "+nbTitre+" album = "+objArtist.albums.length);
            //Si il n'y a pas de musique sur la page
            if(nbTitre>0){
                (function albumLoop(nbAlbums,objArtist){
//                    setTimeout(function(){
                        if(nbAlbums<objArtist.albums.length){
                            for(var nbLyrics=0;nbLyrics<objArtist.albums[nbAlbums].songs.length;nbLyrics++){
                                //on récupérer l'objet correspondant a la chanson 
                                //exemple : {"titre" : "Heavy Mind","urlSong" : "http://lyrics.wikia.com/A_Dead_Silence:Heavy_Mind"}  
                                var currSong = objArtist.albums[nbAlbums].songs[nbLyrics];
                                var urlWikiaLyrics = currSong.urlSong;    

                                (function getLyricsSongRequest(urlWikiaLyrics,nbAlbums,nbLyrics,objArtist){ 
                                    request({ pool: {maxSockets: Infinity}, url: urlWikiaLyrics,method: "GET",timeout: 50000000}, function(err, resp, body){
                                        currNbTitre++;
//                                        console.log("Musique "+currNbTitre+"                "+urlWikiaLyrics);
                                        if (!err && resp.statusCode == 200) {
                                            $ = cheerio.load(body);
                                            var lyrics = $(selector);
                                            var urlWikipediaArtist = $("#songfooter>div>a[href]:first-child")
                                            $(lyrics).find("script").remove();
                                            $(lyrics).find(".lyricsbreak").remove();
                                            $(lyrics).contents().filter(function() {
                                                return this.nodeType == 8;
                                            }).remove();
                                            objArtist.albums[nbAlbums].songs[nbLyrics].lyrics = $(lyrics).html();
                                            $("#mw-content-text div:contains('Wikipedia') div>i>b>a.extiw").attr('href')
                                            objArtist.albums[nbAlbums].songs[nbLyrics].urlWikipedia = $("#mw-content-text div:contains('Wikipedia') div>i>b>a.extiw").attr('href') != null ? $("#mw-content-text div:contains('Wikipedia') div>i>b>a.extiw").attr('href') : "";
                                        }
                                        else{
                                            if(err != null){
                                                console.error('=====getAllLyricsOfArtists RELANCE DE LA REQUETE ====='+objArtist.name);
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
                            nbAlbums++;
                            albumLoop(nbAlbums,objArtist);
                        }
//                    }, Math.floor((Math.random() * 2500 ) + 500 ));
                })(nbAlbums,objArtist);
            }
            else{
                resolve(objArtist);
            }
       });
    return promise;
};




exports.getArtistFromCategorie      = getArtistFromCategorie;
exports.getAlbumsAndSongsOfArtist   = getAlbumsAndSongsOfArtist;
exports.getAllLyricsOfArtists       = getAllLyricsOfArtists;
exports.getInfosFromPageArtist      = getInfosFromPageArtist;
exports.getInfosFromPageAlbum       = getInfosFromPageAlbum;
