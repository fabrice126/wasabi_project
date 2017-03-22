import cheerio from 'cheerio';
import request from 'request';
import {
    db as dbConnect
} from 'mongoskin';
import {
    ObjectId
} from 'mongoskin';
import Artist from '../../model/Artist';
import Album from '../../model/Album';
import Song from '../../model/Song';
import config from '../conf/conf.json';
import util from './utilHandler'
const db = dbConnect('mongodb://localhost:27017/wasabi');

const COLLECTIONARTIST = config.database.collection_artist;
const COLLECTIONALBUM = config.database.collection_album;
const COLLECTIONSONG = config.database.collection_song;

//Permet de changer de page pour récupérer tout les noms d'artistes d'une catégorie (exemple catégorie des artistes commencant par la lettre A)        
var paramNextPage = "?pagefrom=";
//contient les liens des artistes de tout l'alphabet qui sont aussi les noms des répertoires sur le disque
var urlArtists = 'http://lyrics.wikia.com/wiki/Category:Artists_';
var selectorArtists = '#mw-pages>.mw-content-ltr>table a[href]';
var attrArtists = 'href'; //on récupérera dans allLinks les href du selector ci-dessus afin de créer les répertoires
var removeStrHrefArtists = '/wiki/';
var urlPageArtist = "http://lyrics.wikia.com/wiki/"; //On construira l'url suivant : http://lyrics.wikia.com/wiki/nomArtiste
var urlApiWikia = 'http://lyrics.wikia.com/api.php?func=getArtist&artist=';
var selectorAlbums = '.albums>li>a[href]:first-child';
var attrAlbums = 'href';
var selectorLyrics = 'div.lyricbox';
var selectorName = 'body>h3>a';
//Nous permet de créer une première arborescence en récupérerant toutes les lyrics d'un abum et tous les album d'un groupe
var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
var idxAlphabet = 0;
var self = this;
/**
 * Permet de recupérer les nom d'artiste sur les pages : http://lyrics.wikia.com/wiki/Category:Artists_A ou_B etc.
 * @param url : url de la page a récupérer
 * @returns {Promise}
 */
var getArtistFromCategorie = function (url) {
    // La fonction resolve est appelée avec la capacité de tenir ou de rompre la promesse
    var promise = new Promise(function (resolve, reject) {
        (function requestArtistFromCategorie(url) {
            //  /!\/!\/!\/!\/!\   Si dans l'avenir le nombre d'artiste sur la page de lyrics wikia (http://lyrics.wikia.com/wiki/Category:Artists_A) change ce parametre doit changer   /!\/!\/!\/!\/!\
            var nbArtistPerPage = 200;
            request(url, function (err, resp, body) {
                if (!err && resp.statusCode == 200) {
                    var tObjArtist = [];
                    $ = cheerio.load(body);
                    var links = $(selectorArtists); //#mw-pages>.mw-content-ltr>table a[href]
                    //Pour itérer sur toutes les pages d'un artiste commençant par une lettre il faut avoir un url de type :
                    //http://lyrics.wikia.com/wiki/Category:Artists_A?pagefrom=A+Pocket+Full+Of+Posers ou A+Pocket+Full+Of+Posers est le dernier title d'artiste de la page analysé
                    var artistPageFrom = $(links)[$(links).length - 1].attribs.title;
                    var nextPage = false;
                    $(links).each(function (i, link) {
                        //on récupére les #mw-pages>.mw-content-ltr>table a[href]
                        //Cette condition permet de ne pas remplir le dernier objet artist d'une page contenant 200 artists. Cet objet sera rempli lors de la reqête de changement de page
                        if (i < nbArtistPerPage - 1) {
                            //Création de l'objet artist, il faudra modifier cette objet si de nouvelles propriétés doivent être ajoutées
                            var objArtist = new Artist();
                            objArtist.name = $(link).attr('title');
                            objArtist.urlWikia = $(link).attr(attrArtists).replace(removeStrHrefArtists, "");
                            tObjArtist.push(objArtist);
                        }
                    });
                    if ($(links).length == nbArtistPerPage) {
                        nextPage = true;
                    }
                    var objResolve = {};
                    objResolve.tObjArtist = tObjArtist;
                    objResolve.artistPageFrom = artistPageFrom;
                    objResolve.nextPage = nextPage;
                    resolve(objResolve); //une fois le tObjArtist rempli resolve va indiquer que la promise s'est bien executée et va donc executer le then
                } else {
                    console.error('=====getArtistFromCategorie RELANCE DE LA REQUETE =====' + url);
                    console.error(new Error(err));
                    requestArtistFromCategorie(url);
                }
            });
        })(url);
    });
    return promise;
};

/**
 * Cette fonction est utilisée lors de l'ajout d'un nouvel artiste dans la base de données
 * @param urlApiWikia : Ce param correspond à l'url de l'api de lyrics wikia exemple : http://lyrics.wikia.com/api.php?func=getArtist&artist=Linkin_Park
 * @param objArtist : objet artiste que l'on remplira au fur et a mesure de l'execution
 * @returns {Promise}
 */
var getOneArtist = function (urlApiWikia, objArtist) {
    var promise = new Promise(function (resolve, reject) {
        (function requestInfoOneArtist(objArtist, selectorName) {
            request(urlApiWikia, function (err, resp, body) {
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
                    db.collection('artist').findOne({
                        name: objArtist.name
                    }, function (err, artist) {
                        if (err) throw err;
                        if (!artist) {
                            resolve(objResolve); //une fois le tObjArtist rempli resolve va indiquer que la promise s'est bien executée et va donc executer le then
                        } else {
                            console.log("Cet artiste existe déjà");
                            reject(objResolve);
                        }
                    });
                } else {
                    if (err != null) {
                        console.error('=====getOneArtist RELANCE DE LA REQUETE ===== ' + urlApiWikia);
                        requestInfoOneArtist(objArtist, selectorName);
                    }
                }
            });
        })(objArtist, selectorName);

    });
    return promise;
};
/**
 * Extraction des données sur les pages d'artistes de lyrics wikia
 * @param objArtist
 * @returns {Promise}
 */
var getInfosFromPageArtist = function (objArtist) {
    // La fonction de résolution est appelée avec la capacité de tenir ou de rompre la promesse
    var promise = new Promise(function (resolve, reject) {
        var urlArtist = urlPageArtist + objArtist.urlWikia;
        request(urlArtist, function (err, resp, body) {
            if (!err && resp.statusCode == 200) {
                var $ = cheerio.load(body);
                objArtist.urlWikipedia = util.fillField($("table.plainlinks a:contains('Wikipedia article')").attr('href'));
                objArtist.urlOfficialWebsite = util.fillField($("table.plainlinks a:contains('Official Website')").attr('href'));
                objArtist.urlFacebook = util.fillField($("table.plainlinks a:contains('Facebook Profile')").attr('href'));
                objArtist.urlMySpace = util.fillField($("table.plainlinks a:contains('MySpace Profile')").attr('href'));
                objArtist.urlTwitter = util.fillField($("table.plainlinks a:contains('Twitter Profile')").attr('href'));
                objArtist.genres = $("#mw-content-text>table div>ul>li>a[title^='Category:Genre/']").map(function () {
                    return util.fillField($(this).text());
                }).get();
                objArtist.labels = $("#mw-content-text>table div>ul>li>a[title^='Category:Label/']").map(function () {
                    return util.fillField($(this).text());
                }).get();
                objArtist.locationInfo = $("table.plainlinks a[title^='Category:Hometown/']").map(function () {
                    return $(this).text() != "" ? $(this).text().trim() : [];
                }).get();
                var tSelector = ['iTunes', 'Amazon', 'Spotify', 'allmusic', 'MusicBrainz', 'Discogs', 'YouTube', 'PureVolume', 'RateYourMusic', 'SoundCloud'];
                for (var i = 0; i < tSelector.length; i++) {
                    var selector = ".plainlinks:contains(" + tSelector[i] + ") a";
                    //Si la size est > 0 alors ce n'est pas un lien de recherche vers une page d'un des sites ci-dessous, si inférieur a 0, il n'y a pas de lien 
                    var size = $(selector).length - 1;
                    if (size == 0) {
                        var field = util.fillField($(selector)[size].attribs.href);
                        switch (tSelector[i]) {
                            case "iTunes":
                                objArtist.urlITunes = field;
                                break;
                            case "Amazon":
                                objArtist.urlAmazon = field;
                                break;
                            case "Spotify":
                                objArtist.urlSpotify = field;
                                break;
                            case "allmusic":
                                objArtist.urlAllmusic = field;
                                break;
                            case "MusicBrainz":
                                objArtist.urlMusicBrainz = new RegExp("artist").test(field) ? field : "";
                                break;
                            case "Discogs":
                                objArtist.urlDiscogs = field;
                                break;
                            case "YouTube":
                                objArtist.urlYouTube = field;
                                break;
                            case "PureVolume":
                                objArtist.urlPureVolume = field;
                                break;
                            case "RateYourMusic":
                                objArtist.urlRateYourMusic = field;
                                break;
                            case "SoundCloud":
                                objArtist.urlSoundCloud = field;
                                break;
                        }
                    }
                }
            }
            resolve(objArtist);
        });
    });
    return promise;
};

/**
 * Extraction des données sur les pages des albums de lyrics wikia
 * Fonction utilisé que lors de l'update de la collection album
 * @param objAlbum
 * @returns {Promise}
 */
var getInfosFromPageAlbum = function (objAlbum) {
    var promise = new Promise(function (resolve, reject) {
        request({
            url: objAlbum.urlAlbum,
            method: "GET",
            timeout: 20000
        }, function (err, resp, body) {
            if (!err && resp.statusCode == 200) {
                objAlbum = extractInfosAlbum(objAlbum, body);
            }
            resolve(objAlbum);
        });
    });
    return promise;
};
/**
 * Extraction des données sur les pages des musiques de lyrics wikia
 * Fonction utilisé que lors de l'update de la collection song
 * @param objSong
 * @returns {Promise}
 */
var getInfosFromPageSong = function (objSong) {
    var promise = new Promise(function (resolve, reject) {
        request({
            url: objSong.urlSong,
            method: "GET",
            timeout: 200000
        }, function (err, resp, body) {
            if (!err && resp.statusCode == 200) {
                objSong = extractInfosSong(objSong, body);
                resolve(objSong);
            } else {
                if (typeof resp != 'undefined')
                    console.log("REJECT ===========> " + resp.statusCode + " <=========== REJECT");
                reject(objSong);
            }
        });
    });
    return promise;
};

/**
 * Permet d'extraire les informations intéressantes d'une page d'un album sur lyrics wikia
 * @param objAlbum : l'objet album à remplir avec les informations du body de la page html d'une musique
 * @param body : le body de la page HTML d'une page de musique sur lyrics wikia exemple :  http://lyrics.wikia.com/wiki/Linkin_Park:Hybrid_Theory_(2000)
 * @returns {*}
 */
var extractInfosAlbum = function (objAlbum, body) {
    var $ = cheerio.load(body);
    objAlbum.genre = $("#mw-content-text>.plainlinks table tr:contains('Genre') td>a:last-child").html() != null ? $("#mw-content-text>.plainlinks table tr:contains('Genre') td>a:last-child").html() : "";
    objAlbum.length = $("#mw-content-text>.plainlinks table tr:contains('Length:') td:last-child").html() != null ? $("#mw-content-text>.plainlinks table tr:contains('Length:') td:last-child").html() : "";
    objAlbum.urlWikipedia = $("#mw-content-text>.plainlinks div>i>b>a:contains('Wikipedia')").attr('href') != null ? $("#mw-content-text>.plainlinks div>i>b>a:contains('Wikipedia')").attr('href') : "";
    var tSelector = ['iTunes', 'Amazon', 'Spotify', 'allmusic', 'MusicBrainz', 'Discogs'];
    for (var i = 0; i < tSelector.length; i++) {
        var selector = ".plainlinks:contains(" + tSelector[i] + ") a";
        //Si la taille est > 0 alors ce n'est pas un lien vers une page d'un des sites ci-dessous 
        var size = $(selector).length - 1;
        if (size == 0) {
            var field = util.fillField($(selector)[size].attribs.href);
            switch (tSelector[i]) {
                case "iTunes":
                    objAlbum.urlITunes = field;
                    break;
                case "Amazon":
                    objAlbum.urlAmazon = field;
                    break;
                case "Spotify":
                    objAlbum.urlSpotify = field;
                    break;
                case "allmusic":
                    objAlbum.urlAllmusic = field;
                    break;
                case "MusicBrainz":
                    objAlbum.urlMusicBrainz = field;
                    break;
                case "Discogs":
                    objAlbum.urlDiscogs = field;
                    break;
            }
        }
    }
    return objAlbum;
};
/**
 * Permet d'extraire les informations intéressantes d'une page musique de lyrics wikia
 * @param objSong : l'objet musique à remplir avec les informations du body de la page html d'une musique
 * @param body : le body de la page HTML d'une page de musique sur lyrics wikia exemple :  http://lyrics.wikia.com/wiki/Linkin_Park:A_Place_For_My_Head
 * @returns {*}
 */
var extractInfosSong = function (objSong, body) {
    $ = cheerio.load(body);
    var lyrics = $(selectorLyrics);
    $(lyrics).find("script").remove();
    $(lyrics).find(".lyricsbreak").remove();
    $(lyrics).contents().filter(function () {
        return this.nodeType == 8;
    }).remove();
    objSong.lyrics = $(lyrics).html() != null ? $(lyrics).html() : "";
    var srcYoutube = $("#mw-content-text .youtube").text();
    objSong.urlYouTube = srcYoutube != null ? srcYoutube.split('|')[0] : ""; // srcYoutube sera de ce style : wG5ilt3Hrt4|209|252
    objSong.urlWikipedia = $("#mw-content-text div:contains('Wikipedia') div>i>b>a.extiw").attr('href') != null ? $("#mw-content-text div:contains('Wikipedia') div>i>b>a.extiw").attr('href') : "";
    var tSelector = ['iTunes', 'Amazon', 'GoEar', 'Spotify', 'allmusic', 'MusicBrainz', 'Last.fm', 'Hype Machine', 'Pandora'];
    for (var i = 0; i < tSelector.length; i++) {
        var selector = ".plainlinks:contains(" + tSelector[i] + ") a";
        //Si la taille est > 0 alors ce n'est pas un lien vers une page d'un des sites ci-dessous 
        var size = $(selector).length - 1;
        if (size == 0) {
            var field = util.fillField($(selector)[size].attribs.href);

            switch (tSelector[i]) {
                case "iTunes":
                    objSong.urlITunes = field;
                    break;
                case "Amazon":
                    objSong.urlAmazon = field;
                    break;
                case "GoEar":
                    objSong.urlGoEar = field;
                    break;
                case "Spotify":
                    objSong.urlSpotify = field;
                    break;
                case "allmusic":
                    objSong.urlAllmusic = field;
                    break;
                case "MusicBrainz":
                    objSong.urlMusicBrainz = new RegExp("recording").test(field) ? field : "";
                    break;
                case "Last.fm":
                    objSong.urlLastFm = field;
                    break;
                case "Hype Machine":
                    objSong.urlHypeMachine = field;
                    break;
                case "Pandora":
                    objSong.urlPandora = field;
                    break;
            }
        }
    }
    return objSong;
};
/**
 * recupére les albums des artists via l'api de lyrics wikia
 * @param objArtist : tableau représentant l'objet Artist
 * @returns {Promise}
 */
var getAlbumsAndSongsOfArtist = function (objArtist) {
    var promise = new Promise(function (resolve, reject) {
        (function requestAlbumsAndSongs(objArtist) { //permet de relancer la requête si il y a un probleme
            var urlWikiaArtists = urlApiWikia + objArtist.urlWikia;
            request({
                pool: {
                    maxSockets: Infinity
                },
                url: urlWikiaArtists,
                method: "GET",
                timeout: 50000000
            }, function (err, resp, body) {
                if (!err && resp.statusCode == 200) {
                    $ = cheerio.load(body);
                    var tElts = $(".albums>li");
                    $(tElts).each(function (i, eltAlbum) {
                        var album = $(eltAlbum).find($(".albums>li>a[href]:first-child")).text();
                        var publicationDate = "";
                        if (album.lastIndexOf('_(') !== -1) { //Si il existe une date :
                            publicationDate = album.slice(album.lastIndexOf('_('), album.length);
                            album = album.replace(publicationDate, '');
                            publicationDate = publicationDate.substring(2, publicationDate.length - 1); //on passera de _(1995) à 1995 
                        }
                        var songs = []; //va contenir les objets objSong
                        $(eltAlbum).find($(".songs>li>a[href]")).each(function (ii, eltSong) {
                            //Création de l'objet song, il faudra modifier cette objet si de nouvelles propriétés doivent être ajoutées
                            var objSong = new Song();
                            objSong.title = $(eltSong).text();
                            objSong.urlSong = $(eltSong).attr(attrAlbums);
                            songs.push(objSong); //On met l'objet song dans le tableau contenant les autres musiques de l'album
                        });
                        //Création de l'objet album, il faudra modifier cette objet si de nouvelles propriétés doivent être ajoutées
                        var objAlbum = new Album();
                        objAlbum.title = album;
                        objAlbum.publicationDate = publicationDate;
                        objAlbum.urlAlbum = $(eltAlbum).find($(".albums>li>a[href]:first-child")).attr(attrAlbums);
                        objAlbum.songs = songs;
                        objArtist.albums.push(objAlbum); //on ajoute à l'ojet artiste l'objet album contenant le nom de l'album et ses musiques 
                    });
                    resolve(objArtist); //une fois le objArtist rempli resolve va indiquer que la promise s'est bien executée et va donc executer le then
                } else {
                    console.error('=====getAlbumsAndSongsOfArtist RELANCE DE LA REQUETE =====' + urlApiWikia);
                    console.error('=====getAlbumsAndSongsOfArtist RELANCE DE LA REQUETE =====' + objArtist.urlWikia);
                    console.error('=====getAlbumsAndSongsOfArtist RELANCE DE LA REQUETE =====' + attrAlbums);
                    requestAlbumsAndSongs(objArtist);
                }
            });
        })(objArtist);
    });
    return promise;
};

/**
 * Extraction des données sur les pages d'albums de lyrics wikia
 * @param objArtist
 * @returns {Promise}
 */
var getAllInfosAlbum = function (objArtist) {
    var promise = new Promise(function (resolve, reject) {
        var currNbAlbum = 0;
        var nbAlbum = objArtist.albums.length;
        for (var i = 0; i < nbAlbum; i++) {
            (function requestInfoAlbums(objArtist, i) {
                //On lance une requête sur la page de l'album afin de recupérer des informations
                request(objArtist.albums[i].urlAlbum, function (err, resp, body) {
                    currNbAlbum++;
                    if (!err && resp.statusCode == 200) {
                        objArtist.albums[i] = extractInfosAlbum(objArtist.albums[i], body);
                    } else {
                        if (err != null) {
                            console.error('=====getAllInfosAlbum RELANCE DE LA REQUETE =====' + objArtist.albums[i].title);
                            currNbAlbum--;
                            requestInfoAlbums(objArtist, i);
                        }
                    }
                    if (currNbAlbum == nbAlbum) {
                        resolve(objArtist);
                    }
                });
            })(objArtist, i);
        }
    });
    return promise;
};
/**
 * récupère le body des pages des musiques de lyrics wikia exemple :  http://lyrics.wikia.com/wiki/Linkin_Park:A_Place_For_My_Head
 * @param objArtist
 * @returns {Promise}
 */
var getAllLyricsOfArtists = function (objArtist) {
    var promise = new Promise(function (resolve, reject) {
        var nbTitre = 0;
        var currNbTitre = 0;
        for (var nbLoopAlbums = 0; nbLoopAlbums < objArtist.albums.length; nbLoopAlbums++) {
            nbTitre += objArtist.albums[nbLoopAlbums].songs.length;
        }
        var nbAlbums = 0;
        //            console.log("Nombre total de musique pour l'artiste = "+nbTitre+" album = "+objArtist.albums.length);
        //Si il n'y a pas de musique sur la page
        if (nbTitre > 0) {
            (function albumLoop(nbAlbums, objArtist) {
                //                    setTimeout(function(){
                if (nbAlbums < objArtist.albums.length) {
                    for (var nbLyrics = 0; nbLyrics < objArtist.albums[nbAlbums].songs.length; nbLyrics++) {
                        //on récupérer l'objet correspondant a la chanson 
                        //exemple : {"title" : "Heavy Mind","urlSong" : "http://lyrics.wikia.com/A_Dead_Silence:Heavy_Mind"}  
                        var currSong = objArtist.albums[nbAlbums].songs[nbLyrics];
                        var urlWikiaLyrics = currSong.urlSong;

                        (function getLyricsSongRequest(urlWikiaLyrics, nbAlbums, nbLyrics, objArtist) {
                            request({
                                pool: {
                                    maxSockets: Infinity
                                },
                                url: urlWikiaLyrics,
                                method: "GET",
                                timeout: 50000000
                            }, function (err, resp, body) {
                                currNbTitre++;
                                //                                        console.log("Musique "+currNbTitre+"                "+urlWikiaLyrics);
                                if (!err && resp.statusCode == 200) {
                                    objArtist.albums[nbAlbums].songs[nbLyrics] = extractInfosSong(objArtist.albums[nbAlbums].songs[nbLyrics], body);
                                } else {
                                    if (err != null) {
                                        console.error('=====getAllLyricsOfArtists RELANCE DE LA REQUETE =====' + objArtist.name);
                                        currNbTitre--;
                                        getLyricsSongRequest(urlWikiaLyrics, nbAlbums, nbLyrics, objArtist);
                                    }
                                }
                                if (currNbTitre == nbTitre) {
                                    resolve(objArtist);
                                }
                            });
                        })(urlWikiaLyrics, nbAlbums, nbLyrics, objArtist);
                    }
                    nbAlbums++;
                    albumLoop(nbAlbums, objArtist);
                }
                //                    }, Math.floor((Math.random() * 2500 ) + 500 ));
            })(nbAlbums, objArtist);
        } else {
            resolve(objArtist);
        }
    });
    return promise;
};
/**
 *
 * @param url
 * @param lettre
 * @param paramNextPage
 */
var fetchData = function (url, lettre, paramNextPage) {
    //Quand les artistes commencant par A sont récupérés (la requete ajax terminée) on entre dans le then
    setTimeout(function () {
        self.getArtistFromCategorie(url + lettre + paramNextPage).then(function (objArtist) {
            //objArtist.tObjArtist => tableau d'objet représentant les artists: [{ name: 'A Dying God', urlWikia: 'A_Dying_God', albums: [] },{objet2}, etc]
            console.log("objArtist.tObjArtist.length  ===" + objArtist.tObjArtist.length);
            var j = 0;
            getArtistDiscography(objArtist, url, lettre, j);
            console.log("fin de GET createdb");
        }).catch(function () {
            console.log("error Fin asynchrone");
        });
    }, Math.floor((Math.random() * 25500) + 15300));
};


/**
 *
 * @param newObjArtist: contient un tableau d'objet artiste  newObjArtist.tObjArtist[j] == un objet artiste
 * @param url
 * @param lettre
 * @param j : index de l'artiste à récupérer dans newObjArtist
 */
var getArtistDiscography = function (newObjArtist, url, lettre, j) {
    //On récupére les albums (musiques incluses) des artistes commencant par la lettre 'lettre'
    //Seul facon de faire pour simuler une boucle avec un timeout a chaque tour (settimout ne fonctionne pas dans une boucle) on appel donc cette fonction récusivement
    //    setTimeout(function(){
    console.log("En cours : " + newObjArtist.tObjArtist[j].name);
    //On envoie des requêtes sur l'API de Lyrics Wikia afin de récupérer le title des albums et des musiques
    self.getAlbumsAndSongsOfArtist(newObjArtist.tObjArtist[j]).then(function (objArtist) {
        //lorsque la requete ajax pour récupérer les artistes est terminé on obtient un objet
        //Nous allons maintenant ajouter dans objArtist les informations concernant l'artiste que nous allons récupérer sur la page de l'artiste
        self.getInfosFromPageArtist(objArtist).then(function (objArtist) {
            //Nous allons maintenant ajouter dans objArtist les informations concernant les albums de l'artiste,
            self.getAllInfosAlbum(objArtist).then(function (objArtist) {
                self.getAllLyricsOfArtists(objArtist).then(function (objArtist) {
                    //Quand on a traiter complétement une page d'artiste => albums avec ses musiques insérés en base de données, on passe a la page suivante
                    db.collection('artist').insert(objArtist, function (err, result) {
                        if (err) throw err;
                        if (result) {
                            console.log('Added =>' + objArtist.name);
                            //Si on veut ajouter un nouvel artist avec une base déjà crée
                            if (newObjArtist.insertArtist) {
                                console.log("DANS INSERT ARTIST");
                                self.embeddedToRelationalSchema(objArtist).then(function (objResolve) {
                                    console.log("--------------LES DOCUMENTS SONT BIEN ENREGISTRES--------------");
                                    //Lorsque le musiques sont ajoutées dans la collection song et que les albums sont aussi ajoutés dans la collection album alors:
                                    //on fait le wordCount :de l'artist, de chaque album, de chaque musique
                                });
                            }
                        }
                    });
                });
            });
        });
        //Mode asynchrone => le site ne semble pas bloquer les requêtes de l'inria
        //Si il reste des artistes a traiter dans une page : alors on passe a l'objet suivante newObjArtist.tObjArtist[j]
        if (j < newObjArtist.tObjArtist.length - 1) {
            j++;
            getArtistDiscography(newObjArtist, url, lettre, j);
        } else {
            console.log("\n\n\n\n ================== NEXT PAGE ================== \n\n\n\n")
            if (newObjArtist.nextPage) {
                fetchData(url, lettre, "?pagefrom=" + newObjArtist.artistPageFrom, selectorArtists, attrArtists, removeStrHrefArtists);
            } else {
                self.idxAlphabet++;
                if (self.idxAlphabet < alphabet.length) {
                    console.log("\n\n\n\n ================== Changement de categorie : lettre " + alphabet[self.idxAlphabet] + " ================== \n\n\n\n");
                    fetchData(url, alphabet[self.idxAlphabet], "?pagefrom=", selectorArtists, attrArtists, removeStrHrefArtists);
                }
            }
        }
    });
    //    }, Math.floor((Math.random() * 20000) + 10000));
};

/**
 * Permet d'envoyer une requête a chaque API utile à la construction d'un document (artist,album,song) complet
 * @param id d'un document artist, album, song
 * @param urlWikipedia d'un document artist, album, song
 */
//!\POUR UTILISER CETTE FONCTION VOUS DEVEZ PERMETTRE L'ACCES AU API : COMMENTER DANS APP.JS : app.use(basicAuth(login.login, login.password));
var checkAPI = function (id, collection, urlWikipedia) {
    //Lancer une requête vers l'API de elasticsearch afin d'y ajouter la musique /createdb/add/elasticsearch/song/id
    if (collection != COLLECTIONALBUM) {
        request("http://127.0.0.1/createdb/add/elasticsearch/" + collection + "/" + id, function (err, resp, body) {
            if (err) throw err;
            console.log("Added to elasticsearch: " + id);
        });
    }
    if (urlWikipedia != "") {
        //on lance une requete vers l'API extractdbpedia/add/song/id
        request("http://127.0.0.1/extractdbpedia/add/" + collection + "/" + id, function (err, resp, body) {
            if (err) throw err;
            console.log("Extract from dbpédia: " + id);
            //Seul la  collection peut possèder des attributs du RDF pour le moment et comme c'est grace a ces attributs qu'on peut définir si un document est un classique il est aussi dans cette condition
            if (collection == COLLECTIONSONG) {
                //dans le callback de la requête ci-dessus on lance une nouvelle requete vers l'API extractdbpedia/createfields/song/id
                request("http://127.0.0.1/extractdbpedia/createfields/song/" + id, function (err, resp, body) {
                    console.log("Extract createfields: " + id);
                    //dans le callback de la requête ci-dessus on lance une nouvelle requete vers l'API updatedb/song/isclassic/id
                    request("http://127.0.0.1/updatedb/song/isclassic/" + id, function (err, resp, body) {
                        console.log("Update isClassic: " + id);
                    });
                });
            }
        });
    }
};

/**
 * Lorsqu'on veut ajouter un nouvel artiste a la base de données, il faut transformer le document à inserer sous une forme relationel
 * @param objArtist : Un objet artist contenant des albums et des musiques
 */
//!\POUR UTILISER CETTE FONCTION VOUS DEVEZ PERMETTRE L'ACCES AU API : COMMENTER DANS APP.JS : app.use(basicAuth(login.login, login.password));
var embeddedToRelationalSchema = function (objArtist) {
    //Creation de la collection album
    return new Promise(function (resolve, reject) {
        var countNbSong = 0,
            totalInsertedSong = 0;
        db.collection('artist').findOne({
            name: objArtist.name
        }, function (err, artist) {
            if (err) throw err;
            if (!artist) {
                console.log("Erreur, aucun document trouvé dans la base de données"); //une fois le tObjArtist rempli resolve va indiquer que la promise s'est bien executée et va donc executer le then
            } else {
                console.log("Traitement embedded to relational schema");
                //On check les API pour ajouter les informations à l'artist
                checkAPI(artist._id, COLLECTIONARTIST, artist.urlWikipedia);
                for (var i = 0; i < artist.albums.length; i++) {
                    artist.albums[i].id_artist = artist._id;
                    artist.albums[i].name = artist.name;
                    artist.albums[i]._id = new ObjectId();
                    countNbSong += artist.albums[i].songs.length;
                    for (var j = 0; j < artist.albums[i].songs.length; j++) {
                        artist.albums[i].songs[j].name = artist.name;
                        artist.albums[i].songs[j].id_album = artist.albums[i]._id;
                        artist.albums[i].songs[j].position = j;
                        artist.albums[i].songs[j].albumTitle = artist.albums[i].title;
                        artist.albums[i].songs[j].lengthAlbum = artist.albums[i].length;
                        artist.albums[i].songs[j].publicationDateAlbum = artist.albums[i].publicationDate;
                        db.collection('song').insert(artist.albums[i].songs[j], function (err, song) {
                            totalInsertedSong += 1;
                            var song = song.ops[0];
                            //On check les API pour ajouter les informations à la song
                            checkAPI(song._id, COLLECTIONSONG, song.urlWikipedia);
                            if (countNbSong == totalInsertedSong) {
                                resolve();
                            }
                        });
                    }
                    delete artist.albums[i].songs;
                    db.collection('album').insert(artist.albums[i], function (err, album) {
                        var album = album.ops[0];
                        //On check les API pour ajouter les informations à l'album
                        checkAPI(album._id, COLLECTIONALBUM, album.urlWikipedia);
                    });
                }
            }
        });
        //suppression du champ albums dans la collection artist
        db.collection('artist').update({
            name: objArtist.name
        }, {
            $unset: {
                albums: 1
            }
        }, false, true);
        console.log("L'artiste " + objArtist.name + " a été transformé sous forme relationel");
    });
};

exports.getArtistFromCategorie = getArtistFromCategorie;
exports.getAlbumsAndSongsOfArtist = getAlbumsAndSongsOfArtist;
exports.getAllLyricsOfArtists = getAllLyricsOfArtists;
exports.getInfosFromPageArtist = getInfosFromPageArtist;
exports.getInfosFromPageAlbum = getInfosFromPageAlbum;
exports.getAllInfosAlbum = getAllInfosAlbum;
exports.fetchData = fetchData;
exports.getArtistDiscography = getArtistDiscography;
exports.getOneArtist = getOneArtist;
exports.embeddedToRelationalSchema = embeddedToRelationalSchema;

exports.paramNextPage = paramNextPage;
exports.urlArtists = urlArtists;
exports.selectorArtists = selectorArtists;
exports.attrArtists = attrArtists;
exports.removeStrHrefArtists = removeStrHrefArtists;
exports.urlPageArtist = urlPageArtist;
exports.urlApiWikia = urlApiWikia;
exports.selectorAlbums = selectorAlbums;
exports.attrAlbums = attrAlbums;
exports.selectorLyrics = selectorLyrics;
exports.alphabet = alphabet;
exports.idxAlphabet = idxAlphabet;
exports.selectorName = selectorName;
exports.getInfosFromPageSong = getInfosFromPageSong;