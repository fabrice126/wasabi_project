import tor_request from 'tor-request';
import request from 'request';
import express from 'express';
import config from '../conf/conf';
import util from '../handler/utilHandler';
import cheerio from 'cheerio';
import mongoose from 'mongoose';
import fs from 'fs';
import {
    ObjectId
} from 'mongoskin';
import Artist from '../../model/Artist.model';
import Album from '../../model/Album.model';
import Song from '../../model/Song.model';
const HOST_LYRICS_WIKIA = "http://lyrics.wikia.com/",
    COLLECTIONARTIST = config.database.collection_artist,
    COLLECTIONALBUM = config.database.collection_album,
    COLLECTIONSONG = config.database.collection_song;
//Permet de changer de page pour récupérer tout les noms d'artistes d'une catégorie (exemple catégorie des artistes commencant par la lettre A)        
var selectorArtists = '#mw-pages>.mw-content-ltr>table a[href]';
// var attrArtists = 'href'; //on récupérera dans allLinks les href du selector ci-dessus afin de créer les répertoires
// var removeStrHrefArtists = '/wiki/';
var selectorLyrics = 'div.lyricbox';
var selectorName = 'body>h3>a';

exports.elmahdiTestJoin = (req, res) => {

    req.db.collection(COLLECTIONARTIST).findOne({
        _id: ObjectId("56d93d84ce06f50c0fed8747")
    }, {
        name: 1
    }, (err, artist) => {
        req.db.collection(COLLECTIONALBUM).find({
            id_artist: artist._id
        }, {
            title: 1
        }).sort({
            "publicationDate": -1
        }).toArray((err, albums) => {
            let count = 0;
            artist.albums = albums;
            for (var i = 0; i < albums.length; i++) {
                req.db.collection(COLLECTIONSONG).find({
                    id_album: albums[i]._id
                }, {
                    albumTitle: 1,
                    title: 1,
                    position: 1
                }).sort({
                    "position": 1
                }).toArray((err, songs) => {
                    console.log("i = " + i);
                    artist.albums[i].songs = songs;
                    count++;
                    console.log("dans closure " + count);
                    if (count == albums.length) res.json(artist);
                })
            }
        })
    })

};

exports.elmahdiTestPromise = async function (req, res) {

    console.log(db.find("artist", {
        name: "Iron Maiden"
    })); // artist album song

    // console.log("benchmark = " + (Date.now() - start));
    // return res.json(tabArtists);
    //les artistes contenant leurs albums contenant leurs musiques
};
var oldEK = () => {
    //Appeler les APIs dans le tableau ci-dessous et les renvoyer dans un tableau d'artiste
    var api = "http://localhost/search/artist/",
        tArtists = ["Metallica", "Iron Maiden", "The Beatles", "Linkin Park", "The Rolling Stones", "Adele", "Akon", "Avicii", "Martin Garrix", "Steve Berman"];
    let tabArtists = [];
    var url;
    let count = 0;
    var start = Date.now();
    for (let i = 0; i < tArtists.length; i++) {
        if (i == 3) url = "http://localhost/search/artis/" + tArtists[i];
        else url = api + tArtists[i];
        // ekPromise(url, tabArtists, tArtists).then(function (content) {
        //     console.log(content);
        //     tabArtists.push(content);
        // }).catch(function (err) {
        //     console.dir(err);
        // }).then(() => {
        //     count++;
        //     if (tArtists.length == count) return res.json(tabArtists);
        // });
        //--------------------
        (async() => {
            try {
                var content = await ekPromise(url, tabArtists, tArtists);
                tabArtists.push(content);
            } catch (err) {
                console.dir(err);
            } finally {
                count++;
                if (tArtists.length == count) {
                    console.log("benchmark = " + (Date.now() - start));
                    return res.json(tabArtists);
                }
            }
        })()
    }
}
var ekPromise = function (_url, tabArtists, tArtists) {
    return new Promise(function (resolve, reject) {
        request(_url, function (error, response, body) {
            if (response.statusCode == 200) return resolve(JSON.parse(body).name);
            if (error) return reject(error);
            else reject();
        });
    })
};

exports.startExtraction = async(req, res) => {
    try {
        res.json("OK");
        // await getAllArtistsFromCategorie();
        //var end = await getAllDiscographiesFromAPI();
        // var endArtist = await getInfosFromAllPagesArtist();
        // console.log(endArtist);
        var endAlbum = await getInfosFromAllPagesAlbum();
        console.log(endAlbum);
    } catch (e) {
        console.error("-----------", e);
    }
}

////////////////////////////////////////////////////////////////////////////////////////
//--------------------await startExtraction.getAllArtistsFromCategorie----------------//
////////////////////////////////////////////////////////////////////////////////////////
var getAllArtistsFromCategorie = () => {
    return new Promise(async(resolve, reject) => {
        try {
            //Nous permet de créer une première arborescence en récupérerant toutes les lyrics d'un abum et tous les album d'un groupe
            const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0-9'];
            var idxAlphabet = 0;
            (async function loopAlphabet(idxAlphabet) {
                var url = 'http://lyrics.wikia.com/wiki/Category:Artists_' + alphabet[idxAlphabet] + '?page=';
                var totalPages = await getNbPageFromCategorie(url + "1");
                for (var idxCategoryPage = 1; idxCategoryPage <= totalPages; idxCategoryPage++) {
                    console.log("url = " + (url + idxCategoryPage));
                    var tObjArtist = await getArtistFromCategorie(url + idxCategoryPage);
                    for (var i = 0, l = tObjArtist.length; i < l; i++) saveArtist(tObjArtist[i]);
                }
                if (idxCategoryPage - 1 == totalPages && idxAlphabet == alphabet.length - 1) return resolve("Traitement getAllArtistsFromCategorie terminé");
                else loopAlphabet(++idxAlphabet);
            })(idxAlphabet);
        } catch (err) {
            console.error(err.code + ' ===== getAllArtistsFromCategorie ===== ' + url);
            return reject(err);
        }
    });
};
/**
 *
 * @param {*} url 
 */
var getNbPageFromCategorie = (url) => {
    return new Promise(async(resolve, reject) => {
        try {
            var body = await requestLyricsWikia(url);
            var $ = cheerio.load(body),
                totalPages;
            if (!$("li>.paginator-page").last().attr("data-page")) totalPages = "1";
            else totalPages = $("li>.paginator-page").last().attr("data-page").trim() || "1";
            return resolve(totalPages);
        } catch (err) {
            console.error(err.code + ' ===== getNbPageFromCategorie ===== ' + url);
            return reject(err);
        }
    });
}
/**
 * Get artist's name and urls from each page: http://lyrics.wikia.com/wiki/Category:Artists_A?page=1
 * @param {*} url 
 */
var getArtistFromCategorie = (url) => {
    return new Promise(async(resolve, reject) => {
        try {
            var body = await requestLyricsWikia(url);
            const $ = cheerio.load(body);
            var tObjArtist = [],
                links = $('#mw-pages>.mw-content-ltr>table a[href]');
            for (var i = 0, l = links.length; i < l; i++) {
                var link = links[i],
                    oArtist = new Artist();
                oArtist.name = $(link).attr('title');
                oArtist.urlWikia = $(link).attr('href').replace('/wiki/', "");
                tObjArtist.push(oArtist);
            }
            return resolve(tObjArtist);
        } catch (err) {
            console.error(err.code + ' ===== getArtistFromCategorie ===== ' + url);
            return reject(err);
        }
    });
};

////////////////////////////////////////////////////////////////////////////////////////
//--------------------await startExtraction.getAllDiscographiesFromAPI----------------//
////////////////////////////////////////////////////////////////////////////////////////

var getAllDiscographiesFromAPI = () => {
    return new Promise((resolve, reject) => {
        const limit = 100;
        var skip = 0;
        (function loopArtistApi(skip) {
            console.log(`--------------------------------------SKIP = ${skip}--------------------------------------`);
            Artist.find({}).skip(skip).limit(limit).exec((err, tArtists) => {
                if (err) console.error('Error: getAllDiscographiesFromAPI = ', err.message);
                var i = 0,
                    count = 0;
                console.log(tArtists.length);
                (function loop(i) {
                    setTimeout(async() => {
                        try {
                            var url = await getAPIAlbumsAndSongsOfArtist(tArtists[i]);
                        } catch (error) {
                            console.error("'-------------", error.message);
                        } finally {
                            count++;
                            console.log((skip + i) + " - " + (skip + count) + " - " + url);
                            //We processed artists from tArtists
                            if (count == tArtists.length) {
                                //We arrive at the end of artist collection
                                if (tArtists.length < limit) return resolve("ok -> getAllDiscographiesFromAPI");
                                else loopArtistApi(skip += limit);
                            }
                        }
                    }, 10 * i);
                    if (i < tArtists.length - 1) loop(++i);
                })(i);
            });
        })(skip)
    });
}
/**
 * 
 * @param {*} oArtist 
 */
var getAPIAlbumsAndSongsOfArtist = (oArtist) => {
    return new Promise(async(resolve, reject) => {
        try {
            var attrAlbums = 'href',
                selectorAlbums = '.albums>li>a[href]:first-child',
                url = "http://lyrics.wikia.com/api.php?func=getArtist&artist=" + oArtist.urlWikia;
            var body = await requestLyricsWikia(url);
            const $ = cheerio.load(body);
            var tEltAlbums = $(".albums>li");
            for (var i = 0, l = tEltAlbums.length; i < l; i++) {
                var eltAlbum = tEltAlbums[i];
                var oAlbum = new Album();
                oAlbum.name = oArtist.name;
                oAlbum.id_artist = mongoose.Types.ObjectId(oArtist._id);
                var titleAlbum = $(eltAlbum).find($(".albums>li>a[href]:first-child")).text();
                var publicationDate = "";
                if (titleAlbum.lastIndexOf('_(') !== -1) { //if a date exist e.g.: Ride The Lightning_(1984)
                    publicationDate = titleAlbum.slice(titleAlbum.lastIndexOf('_('), titleAlbum.length);
                    titleAlbum = titleAlbum.replace(publicationDate, '');
                    publicationDate = publicationDate.substring(2, publicationDate.length - 1); //on passera de _(1995) à 1995 
                }
                oAlbum.title = titleAlbum;
                oAlbum.publicationDate = publicationDate;
                oAlbum.urlAlbum = $(eltAlbum).find($(".albums>li>a[href]:first-child")).attr(attrAlbums);
                $(eltAlbum).find($(".songs>li>a[href]")).each(function (ii, eltSong) {
                    //Création de l'objet song, il faudra modifier cette objet si de nouvelles propriétés doivent être ajoutées
                    var oSong = new Song();
                    oSong.name = oArtist.name;
                    oSong.id_artist = oArtist._id;
                    oSong.id_album = oAlbum._id;
                    oSong.albumTitle = oAlbum.title;
                    oSong.publicationDateAlbum = oAlbum.publicationDate;
                    oSong.title = $(eltSong).text();
                    oSong.position = ii + 1;
                    oSong.urlSong = $(eltSong).attr(attrAlbums);
                    oAlbum.songs.push(oSong);
                });
                oArtist.albums.push(oAlbum);
            }
            saveArtist(oArtist);
        } catch (error) {
            console.error("Error: getAPIAlbumsAndSongsOfArtist", error, error.message)
        } finally {
            return resolve(url);
        }
    });
};
////////////////////////////////////////////////////////////////////////////////////////
//--------------------await startExtraction.getInfosFromAllPagesArtist----------------//
////////////////////////////////////////////////////////////////////////////////////////

var getInfosFromAllPagesArtist = () => {
    return new Promise((resolve, reject) => {
        let skip = 0,
            limit = 200;
        (function loop(skip) {
            console.log(`-----------------------------------getInfosFromAllPagesArtist-${skip}------------------------------------`);
            Artist.find({}).skip(skip).limit(limit).exec(async(err, tArtists) => {
                if (err) console.error('Error: getAllDiscographiesFromAPI = ', err.message);
                var cnt = 0,
                    nbArtist = tArtists.length;
                for (let i = 0; i < nbArtist; i++) {
                    (async() => {
                        try {
                            var oArtist = await getInfosFromPageArtist(tArtists[i]);
                        } catch (error) {
                            console.log("==================getInfosFromAllPagesArtist trycatch = " + oArtist.name, error);
                        } finally {
                            console.log(`${cnt}/${limit} => ${oArtist.name}`);
                            saveArtist(oArtist);
                            cnt++;
                            if (cnt == nbArtist) {
                                if (nbArtist != limit) return resolve("getInfosFromAllPagesArtist Terminé");
                                else loop(skip += limit);
                            };
                        }
                    })()
                }
            });
        })(skip);
    });
};
/**
 * extract informations from page artist
 * @param {*} objArtist 
 */
var getInfosFromPageArtist = (objArtist) => {
    return new Promise(async(resolve, reject) => {
        try {
            //On construira l'url suivant : http://lyrics.wikia.com/wiki/artistName
            let url = "http://lyrics.wikia.com/wiki/" + objArtist.urlWikia;
            var body = await requestLyricsWikia(url);
            extractInfosArtist(objArtist, body);
        } catch (error) {
            console.error("Error: getInfosFromPageArtist", error, objArtist.name);
        } finally {
            return resolve(objArtist);
        }
    });
};

var extractInfosArtist = (objArtist, body) => {
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
};
////////////////////////////////////////////////////////////////////////////////////////
//--------------------await startExtraction.getInfosFromAllPagesAlbum----------------//
////////////////////////////////////////////////////////////////////////////////////////
var getInfosFromAllPagesAlbum = () => {
    return new Promise((resolve, reject) => {
        let skip = 13000,
            limit = 100;
        (function loop(skip) {
            console.log(`-----------------------------------getInfosFromAllPagesAlbum-${skip}------------------------------------`);
            Artist.find({}).skip(skip).limit(limit).exec(async(err, tArtists) => {
                if (err) console.error('Error: getAllDiscographiesFromAPI = ', err.message);
                var cnt = 0,
                    nbArtist = tArtists.length;
                if (tArtists.length == 0) return resolve("getInfosFromAllPagesAlbum Terminé");
                for (let i = 0; i < nbArtist; i++) {
                    (async(i) => {
                        var oArtist = tArtists[i];
                        try {
                            oArtist = await getInfosFromPagesAlbums(oArtist);
                        } catch (error) {
                            console.log("==================getInfosFromAllPagesAlbum trycatch = " + oArtist.name, error);
                        } finally {
                            saveArtist(oArtist);
                            cnt++;
                            console.log(`${cnt}/${limit} => ${oArtist.name}`);
                            if (cnt == nbArtist) {
                                if (nbArtist != limit) return resolve("getInfosFromAllPagesAlbum Terminé");
                                else loop(skip += limit);
                            }
                        }
                    })(i)
                }
            });
        })(skip);
    });
}
/**
 * Permet d'extraire les informations intéressantes d'une page d'un album sur lyrics wikia
 * @param objAlbum : l'objet album à remplir avec les informations du body de la page html d'une musique
 * @param body : le body de la page HTML d'une page de musique sur lyrics wikia exemple :  http://lyrics.wikia.com/wiki/Linkin_Park:Hybrid_Theory_(2000)
 * @returns {*}
 */
var getInfosFromPagesAlbums = (oArtist) => {
    return new Promise((resolve, reject) => {
        var currNbAlbum = 0;
        var nbAlbum = oArtist.albums.length;
        if (nbAlbum == 0) return resolve(oArtist);
        for (var i = 0; i < nbAlbum; i++) {
            (async(i) => {
                let url = oArtist.albums[i].urlAlbum;
                try {
                    //On lance une requête sur la page de l'album afin de recupérer des informations
                    var body = await requestLyricsWikia(url);
                    console.error(`\trequest sent to: ${url}`);
                    extractInfosAlbum(oArtist.albums[i], body);
                } catch (error) {
                    // console.log("==================getInfosFromPagesAlbums trycatch = " + oArtist.name, error);
                } finally {
                    // console.log(`\t${url}`);
                    currNbAlbum++;
                    if (currNbAlbum == nbAlbum) resolve(oArtist);
                }
            })(i);
        }
    });
};
var extractInfosAlbum = (objAlbum, body) => {
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
}
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
var saveArtist = (oArtist) => {
    Artist.findOneAndUpdate({
        'name': oArtist.name
    }, oArtist, {
        upsert: true,
        new: true,
    }, (err, updatedArtist) => {
        if (err) return console.error("------------------" + err.message + "------------------");
    });
}
var saveAlbum = (oAlbum) => {
    oAlbum.save((err, updatedAlbum) => {
        if (err) return console.error("------------------" + err.message + "------------------");
    });
}
var saveSong = (oSong) => {
    oSong.save((err, updatedSong) => {
        if (err) return console.error("------------------" + err.message + "------------------");
    });
}
/**
 * 
 * @param {*} url 
 */
var requestLyricsWikia = (url) => {
    return new Promise((resolve, reject) => {
        var nbTry = 0;
        (function requestProcess(url) {
            // tor_request.renewTorSession((err) => {
            // if (err) console.error("Error: renewTorSession", err.errno, err.syscall, err.address, err.port, url);
            // tor_request.
            try {
                request(url, {
                    timeout: 20000
                }, (err, res, body) => {
                    //Voir les condition de reject et resolve
                    // console.log(res.statusCode);
                    if (!err && res.statusCode == 200) return resolve(body);
                    else if (err) {
                        if (nbTry == 5) return reject(`Error too many try: requestLyricsWikia = ${url} ${err}`);
                        nbTry++;
                        setTimeout(() => requestProcess(url), 1000);
                    } else {
                        return reject(`Error: requestLyricsWikia status : ${res.statusCode} ${url}`);
                    }
                });
            } catch (error) {
                console.log("_______________________________________________________________");
                console.log("______________CATCH requestLyricsWikia = " + error);
                console.log("_______________________________________________________________");
            }
            // });
        })(url)
    })
};

/**
 * We try if Tor is enabled. If so, our ip address has changed
 */
exports.tryTor = (req, res) => {
    //Change ip address 
    tor_request.renewTorSession(async(err) => {
        if (err) return console.error(err);
        //avant : requestLyricsWikia("https://api.ipify.org?format=json").then((body) => res.send(body), (err) => res.json(err));
        try {
            // resolve
            var body = await requestLyricsWikia("https://api.ipify.org?format=json"); // il s'agit d'un new Promise
            return res.send(body);
        } catch (error) {
            return res.json(err);
        }
    });
};