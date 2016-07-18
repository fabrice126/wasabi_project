var cheerio     = require('cheerio');
var request     = require('request');
var db          = require('mongoskin').db('mongodb://localhost:27017/wasabi');
var ObjectId    = require('mongoskin').ObjectID;

//Permet de changer de page pour récupérer tout les noms d'artistes d'une catégorie (exemple catégorie des artistes commencant par la lettre A)        
var paramNextPage = "?pagefrom=";
//contient les liens des artistes de tout l'alphabet qui sont aussi les noms des répertoires sur le disque
var urlArtists = 'http://lyrics.wikia.com/wiki/Category:Artists_';
var selectorArtists = '#mw-pages>.mw-content-ltr>table a[href]';
var attrArtists = 'href';//on récupérera dans allLinks les href du selector ci-dessus afin de créer les répertoires
var removeStrHrefArtists = '/wiki/';
var urlPageArtist = "http://lyrics.wikia.com/wiki/";//On construira l'url suivant : http://lyrics.wikia.com/wiki/nomArtiste
var urlApiWikia = 'http://lyrics.wikia.com/api.php?func=getArtist&artist=';
var selectorAlbums = '.albums>li>a[href]:first-child';
var attrAlbums = 'href';
var selectorLyrics = 'div.lyricbox';
var selectorName = 'body>h3>a';
//Nous permet de créer une première arborescence en récupérerant toutes les lyrics d'un abum et tous les album d'un groupe
var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
var idxAlphabet = 0;

 var self = this;

//param 1 : url :       url de la page a récupérer
//param 2 : selector :  selecteur pour récupérer la partie qui nous interesse dans leur page html
//param 3 : attr :      valeur de l'attribut à récupérer
//param 4 : removeStr : String a supprimer

var getArtistFromCategorie = function(url,selector,attr,removeStr){
    // La fonction de résolution est appelée avec la capacité de tenir ou de rompre la promesse
    var promise = new Promise(function(resolve, reject) { 
        (function requestArtistFromCategorie(url,selector,attr,removeStr){
        //  /!\/!\/!\/!\/!\   Si dans l'avenir le nombre d'artiste sur la page de lyrics wikia (http://lyrics.wikia.com/wiki/Category:Artists_A) change ce parametre doit changer   /!\/!\/!\/!\/!\
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

//Cette fonction est utilisée lors de l'ajout d'un nouvel artiste dans la base de données
//Param 1 : urlApiWikia :   Ce param correspond à l'url de l'api de lyrics wikia exemple : http://lyrics.wikia.com/api.php?func=getArtist&artist=Linkin_Park
var getOneArtist = function(urlApiWikia, objArtist, selectorName){
    var promise = new Promise(function(resolve, reject) { 
        (function requestInfoOneArtist(objArtist,selectorName){
            request(urlApiWikia, function(err, resp, body){
                if (!err && resp.statusCode == 200) {
                    var tObjArtist = [];
                    $ = cheerio.load(body);
                    objArtist.name = $(selectorName).text();
                    tObjArtist.push(objArtist);
                    var objResolve = {};
                    objResolve.tObjArtist = tObjArtist;
                    objResolve.nextPage = false;
                    objResolve.insertArtist = true;
                    //Si l'artiste existe déjà on ne le rajoute pas
                    db.collection('artist').findOne({name:objArtist.name}, function(err, artist) {                        
                        if (err) throw err;
                        if(!artist){
                            resolve(objResolve);//une fois le tObjArtist rempli resolve va indiquer que la promise s'est bien executée et va donc executer le then
                        }
                        else{
                            console.log("Cet artiste existe déjà");
                            reject(objResolve);
                        }
                    });
                }
                else{
                    if(err != null){
                        console.error('=====getOneArtist RELANCE DE LA REQUETE ===== '+urlApiWikia);
                        requestInfoOneArtist(objArtist,selectorName);
                    }
                }
            });
         })(objArtist,selectorName);
        
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
                objArtist.locationInfo = $("table.plainlinks a[title^='Category:Hometown/']").map(function() { return $(this).text() !=""?$(this).text():[]; }).get();
                //Si memberName != "" alors c'est un artiste solo
                var memberName = $("#mw-content-text>table div:contains('Real name') + div").text();
                var members;
                //Si c'est un groupe
                if(memberName == ""){
//                    console.log("C'EST UN GROUPE");
                    members = $("#mw-content-text>table div:contains('Band members') + div>ul>li").map(function() { return extractMembersAndFormerMembers(this);}).get();
                    var formerMembers = $("#mw-content-text>table div:contains('Former members') + div>ul>li").map(function() { return extractMembersAndFormerMembers(this); }).get();
                    objArtist.members = members;
                    objArtist.formerMembers = formerMembers;
                }
                else{
//                    console.log("C'EST UN ARTISTE SOLO");
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
//Extraction des données sur les pages d'albums de lyrics wikia
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



//Extraction des données sur les pages des musiques de lyrics wikia
//Fonction utilisé que lors de l'update de la collection song
var getInfosFromPageSong = function(objSong){
    var promise = new Promise(function(resolve, reject) {
        request({url: objSong.urlSong,method: "GET",timeout: 10000}, function(err, resp, body){
            if (!err && resp.statusCode == 200) {
                objSong = extractInfosSong(objSong,body);
                resolve(objSong);
            }
            else{
                reject(objSong);
            }
        });
    });
    return promise;
};

var extractInfosSong = function(objSong, body){
    $ = cheerio.load(body);
    var lyrics = $(selectorLyrics);
    $(lyrics).find("script").remove();
    $(lyrics).find(".lyricsbreak").remove();
    $(lyrics).contents().filter(function() { return this.nodeType == 8; }).remove();
    objSong.lyrics = $(lyrics).html();
    // console.trace(body);
    var srcYoutube = $("#mw-content-text .youtube").text();
    objSong.urlYoutube = srcYoutube != null ? srcYoutube.split('|')[0] : ""; // srcYoutube sera de ce style : wG5ilt3Hrt4|209|252
    console.log(objSong.urlYoutube);
    objSong.urlWikipedia = $("#mw-content-text div:contains('Wikipedia') div>i>b>a.extiw").attr('href') != null ? $("#mw-content-text div:contains('Wikipedia') div>i>b>a.extiw").attr('href') : "";
    return objSong;
};
//recupére les albums des artists via l'api de lyrics wikia
//param 1 : url :       url de la page a récupérer
//param 2 : selector :  selecteur pour récupérer la partie qui nous interesse dans leur page html
//param 3 : attr :      valeur de l'attribut à récupérer
//param 4 : objArtist : tableau représentant l'objet Artist
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
                                    urlYoutube:""
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
                                            objArtist.albums[nbAlbums].songs[nbLyrics] = extractInfosSong(objArtist.albums[nbAlbums].songs[nbLyrics],body);
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

var fetchData = function(url,lettre,paramNextPage,selectorArtists,attrArtists,removeStrHrefArtists){
    //Quand les artistes commencant par A sont récupérés (la requete ajax terminée) on entre dans le then
    setTimeout(function(){
        self.getArtistFromCategorie(url+lettre+paramNextPage,selectorArtists,attrArtists,removeStrHrefArtists).then(function(objArtist) {
            //objArtist.tObjArtist => tableau d'objet représentant les artists: [{ name: 'A Dying God', urlWikia: 'A_Dying_God', albums: [] },{objet2}, etc]
            console.log("objArtist.tObjArtist.length  ==="+objArtist.tObjArtist.length );
            var j=0;
            getArtistDiscography(objArtist,url,lettre,j);
            console.log("fin de GET createdb");
        }).catch(function() { 
            console.log("error Fin asynchrone");
        });
    }, Math.floor((Math.random() * 25500) + 15300));
};



var getArtistDiscography = function(newObjArtist,url,lettre,j){
    //On récupére les albums (musiques incluses) des artistes commencant par la lettre A
    //Seul facon de faire pour simuler une boucle avec un timeout a chaque tour (settimout ne fonctionne pas dans une boucle) on appel donc cette fonction récusivement
//    setTimeout(function(){
        console.log("En cours : "+newObjArtist.tObjArtist[j].name);
        self.getAlbumsAndSongsOfArtist(urlApiWikia,selectorAlbums,attrAlbums,newObjArtist.tObjArtist[j]).then(function(objArtist){
            //lorsque la requete ajax pour récupérer les artistes est terminé on obtient un objet (voir ci-dessous la structure json)
            //Nous allons maintenant ajouter dans chaque objet représentant l'artiste, les paroles des musiques
            self.getInfosFromPageArtist(urlPageArtist,objArtist).then(function(objArtist){
                self.getInfosFromPageAlbum(objArtist).then(function(objArtist){
                    self.getAllLyricsOfArtists(urlApiWikia,selectorLyrics,objArtist).then(function(objArtist){
                        //Quand on a traiter complétement une page d'artiste => albums avec ses musiques insérés en base de données, on passe a la page suivante
                        db.collection('artist').insert(objArtist, function(err, result) {
                            if (err) throw err;
                            if (result) {
                                console.log('Added =>'+objArtist.name);
                                //Si on veut ajouter un nouvel artist avec une base déjà crée
                                if(newObjArtist.insertArtist){
                                    console.log("DANS INSERT ARTIST");
                                    self.embeddedToRelationalSchema(objArtist)
                                }
                            }
                        }); 
                    });
                });
            }); 
            //Mode asynchrone => le site ne semble pas bloquer les requêtes de l'inria
            //Si il reste des artistes a traiter dans une page : alors on passe a l'objet suivante newObjArtist.tObjArtist[j]
            if(j < newObjArtist.tObjArtist.length-1){
                j++;
                getArtistDiscography(newObjArtist,url,lettre,j);
            }
            else{
                console.log("\n\n\n\n ================== NEXT PAGE ================== \n\n\n\n")
                if(newObjArtist.nextPage){
                    fetchData(url,lettre,"?pagefrom="+newObjArtist.artistPageFrom,selectorArtists,attrArtists,removeStrHrefArtists);
                }
                else{
                    self.idxAlphabet++;
                    if(self.idxAlphabet<alphabet.length){
                         console.log("\n\n\n\n ================== Changement de categorie : lettre "+alphabet[self.idxAlphabet]+" ================== \n\n\n\n");
                        fetchData(url,alphabet[self.idxAlphabet],"?pagefrom=",selectorArtists,attrArtists,removeStrHrefArtists);
                    }
                }
            }
        });
//    }, Math.floor((Math.random() * 20000) + 10000));
};

//Lorsqu'on veut ajouter un nouvel artiste a la base de données, il faut transformer le document à inserer sous une forme relationel
var embeddedToRelationalSchema = function(objArtist){
    //Creation de la collection album
    db.collection('artist').findOne({name:objArtist.name}, function(err, artist) {                        
        if (err) throw err;
        if(!artist){
            console.log("Erreur, aucun document trouvé dans la base de données");//une fois le tObjArtist rempli resolve va indiquer que la promise s'est bien executée et va donc executer le then
        }
        else{
            console.log("Traitement embedded to relational schema");
            for(var i = 0 ;i<artist.albums.length;i++){
                artist.albums[i].id_artist = artist._id;
                artist.albums[i].name = artist.name;
                artist.albums[i]._id = new ObjectId();
                for(var j = 0 ;j<artist.albums[i].songs.length;j++){
                    artist.albums[i].songs[j].name = artist.name;
                    artist.albums[i].songs[j].id_album = artist.albums[i]._id;
                    artist.albums[i].songs[j].position = j;
                    artist.albums[i].songs[j].albumTitre = artist.albums[i].titre;
                    artist.albums[i].songs[j].lengthAlbum = artist.albums[i].length;
                    artist.albums[i].songs[j].dateSortieAlbum = artist.albums[i].dateSortie;
                    artist.albums[i].songs[j];
                    db.collection('song').insert(artist.albums[i].songs[j]);
                }
                delete artist.albums[i].songs;
                db.collection('album').insert(artist.albums[i]);
            }
        }
    });
    //suppression du champ albums dans la collection artist      
    db.collection('artist').update({name:objArtist.name},{$unset: {albums:1}},false,true);
    console.log("L'artiste "+objArtist.name+" a été transformé sous forme relationel");
}

exports.getArtistFromCategorie      = getArtistFromCategorie;
exports.getAlbumsAndSongsOfArtist   = getAlbumsAndSongsOfArtist;
exports.getAllLyricsOfArtists       = getAllLyricsOfArtists;
exports.getInfosFromPageArtist      = getInfosFromPageArtist;
exports.getInfosFromPageAlbum       = getInfosFromPageAlbum;
exports.fetchData                   = fetchData;
exports.getArtistDiscography        = getArtistDiscography;
exports.getOneArtist                = getOneArtist;
exports.embeddedToRelationalSchema  = embeddedToRelationalSchema;

exports.paramNextPage               = paramNextPage;
exports.urlArtists                  = urlArtists;
exports.selectorArtists             = selectorArtists;
exports.attrArtists                 = attrArtists;
exports.removeStrHrefArtists        = removeStrHrefArtists;
exports.urlPageArtist               = urlPageArtist;
exports.urlApiWikia                 = urlApiWikia;
exports.selectorAlbums              = selectorAlbums;
exports.attrAlbums                  = attrAlbums;
exports.selectorLyrics              = selectorLyrics;
exports.alphabet                    = alphabet;
exports.idxAlphabet                 = idxAlphabet;
exports.selectorName                = selectorName;
exports.getInfosFromPageSong        = getInfosFromPageSong;