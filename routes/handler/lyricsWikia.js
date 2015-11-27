var cheerio = require('cheerio');
var request = require('request');
//Le module fs  de lire/créer/supprimer/renommer/changer droits/avoir des infos sur un fichier ou répertoire etc.
var fs = require('fs');
var path = require('path');
//Permet d'enlever les caractères interdit pour les dossiers de windows
var sanitize = require("sanitize-filename");


var getLyricsFromWikiaPageURL = function(url) {
    return Q.Promise(function(resolve, reject, notify) {
        var request = new XMLHttpRequest();
        console.log("URL getLyricsFromWikiaPageURL = "+url);
        request.open("GET", url, true);
        request.onload = onload;
        request.onerror = onerror;
        request.onprogress = onprogress;
        request.send();

        function onload() {
            if (request.status === 200) 
            {
                this.response = this.response.replace(/\<a+s*(.*?)\>+/g,"");
                $ = cheerio.load(this.response);
                var x = $(".lyricbox")[0];
                var y = $(x).find("script").remove();
                var z = $(x).find("div").first().remove();
                console.log("########## lyricbox var x = "+ $(x).html());
                $(x).html();
                console.log(""+$(x).html());
            } 
            else 
            {
                reject(new Error("Status code was " + request.status));
            }
        }
        function onerror() {
            reject(new Error("Can't XHR " + JSON.stringify(url)));
        }
        function onprogress(event) {
            notify(event.loaded / event.total);
        }
    });
};

var writeArtistFileIndex = function(rootDir,fileName,tabIndexArtist){
    fs.writeFile(rootDir+fileName, tabIndexArtist, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
    
};

//Si le répertoire n'existe pas il est crée
var dirExistOrCreate = function(dir){
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, function (err) {
            console.log('failed to create directory', err);
        });
    }
};
//creer les répertoires des artistes avec les valeurs nom d'artiste recupéré sur lyricsWikia (valLinks)
//param 1 : répertoire ou seront les dossiers des artistes
//param 2 : href récupéré sur wiki, ex: "/wikia/ACDC"
//param 3 : Permet de supprimer une chaine de caractère d'un href, si non utile mettre :''
//param 4 : si les artites doivent être ou non indexés
var createDirArtist = function(dirArtist,valLinks,removeStr,isIndexed){
        var tabIndexArtist = []; // !!!!!! Faire promise pour retourner tabIndexArtist
        //les dossiers et fichiers ne peuvent contenir les caractères suivants:    
        //  \ / : * ? " < > | on utilise donc sanitize
        console.log("dirArtist = "+dirArtist);
        dirExistOrCreate(dirArtist);
        for(var i=0,len = valLinks.length; i<len;i++){
            var artistName = valLinks[i].replace(removeStr, "");
            var artistNameSanitize = sanitize(artistName)
            //Si le dernier char est un '.'
            if(artistNameSanitize.charAt(artistNameSanitize.length-1) == '.'){
                artistNameSanitize = sanitizeLastChar(artistName);
            }
            var dirOfAnArtist = path.join(dirArtist+"/"+artistNameSanitize);
            tabIndexArtist.push(artistName+':'+artistNameSanitize); //Pour crée l'index plus tard artistName:path/sanitize(artistName)
            dirExistOrCreate(dirOfAnArtist);
        }
        console.log("Directory created successfully !");
    return tabIndexArtist;
};
//Si on rencontre un probleme avec un char situé en fin de nom de dossier
//Ici le '.' situé en fin de dossier empêche la suppression du dossier
var sanitizeLastChar = function (sanitizeStr){
    while(sanitizeStr.charAt(sanitizeStr.length-1) == '.'){ 
        //on supprime le dernier caractère qui est un '.'
        sanitizeStr = sanitizeStr.substring(0, sanitizeStr.length-1) 
    }
    return sanitizeStr;
};


var getArtistFromCategorie = function(url,selector,attr){
    // La fonction de résolution est appelée avec la capacité de tenir ou de rompre la promesse
    var promise = new Promise(function(resolve, reject) { 
        request(url, function(err, resp, body){
            if (!err && resp.statusCode == 200) {
                var tLinks = [];
                $ = cheerio.load(body);
                var links = $(selector); //#mw-pages>.mw-content-ltr>table a[href]
                $(links).each(function(i, link){
                    tLinks.push($(link).attr(attr));//on récupére les #mw-pages>.mw-content-ltr>table a[href]
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

exports.getArtistFromCategorie      = getArtistFromCategorie;
exports.writeArtistFileIndex        = writeArtistFileIndex;
exports.getLyricsFromWikiaPageURL   = getLyricsFromWikiaPageURL;
exports.createDirArtist             = createDirArtist;