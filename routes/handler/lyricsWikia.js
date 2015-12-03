var cheerio = require('cheerio');
var request = require('request');
//Le module fs  de lire/créer/supprimer/renommer/changer droits/avoir des infos sur un fichier ou répertoire etc.
var fs = require('fs');
var path = require('path');
//Permet d'enlever les caractères interdit pour les dossiers de windows
var sanitize = require("sanitize-filename");


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


//Si le répertoire n'existe pas il est crée
//param 1 : répertoire a vérifier (déja crée ou à créer)
var dirExistOrCreate = function(dir){
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, function (err) {
            console.error('failed to create directory', err);
        });
    }
};
//creer les répertoires des artistes avec les valeurs nom d'artiste recupéré sur lyricsWikia (valLinks)
//param 1 : répertoire ou seront les dossiers des artistes
//param 2 : href récupéré sur wiki, ex: "/wikia/ACDC"
//param 3 : Permet de supprimer une chaine de caractère d'un href, si non utile mettre :''
//param 4 : si les artites doivent être ou non indexés
var createDirArtist = function(dirArtist,valLinks){
        //var tabIndexArtist = []; // !!!!!! Faire promise pour retourner tabIndexArtist
        //les dossiers et fichiers ne peuvent contenir les caractères suivants:    
        //  \ / : * ? " < > | on utilise donc sanitize
        //console.log("dirArtist = "+dirArtist);
        dirExistOrCreate(dirArtist);
        for(var i=0,len = valLinks.length; i<len;i++){
            var artistName = valLinks[i];
            var artistNameSanitize = sanitize(artistName);
            //Si le dernier char est un '.'
            if(artistNameSanitize.charAt(artistNameSanitize.length-1) == '.'){
                artistNameSanitize = sanitizeLastChar(artistName);
            }
            var dirOfAnArtist = path.join(dirArtist+"/"+artistNameSanitize);
            //tabIndexArtist.push(artistName+':'+artistNameSanitize); //Pour crée l'index plus tard artistName:path/sanitize(artistName)
            dirExistOrCreate(dirOfAnArtist);
            //console.log("Création de : "+dirOfAnArtist);
        }
        console.info("Directory created successfully !");
    //return tabIndexArtist;
};

//Si on rencontre un probleme avec un char situé en fin de nom de dossier
//Ici le '.' situé en fin de dossier empêche la suppression du dossier
//param 1 : string a nettoyer
var sanitizeLastChar = function (sanitizeStr){
    while(sanitizeStr.charAt(sanitizeStr.length-1) == '.'){ 
        //on supprime le dernier caractère qui est un '.'
        sanitizeStr = sanitizeStr.substring(0, sanitizeStr.length-1) 
    }
    return sanitizeStr;
};

//param 1 : url de la page a récupérer
//param 2 : selecteur pour récupérer la partie qui nous interesse dans leur page html
//param 3 : valeur de l'attribut à récupérer
var getArtistFromCategorie = function(url,selector,attr,removeStr){
    // La fonction de résolution est appelée avec la capacité de tenir ou de rompre la promesse
    var promise = new Promise(function(resolve, reject) { 
        request(url, function(err, resp, body){
            if (!err && resp.statusCode == 200) {
                var tLinks = [];
                $ = cheerio.load(body);
                var links = $(selector); //#mw-pages>.mw-content-ltr>table a[href]
                $(links).each(function(i, link){
                    tLinks.push($(link).attr(attr).replace(removeStr, ""));//on récupére les #mw-pages>.mw-content-ltr>table a[href]
                });
                resolve(tLinks);//une fois le tLinks rempli resolve va indiquer que la promise s'est bien executée et va donc executer le then
            }
            else{
                console.error('Error:', err);
                reject(new Error(resp.statusText));
            }
        });
    });
    return promise;
};

//recupére les albums des artists via l'api de lyrics wikia
//param 1 : url de la page a récupérer
//param 2 : selecteur pour récupérer la partie qui nous interesse dans leur page html
//param 3 : valeur de l'attribut à récupérer
//param 4 : tableau représentant les noms d'artistes
var getAlbumsFromArtists = function(url,selector,attr,removeStr,dirArtists,currNomArtist){
    //faire comme la fonction getArtistFromCategorie
        var promise = new Promise(function(resolve, reject) { 
            var urlArtists = url+currNomArtist;
            request(urlArtists, function(err, resp, body){
                if (!err && resp.statusCode == 200) {
                    //console.log("urlArtists = "+urlArtists);

                    var tLinks = [];
                    $ = cheerio.load(body);
                    var tElts = $(".albums>li")//$(selector);
                    //console.log("currNomArtist = "+currNomArtist);
                    $(tElts).each(function(i, eltAlbum){
                        var album= $(eltAlbum).find($(".albums>li>a[href]:first-child")).attr(attr).replace(removeStr+currNomArtist, "");
                        album = sanitize(album);
                        album = sanitizeLastChar(album);
                        currNomArtist = sanitize(currNomArtist);
                        currNomArtist = sanitizeLastChar(currNomArtist);
                        //console.log("   album = "+album);

                        var dirAlbums = path.join(dirArtists+"/"+currNomArtist+"/"+album);
                        dirExistOrCreate(dirAlbums);
                        $(eltAlbum).find($(".songs>li>a[href]")).each(function(ii,eltSong){
                            var song = $(eltSong).attr(attr).replace(removeStr+currNomArtist+':',"");
                            //console.log("       song = "+song);
                            song = sanitize(song);
                            song = sanitizeLastChar(song);
                            var dirSongs = path.join(dirArtists+"/"+currNomArtist+"/"+album+"/"+song);
                            dirExistOrCreate(dirSongs);
                        });
                    });
                    resolve(tLinks);//une fois le tLinks rempli resolve va indiquer que la promise s'est bien executée et va donc executer le then
                }
                else{
                    console.error('Error:', err);
                    reject(new Error(resp.statusText));
                }
            });
       });
    return promise;
};

//récupére les lyrics de chaque album via l'api de lyrics wikia
//param 1 : tableau de répertoire représentant les albums, on mettra les lyrics dedans
var getLyricsFromAlbums = function(tabDirAlbum){
    
};



exports.getArtistFromCategorie      = getArtistFromCategorie;
exports.getAlbumsFromArtists        = getAlbumsFromArtists;
exports.getLyricsFromAlbums         = getLyricsFromAlbums;

//exports.getLyricsFromWikiaPageURL   = getLyricsFromWikiaPageURL;
exports.createDirArtist             = createDirArtist;
