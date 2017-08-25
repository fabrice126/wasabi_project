import tor_request from 'tor-request';
import express from 'express';
import config from '../conf/conf';
import util from '../handler/utilHandler';
import cheerio from 'cheerio';
import mongoose from 'mongoose';
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
// var paramNextPage = "?pagefrom=";

var selectorArtists = '#mw-pages>.mw-content-ltr>table a[href]';
// var attrArtists = 'href'; //on récupérera dans allLinks les href du selector ci-dessus afin de créer les répertoires
// var removeStrHrefArtists = '/wiki/';
var urlPageArtist = "http://lyrics.wikia.com/wiki/"; //On construira l'url suivant : http://lyrics.wikia.com/wiki/nomArtiste
var urlApiWikia = 'http://lyrics.wikia.com/api.php?func=getArtist&artist=';
var selectorAlbums = '.albums>li>a[href]:first-child';
var attrAlbums = 'href';
var selectorLyrics = 'div.lyricbox';
var selectorName = 'body>h3>a';

exports.startExtraction = async(req, res) => {
    try {
        res.json("OK");
        // await getAllArtistsFromCategorie();
        var end = await getAllDiscographiesFromAPI();
        console.log(end);
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
            const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0-9'],
                categoryNextPage = "?page=";
            var idxAlphabet = 0;
            (async function loopAlphabet(idxAlphabet) {
                //contient les liens des artistes de tout l'alphabet qui sont aussi les noms des répertoires sur le disque
                var url = 'http://lyrics.wikia.com/wiki/Category:Artists_' + alphabet[idxAlphabet] + categoryNextPage;
                var totalPages = await getNbPageFromCategorie(url + "1");
                // if (!totalPages) totalPages = 1;
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
            if (!$("li>.paginator-page:last-child").last().attr("data-page")) totalPages = "1";
            else totalPages = $("li>.paginator-page:last-child").last().attr("data-page").trim() || "1";
            return resolve(totalPages);
        } catch (err) {
            console.error(err.code + ' ===== getNbPageFromCategorie ===== ' + url);
            return reject(err);
        }
    });
}
/**
 * 
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
var saveArtist = (oArtist) => {
    var query = {
        'name': oArtist.name
    };
    Artist.findOneAndUpdate(query, oArtist, {
        upsert: true,
        new: true,
    }, (err, updatedArtist) => {
        if (err) return console.error("------------------" + err.message + "------------------");
        // console.log("\tArtist added or updated = ", updatedArtist.name);
    });
}
var saveAlbum = (oAlbum) => {
    oAlbum.save((err, updatedAlbum) => {
        if (err) return console.error("------------------" + err.message + "------------------");
        // console.log("\tAlbum added or updated = ", updatedAlbum.name, updatedAlbum.title);
    });
}
var saveSong = (oSong) => {
    oSong.save((err, updatedSong) => {
        if (err) return console.error("------------------" + err.message + "------------------");
        // console.log("\t\tSong added or updated = ", updatedSong.name, updatedSong.albumTitle, updatedSong.title);
    });
}
////////////////////////////////////////////////////////////////////////////////////////
//--------------------await startExtraction.getAllDiscographiesFromAPI----------------//
////////////////////////////////////////////////////////////////////////////////////////

var getAllDiscographiesFromAPI = () => {
    return new Promise(async(resolve, reject) => {
        const limit = 500;
        var skip = 18000;
        (function loopArtistApi(skip) {
            console.log(`--------------------------------------SKIP = ${skip}--------------------------------------`);
            Artist.find({}).skip(skip).limit(limit).exec(async(err, tArtists) => {
                if (err) console.error('Error: getAllDiscographiesFromAPI = ', err.message);
                try {
                    for (var i = 0, l = tArtists.length; i < l; i++) {
                        var resolve = await getAPIAlbumsAndSongsOfArtist(tArtists[i]);
                        console.log((skip + i) + " - " + resolve);
                        resolve = null;
                    }
                } catch (error) {
                    console.error("'-------------", error.message);
                } finally {
                    //on arrive à la fin
                    if (tArtists.length < limit) return resolve("ok -> getAllDiscographiesFromAPI");
                    else loopArtistApi(skip += limit);
                }
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
            var url = urlApiWikia + oArtist.urlWikia;
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
                if (titleAlbum.lastIndexOf('_(') !== -1) { //S'il existe une date :
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
            return resolve(url);
        } catch (error) {
            console.error("Error: getAPIAlbumsAndSongsOfArtist", error, error.message)
        }
    });
};
/**
 * 
 * @param {*} url 
 */
var requestLyricsWikia = (url) => {
    return new Promise((resolve, reject) => {
        var nbTry = 0;
        (function requestProcess(url) {
            tor_request.request(url, {
                timeout: 60000
            }, (err, res, body) => {
                //Voir les condition de reject et resolve
                if (!err && res.statusCode == 200) return resolve(body);
                else {
                    if (nbTry == 5) {
                        return reject("Error: requestLyricsWikia", err.message, err.code);
                    }
                    nbTry++;
                    console.log("\tnbTry" + nbTry);
                    requestProcess(url);
                }
            });
        })(url)
    })
};

/**
 * We try if Tor is enabled. If so, our ip address has changed
 */
exports.tryTor = (req, res) => {
    //Change ip address 
    tor_request.renewTorSession((err) => {
        if (err) return console.error(err);
        requestLyricsWikia("https://api.ipify.org?format=json").then((body) => res.send(body), (err) => res.json(err));
    });
};