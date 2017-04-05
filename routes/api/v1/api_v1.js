import express from 'express';
import config from '../../conf/conf';
import request from 'request';
import {
    ObjectId
} from 'mongoskin';
const router = express.Router();
const COLLECTIONARTIST = config.database.collection_artist;
const COLLECTIONALBUM = config.database.collection_album;
const COLLECTIONSONG = config.database.collection_song;
const LIMIT = config.request.limit;




//==========================================================================================================================\\
//===========================API REST POUR RECUPERER LES MUSIQUES DE CHAQUE ALBUM DE CHAQUE ARTISTE=========================\\
//==========================================================================================================================\\
/**
 * @api {get} api/v1/artist_all/:start Get songs of each album of each artist
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/artist_all/72000
 * @apiVersion 1.0.0
 * @apiName GetArtistsWithAlbumsAndSongs
 * @apiGroup Api/v1
 * @apiDescription This api return the first 200 artist documents 
 *                 for instance wasabi.i3s.unice.fr/api/v1/artist_all/72000 will return all artists between [72000 and 72200[ 
 *
 * @apiParam {Number} start Where we want to start the extraction, there are currently 77492 artists in our database .
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    [{
        "_id": "56d93d84ce06f50c0fed8747",
        "name": "Metallica",
        "urlWikipedia": "http://en.wikipedia.org/wiki/Metallica",
        "urlOfficialWebsite": "http://www.metallica.com/",
        "urlFacebook": "http://www.facebook.com/metallica",
        "urlMySpace": "https://myspace.com/Metallica",
        "urlTwitter": "http://twitter.com/metallica",
        "locationInfo": ["United States", "California", "Los Angeles"],
        "urlWikia": "Metallica",
        "genres": ["Heavy Metal", "Thrash Metal"],
        "labels": ["Elektra", "Megaforce Records", "Mercury Records", "Warner Bros. Records"],
        "members": [{
            "id_member_musicbrainz": "118ba687-ad7f-4c28-9355-67e14b18baeb",
            "name": "Ron McGovney",
            "instruments": [
                "bass guitar"
            ],
            "begin": "1982",
            "end": "1982",
            "ended": true,
            "disambiguation": "",
            "type": "member of band"
        }],
        "urlAmazon": "http://www.amazon.com/asdf/e/B000APEBQY?tag=wikia-20",
        "urlITunes": "https://itunes.apple.com/us/artist/id3996865",
        "urlAllmusic": "http://www.allmusic.com/artist/mn0000446509",
        "urlDiscogs": "http://www.discogs.com/artist/18839",
        "urlMusicBrainz": "http://musicbrainz.org/artist/65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "urlYouTube": "https://www.youtube.com/user/MetallicaTV",
        "urlSpotify": "https://play.spotify.com/artist/2ye2Wgw4gimLv2eAKyk1NB",
        "urlPureVolume": "http://www.purevolume.com/metallica",
        "urlRateYourMusic": "http://rateyourmusic.com/artist/metallica",
        "urlSoundCloud": "http://soundcloud.com/loureedmetallica",
        "id_artist_musicbrainz": "65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "disambiguation": "",
        "type": "Group",
        "lifeSpan": {
            "ended": false,
            "begin": "1981-10",
            "end": ""
        },
        "location": {
            "id_city_musicbrainz": "1f40c6e1-47ba-4e35-996f-fe6ee5840e62",
            "country": "United States",
            "city": "Los Angeles"
        },
        "gender": "",
        "endArea": {
            "id": "",
            "name": "",
            "disambiguation": ""
        },
        "albums": [{
            "_id": "5714debe25ac0d8aee36b662",
            "name": "Metallica",
            "title": "Kill 'Em All",
            "publicationDate": "1983",
            "urlWikipedia": "http://en.wikipedia.org/wiki/Kill_%27Em_All",
            "genre": "Thrash Metal",
            "length": "51:14",
            "urlAlbum": "http://lyrics.wikia.com/Metallica:Kill_%27Em_All_%281983%29",
            "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB000002H33%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
            "urlITunes": "https://itunes.apple.com/us/album/id278129100",
            "urlAllmusic": "http://www.allmusic.com/album/mw0000667490",
            "urlDiscogs": "http://www.discogs.com/release/367423",
            "urlMusicBrainz": "http://musicbrainz.org/release/fed37cfc-2a6d-4569-9ac0-501a7c7598eb",
            "urlSpotify": "https://play.spotify.com/album/41bTjcSaiEe4G40RVVHbux",
            "id_artist": "56d93d84ce06f50c0fed8747",
            "songs": [{
                "_id": "5714dedb25ac0d8aee4ad800",
                "position": 0,
                "title": "Hit The Lights",
                "urlSong": "http://lyrics.wikia.com/Metallica:Hit_The_Lights",
                "lyrics": "No life till leather, we&apos;re gonna kick some ass tonight We got the metal madness...",
                "urlWikipedia": "",
                "id_album": "5714debe25ac0d8aee36b662",
                "urlYouTube": "",
                "isClassic": false,
                "multitrack_path": "M Multitracks/Metallica - Hit The Lights",
                "urlITunes": "https://itunes.apple.com/us/album/id167352861?i=167352894",
                "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00122D6X8%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
                "urlGoEar": "http://goear.com/listen.php?v=41b192c",
                "urlSpotify": "https://play.spotify.com/track/4Pn6l1ZzsYFrx64h1gWTyy",
                "urlAllmusic": "http://www.allmusic.com/song/mt0034723664",
                "urlMusicBrainz": "http://musicbrainz.org/recording/8467f4e7-ef5b-458c-bbc5-6727d9f2252d"
            }, {
                "_id": "5714dedb25ac0d8aee4ad801",
                "position": 1,
                "title": "The Four Horsemen",
                "urlSong": "http://lyrics.wikia.com/Metallica:The_Four_Horsemen",
                "lyrics": "By the last breath, the fourth winds blow Better raise your ears...",
                "urlWikipedia": "http://en.wikipedia.org/wiki/The_Mechanix",
                "id_album": "5714debe25ac0d8aee36b662",
                "format": [],
                "genre": ["Thrash metal", "Speed metal"],
                "producer": ["Dave Mustaine"],
                "recordLabel": ["Combat Records"],
                "writer": [],
                "recorded": ["December 1984 – January 1985 at Indigo Ranch Studios in Malibu, California"],
                "abstract": "Killing Is My Business... and Business Is Good! is the debut studio album by American thrash metal band Megadeth. It was released on June 12, 1985...",
                "releaseDate": ["1985-06-12"],
                "runtime": ["1870.0"],
                "award": [],
                "subject": ["1985 debut albums", "Megadeth albums", "Combat Records albums"],
                "urlYouTube": "",
                "isClassic": false,
                "urlITunes": "https://itunes.apple.com/us/album/id167352861?i=167352995",
                "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00122D6ZG%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
                "urlGoEar": "http://goear.com/listen.php?v=2bc44cf",
                "urlAllmusic": "http://www.allmusic.com/song/mt0010502640",
                "urlMusicBrainz": "http://musicbrainz.org/recording/20826102-147b-4376-a1f3-72c25bfd43cd"
            }]
        }]
    }]
 * @apiError error isn't a number or is negative.
 * @apiErrorExample Error-Response:
    HTTP/1.1 404 Not Found
    {
        "error": "Page not found"
    }
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */
router.get('/artist_all/:start', function (req, res, next) {
    var db = req.db,
        start = Number.parseInt(req.params.start),
        cntAlbum = 0,
        cntArtist = 0,
        nbAlbum = 0;
    if (!Number.isInteger(start) || start < 0) {
        return res.status(404).json(config.http.error.global_404);
    }
    db.collection(COLLECTIONARTIST).find({}, {
        wordCount: 0,
        rdf: 0
    }).skip(start).limit(LIMIT).toArray((err, artists) => {
        if (err) {
            return res.status(404).json(config.http.error.internal_error_404);
        }
        for (var i = 0, l = artists.length; i < l; i++) {
            (function (i) {
                db.collection(COLLECTIONALBUM).find({
                    id_artist: artists[i]._id
                }, {
                    wordCount: 0,
                    rdf: 0
                }).toArray((err, albums) => {
                    if (err) {
                        return res.status(404).json(config.http.error.internal_error_404);
                    }
                    cntArtist++;
                    nbAlbum += albums.length;
                    artists[i].albums = albums;
                    //Si le dernier artist ne possède pas d'album alors on retourne ici le resultat car il ne pourra pas entrer dans le callback de la collection song ci-dessous
                    for (var j = 0, k = albums.length; j < k; j++) {
                        (function (j) {
                            db.collection(COLLECTIONSONG).find({
                                id_album: albums[j]._id
                            }, {
                                wordCount: 0,
                                rdf: 0,
                                name: 0,
                                albumTitle: 0,
                                publicationDateAlbum: 0,
                                lengthAlbum: 0
                            }).toArray((err, songs) => {
                                if (err) {
                                    return res.status(404).json(config.http.error.internal_error_404);
                                }
                                artists[i].albums[j].songs = songs;
                                cntAlbum++;
                                if (cntArtist == artists.length && cntAlbum == nbAlbum) {
                                    return res.json(artists);
                                }
                            });
                        })(j);
                    }
                });
            })(i);
        }
    });
});

//==========================================================================================================================\\
//=====================API REST POUR RECUPERER LES MUSIQUES DE CHAQUE ALBUM D'UN ARTISTE PAR ID D'ARTIST====================\\
//==========================================================================================================================\\
/**
 * @api {get} api/v1/artist_all/id/:id Get songs of each album of the artist having this id
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/artist_all/id/56d93d84ce06f50c0fed8747
 * @apiVersion 1.0.0
 * @apiName GetArtistByIdWithAlbumsAndSongs
 * @apiGroup Api/v1

 * @apiParam {Number} id artist's id
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    {
        "_id": "56d93d84ce06f50c0fed8747",
        "name": "Metallica",
        "urlWikipedia": "http://en.wikipedia.org/wiki/Metallica",
        "urlOfficialWebsite": "http://www.metallica.com/",
        "urlFacebook": "http://www.facebook.com/metallica",
        "urlMySpace": "https://myspace.com/Metallica",
        "urlTwitter": "http://twitter.com/metallica",
        "locationInfo": ["United States", "California", "Los Angeles"],
        "urlWikia": "Metallica",
        "genres": ["Heavy Metal", "Thrash Metal"],
        "labels": ["Elektra", "Megaforce Records", "Mercury Records", "Warner Bros. Records"],
        "members": [{
            "id_member_musicbrainz": "118ba687-ad7f-4c28-9355-67e14b18baeb",
            "name": "Ron McGovney",
            "instruments": [
                "bass guitar"
            ],
            "begin": "1982",
            "end": "1982",
            "ended": true,
            "disambiguation": "",
            "type": "member of band"
        }],
        "urlAmazon": "http://www.amazon.com/asdf/e/B000APEBQY?tag=wikia-20",
        "urlITunes": "https://itunes.apple.com/us/artist/id3996865",
        "urlAllmusic": "http://www.allmusic.com/artist/mn0000446509",
        "urlDiscogs": "http://www.discogs.com/artist/18839",
        "urlMusicBrainz": "http://musicbrainz.org/artist/65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "urlYouTube": "https://www.youtube.com/user/MetallicaTV",
        "urlSpotify": "https://play.spotify.com/artist/2ye2Wgw4gimLv2eAKyk1NB",
        "urlPureVolume": "http://www.purevolume.com/metallica",
        "urlRateYourMusic": "http://rateyourmusic.com/artist/metallica",
        "urlSoundCloud": "http://soundcloud.com/loureedmetallica",
        "id_artist_musicbrainz": "65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "disambiguation": "",
        "type": "Group",
        "lifeSpan": {
            "ended": false,
            "begin": "1981-10",
            "end": ""
        },
        "location": {
            "id_city_musicbrainz": "1f40c6e1-47ba-4e35-996f-fe6ee5840e62",
            "country": "United States",
            "city": "Los Angeles"
        },
        "gender": "",
        "endArea": {
            "id": "",
            "name": "",
            "disambiguation": ""
        },
        "albums": [{
            "_id": "5714debe25ac0d8aee36b662",
            "name": "Metallica",
            "title": "Kill 'Em All",
            "publicationDate": "1983",
            "urlWikipedia": "http://en.wikipedia.org/wiki/Kill_%27Em_All",
            "genre": "Thrash Metal",
            "length": "51:14",
            "urlAlbum": "http://lyrics.wikia.com/Metallica:Kill_%27Em_All_%281983%29",
            "id_artist": "56d93d84ce06f50c0fed8747",
            "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB000002H33%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
            "urlITunes": "https://itunes.apple.com/us/album/id278129100",
            "urlAllmusic": "http://www.allmusic.com/album/mw0000667490",
            "urlDiscogs": "http://www.discogs.com/release/367423",
            "urlMusicBrainz": "http://musicbrainz.org/release/fed37cfc-2a6d-4569-9ac0-501a7c7598eb",
            "urlSpotify": "https://play.spotify.com/album/41bTjcSaiEe4G40RVVHbux",
            "songs": [{
                "_id": "5714dedb25ac0d8aee4ad800",
                "position": 0,
                "title": "Hit The Lights",
                "urlSong": "http://lyrics.wikia.com/Metallica:Hit_The_Lights",
                "lyrics": "No life till leather, we&apos;re gonna kick some ass tonight We got the metal madness...",
                "urlWikipedia": "",
                "id_album": "5714debe25ac0d8aee36b662",
                "urlYouTube": "",
                "isClassic": false,
                "multitrack_path": "M Multitracks/Metallica - Hit The Lights",
                "urlITunes": "https://itunes.apple.com/us/album/id167352861?i=167352894",
                "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00122D6X8%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
                "urlGoEar": "http://goear.com/listen.php?v=41b192c",
                "urlSpotify": "https://play.spotify.com/track/4Pn6l1ZzsYFrx64h1gWTyy",
                "urlAllmusic": "http://www.allmusic.com/song/mt0034723664",
                "urlMusicBrainz": "http://musicbrainz.org/recording/8467f4e7-ef5b-458c-bbc5-6727d9f2252d"
            }, {
                "_id": "5714dedb25ac0d8aee4ad801",
                "position": 1,
                "title": "The Four Horsemen",
                "urlSong": "http://lyrics.wikia.com/Metallica:The_Four_Horsemen",
                "lyrics": "By the last breath, the fourth winds blow Better raise your ears...",
                "urlWikipedia": "http://en.wikipedia.org/wiki/The_Mechanix",
                "id_album": "5714debe25ac0d8aee36b662",
                "format": [],
                "genre": ["Thrash metal", "Speed metal"],
                "producer": ["Dave Mustaine"],
                "recordLabel": ["Combat Records"],
                "writer": [],
                "recorded": ["December 1984 – January 1985 at Indigo Ranch Studios in Malibu, California"],
                "abstract": "Killing Is My Business... and Business Is Good! is the debut studio album by American thrash metal band Megadeth. It was released on June 12, 1985...",
                "releaseDate": ["1985-06-12"],
                "runtime": ["1870.0"],
                "award": [],
                "subject": ["1985 debut albums", "Megadeth albums", "Combat Records albums"],
                "urlYouTube": "",
                "isClassic": false,
                "urlITunes": "https://itunes.apple.com/us/album/id167352861?i=167352995",
                "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00122D6ZG%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
                "urlGoEar": "http://goear.com/listen.php?v=2bc44cf",
                "urlAllmusic": "http://www.allmusic.com/song/mt0010502640",
                "urlMusicBrainz": "http://musicbrainz.org/recording/20826102-147b-4376-a1f3-72c25bfd43cd"
            }]
        }]
    }
 * @apiError error The id is not valid.
 * @apiErrorExample Error-Response invalid ObjectId:
    HTTP/1.1 404 Not Found
    {
        "error": "You must type a valid ObjectId"
    }
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */
router.get('/artist_all/id/:id', function (req, res, next) {
    var db = req.db,
        id = req.params.id,
        cnt = 0;
    if (!ObjectId.isValid(id)) {
        return res.status(404).json(config.http.error.objectid_404);
    }
    db.collection(COLLECTIONARTIST).findOne({
        _id: new ObjectId(id)
    }, {
        wordCount: 0,
        rdf: 0
    }, (err, artist) => {
        if (err || !artist) {
            return res.status(404).json(config.http.error.internal_error_404);
        }
        db.collection(COLLECTIONALBUM).find({
            id_artist: artist._id
        }, {
            wordCount: 0,
            rdf: 0
        }).toArray((err, albums) => {
            if (err) {
                return res.status(404).json(config.http.error.internal_error_404);
            }
            artist.albums = albums;
            //si il n'y a aucun album on retourne l'artiste
            if (!artist.albums.length) {
                console.log("RETOURNE JSON");
                return res.json(artist);
            }
            for (var i = 0, l = albums.length; i < l; i++) {
                (function (i) {
                    db.collection(COLLECTIONSONG).find({
                        id_album: albums[i]._id
                    }, {
                        wordCount: 0,
                        rdf: 0,
                        name: 0,
                        albumTitle: 0,
                        publicationDateAlbum: 0,
                        lengthAlbum: 0
                    }).toArray((err, songs) => {
                        if (err) {
                            return res.status(404).json(config.http.error.internal_error_404);
                        }
                        artist.albums[i].songs = songs;
                        cnt++;
                        if (cnt == artist.albums.length) {
                            return res.send(artist);
                        }
                    });
                })(i);
            }
        });
    });
});
//==========================================================================================================================\\
//====================API REST POUR RECUPERER LES MUSIQUES DE CHAQUE ALBUM D'UN ARTISTE PAR NOM D'ARTISTE===================\\
//==========================================================================================================================\\
/**
 * @api {get} api/v1/artist_all/name/:name Get songs of each album of the artist having this name
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/artist_all/name/Metallica
 * @apiVersion 1.0.0
 * @apiName GetArtistByNameWithAlbumsAndSongs
 * @apiGroup Api/v1

 * @apiParam {String} name artist's name
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    {
        "_id": "56d93d84ce06f50c0fed8747",
        "name": "Metallica",
        "urlWikipedia": "http://en.wikipedia.org/wiki/Metallica",
        "urlOfficialWebsite": "http://www.metallica.com/",
        "urlFacebook": "http://www.facebook.com/metallica",
        "urlMySpace": "https://myspace.com/Metallica",
        "urlTwitter": "http://twitter.com/metallica",
        "locationInfo": ["United States", "California", "Los Angeles"],
        "urlWikia": "Metallica",
        "genres": ["Heavy Metal", "Thrash Metal"],
        "labels": ["Elektra", "Megaforce Records", "Mercury Records", "Warner Bros. Records"],
        "members": [{
            "id_member_musicbrainz": "118ba687-ad7f-4c28-9355-67e14b18baeb",
            "name": "Ron McGovney",
            "instruments": [
                "bass guitar"
            ],
            "begin": "1982",
            "end": "1982",
            "ended": true,
            "disambiguation": "",
            "type": "member of band"
        }],
        "urlAmazon": "http://www.amazon.com/asdf/e/B000APEBQY?tag=wikia-20",
        "urlITunes": "https://itunes.apple.com/us/artist/id3996865",
        "urlAllmusic": "http://www.allmusic.com/artist/mn0000446509",
        "urlDiscogs": "http://www.discogs.com/artist/18839",
        "urlMusicBrainz": "http://musicbrainz.org/artist/65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "urlYouTube": "https://www.youtube.com/user/MetallicaTV",
        "urlSpotify": "https://play.spotify.com/artist/2ye2Wgw4gimLv2eAKyk1NB",
        "urlPureVolume": "http://www.purevolume.com/metallica",
        "urlRateYourMusic": "http://rateyourmusic.com/artist/metallica",
        "urlSoundCloud": "http://soundcloud.com/loureedmetallica",
        "id_artist_musicbrainz": "65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "disambiguation": "",
        "type": "Group",
        "lifeSpan": {
            "ended": false,
            "begin": "1981-10",
            "end": ""
        },
        "location": {
            "id_city_musicbrainz": "1f40c6e1-47ba-4e35-996f-fe6ee5840e62",
            "country": "United States",
            "city": "Los Angeles"
        },
        "gender": "",
        "endArea": {
            "id": "",
            "name": "",
            "disambiguation": ""
        },
        "albums": [{
            "_id": "5714debe25ac0d8aee36b662",
            "name": "Metallica",
            "title": "Kill 'Em All",
            "publicationDate": "1983",
            "urlWikipedia": "http://en.wikipedia.org/wiki/Kill_%27Em_All",
            "genre": "Thrash Metal",
            "length": "51:14",
            "urlAlbum": "http://lyrics.wikia.com/Metallica:Kill_%27Em_All_%281983%29",
            "id_artist": "56d93d84ce06f50c0fed8747",
            "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB000002H33%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
            "urlITunes": "https://itunes.apple.com/us/album/id278129100",
            "urlAllmusic": "http://www.allmusic.com/album/mw0000667490",
            "urlDiscogs": "http://www.discogs.com/release/367423",
            "urlMusicBrainz": "http://musicbrainz.org/release/fed37cfc-2a6d-4569-9ac0-501a7c7598eb",
            "urlSpotify": "https://play.spotify.com/album/41bTjcSaiEe4G40RVVHbux",
            "songs": [{
                "_id": "5714dedb25ac0d8aee4ad800",
                "position": 0,
                "title": "Hit The Lights",
                "urlSong": "http://lyrics.wikia.com/Metallica:Hit_The_Lights",
                "lyrics": "No life till leather, we&apos;re gonna kick some ass tonight We got the metal madness...",
                "urlWikipedia": "",
                "id_album": "5714debe25ac0d8aee36b662",
                "urlYouTube": "",
                "isClassic": false,
                "multitrack_path": "M Multitracks/Metallica - Hit The Lights",
                "urlITunes": "https://itunes.apple.com/us/album/id167352861?i=167352894",
                "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00122D6X8%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
                "urlGoEar": "http://goear.com/listen.php?v=41b192c",
                "urlSpotify": "https://play.spotify.com/track/4Pn6l1ZzsYFrx64h1gWTyy",
                "urlAllmusic": "http://www.allmusic.com/song/mt0034723664",
                "urlMusicBrainz": "http://musicbrainz.org/recording/8467f4e7-ef5b-458c-bbc5-6727d9f2252d"
            }, {
                "_id": "5714dedb25ac0d8aee4ad801",
                "position": 1,
                "title": "The Four Horsemen",
                "urlSong": "http://lyrics.wikia.com/Metallica:The_Four_Horsemen",
                "lyrics": "By the last breath, the fourth winds blow Better raise your ears...",
                "urlWikipedia": "http://en.wikipedia.org/wiki/The_Mechanix",
                "id_album": "5714debe25ac0d8aee36b662",
                "format": [],
                "genre": ["Thrash metal", "Speed metal"],
                "producer": ["Dave Mustaine"],
                "recordLabel": ["Combat Records"],
                "writer": [],
                "recorded": ["December 1984 – January 1985 at Indigo Ranch Studios in Malibu, California"],
                "abstract": "Killing Is My Business... and Business Is Good! is the debut studio album by American thrash metal band Megadeth. It was released on June 12, 1985...",
                "releaseDate": ["1985-06-12"],
                "runtime": ["1870.0"],
                "award": [],
                "subject": ["1985 debut albums", "Megadeth albums", "Combat Records albums"],
                "urlYouTube": "",
                "isClassic": false,
                "urlITunes": "https://itunes.apple.com/us/album/id167352861?i=167352995",
                "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00122D6ZG%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
                "urlGoEar": "http://goear.com/listen.php?v=2bc44cf",
                "urlAllmusic": "http://www.allmusic.com/song/mt0010502640",
                "urlMusicBrainz": "http://musicbrainz.org/recording/20826102-147b-4376-a1f3-72c25bfd43cd"
            }]
        }]
    }
 * @apiError error The id is not valid.
 * @apiErrorExample Error-Response invalid ObjectId:
    HTTP/1.1 404 Not Found
    {
        "error": "You must type a valid ObjectId"
    }
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */
router.get('/artist_all/name/:name', function (req, res, next) {
    var db = req.db,
        name = req.params.name,
        cnt = 0;
    db.collection(COLLECTIONARTIST).findOne({
        name: name
    }, {
        wordCount: 0,
        rdf: 0
    }, (err, artist) => {
        //si il y a une erreur ou que l'artiste n'existe pas on retourne une erreur
        if (err || !artist) {
            return res.status(404).json(config.http.error.internal_error_404);
        }
        db.collection(COLLECTIONALBUM).find({
            id_artist: artist._id
        }, {
            wordCount: 0,
            rdf: 0
        }).toArray((err, albums) => {
            if (err) {
                return res.status(404).json(config.http.error.internal_error_404);
            }
            artist.albums = albums;
            //si un artist n'a pas d'album alors on envoie l'objet artist contenant les infos de l'artiste et ayant un tableau artist.albums == []
            if (!artist.albums.length) {
                return res.json(artist);
            }
            for (var i = 0, l = albums.length; i < l; i++) {
                (function (i) {
                    db.collection(COLLECTIONSONG).find({
                        id_album: albums[i]._id
                    }, {
                        wordCount: 0,
                        rdf: 0,
                        name: 0,
                        albumTitle: 0,
                        publicationDateAlbum: 0,
                        lengthAlbum: 0
                    }).toArray((err, songs) => {
                        if (err) {
                            return res.status(404).json(config.http.error.internal_error_404);
                        }
                        artist.albums[i].songs = songs;
                        cnt++;
                        if (cnt == artist.albums.length) {
                            return res.send(artist);
                        }
                    });
                })(i);
            }
        });
    });
});

//Une API pour tester si la ram est suffisante pour éxecuter l'api api/artist_all
router.get('/api_test/artist_all', (req, res) => {
    var start = 0;
    (function callRequest(start) {
        request('http://localhost/api/artist_all/' + start, (error, response, artists) => {
            var artists = JSON.parse(artists);
            start += LIMIT;
            if (!error && response.statusCode == 200) {
                if (artists.length != 200) {
                    console.log("C'est fini");
                    return true;
                } else {
                    callRequest(start)
                }
            } else {
                console.log("error = " + error);
                return false;
            }
        });
    })(start);
    res.json(config.http.valid.send_message_ok);
})
//==========================================================================================================================\\
//=========================================API REST POUR RECUPERER UN ARTISTE PAR ID========================================\\
//==========================================================================================================================\\
/**
 * @api {get} api/v1/artist/id/:id Get an artist document by id
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/artist/id/56d93d84ce06f50c0fed8747
 * @apiVersion 1.0.0
 * @apiName GetArtistById
 * @apiGroup Api/v1
 * 
 * @apiParam {Number} id artist's id
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    {
        "_id": "56d93d84ce06f50c0fed8747",
        "name": "Metallica",
        "urlWikipedia": "http://en.wikipedia.org/wiki/Metallica",
        "urlOfficialWebsite": "http://www.metallica.com/",
        "urlFacebook": "http://www.facebook.com/metallica",
        "urlMySpace": "https://myspace.com/Metallica",
        "urlTwitter": "http://twitter.com/metallica",
        "locationInfo": ["United States", "California", "Los Angeles"],
        "urlWikia": "Metallica",
        "genres": ["Heavy Metal", "Thrash Metal"],
        "labels": ["Elektra", "Megaforce Records", "Mercury Records", "Warner Bros. Records"],
        "members": [{
            "id_member_musicbrainz": "118ba687-ad7f-4c28-9355-67e14b18baeb",
            "name": "Ron McGovney",
            "instruments": [
                "bass guitar"
            ],
            "begin": "1982",
            "end": "1982",
            "ended": true,
            "disambiguation": "",
            "type": "member of band"
        }],
        "urlAmazon": "http://www.amazon.com/asdf/e/B000APEBQY?tag=wikia-20",
        "urlITunes": "https://itunes.apple.com/us/artist/id3996865",
        "urlAllmusic": "http://www.allmusic.com/artist/mn0000446509",
        "urlDiscogs": "http://www.discogs.com/artist/18839",
        "urlMusicBrainz": "http://musicbrainz.org/artist/65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "urlYouTube": "https://www.youtube.com/user/MetallicaTV",
        "urlSpotify": "https://play.spotify.com/artist/2ye2Wgw4gimLv2eAKyk1NB",
        "urlPureVolume": "http://www.purevolume.com/metallica",
        "urlRateYourMusic": "http://rateyourmusic.com/artist/metallica",
        "urlSoundCloud": "http://soundcloud.com/loureedmetallica",
        "id_artist_musicbrainz": "65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "disambiguation": "",
        "type": "Group",
        "lifeSpan": {
            "ended": false,
            "begin": "1981-10",
            "end": ""
        },
        "location": {
            "id_city_musicbrainz": "1f40c6e1-47ba-4e35-996f-fe6ee5840e62",
            "country": "United States",
            "city": "Los Angeles"
        },
        "gender": "",
        "endArea": {
            "id": "",
            "name": "",
            "disambiguation": ""
        }
    }
 * @apiError error The id is not valid.
 * @apiErrorExample Error-Response invalid ObjectId:
    HTTP/1.1 404 Not Found
    {
        "error": "You must type a valid ObjectId"
    }
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */
router.get('/artist/id/:id', function (req, res, next) {
    var db = req.db,
        id = req.params.id;
    if (!ObjectId.isValid(id)) {
        return res.status(404).json(config.http.error.objectid_404);
    }
    db.collection(COLLECTIONARTIST).findOne({
        _id: new ObjectId(id)
    }, {
        wordCount: 0,
        rdf: 0
    }, (err, artist) => {
        if (err) {
            return res.status(404).json(config.http.error.internal_error_404);
        }
        return res.json(artist);
    });
});
//==========================================================================================================================\\
//=========================================API REST POUR RECUPERER UN ARTISTE PAR NOM D'ARTISTE========================================\\
//==========================================================================================================================\\
/**
 * @api {get} api/v1/artist/name/:artistName Get an artist document by artistName
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/artist/name/Metallica
 * @apiVersion 1.0.0
 * @apiName GetArtistByArtistName
 * @apiGroup Api/v1
 * 
 * @apiParam {String} artistName artist's name
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    {
        "_id": "56d93d84ce06f50c0fed8747",
        "name": "Metallica",
        "urlWikipedia": "http://en.wikipedia.org/wiki/Metallica",
        "urlOfficialWebsite": "http://www.metallica.com/",
        "urlFacebook": "http://www.facebook.com/metallica",
        "urlMySpace": "https://myspace.com/Metallica",
        "urlTwitter": "http://twitter.com/metallica",
        "locationInfo": ["United States", "California", "Los Angeles"],
        "urlWikia": "Metallica",
        "genres": ["Heavy Metal", "Thrash Metal"],
        "labels": ["Elektra", "Megaforce Records", "Mercury Records", "Warner Bros. Records"],
        "members": [{
            "id_member_musicbrainz": "118ba687-ad7f-4c28-9355-67e14b18baeb",
            "name": "Ron McGovney",
            "instruments": [
                "bass guitar"
            ],
            "begin": "1982",
            "end": "1982",
            "ended": true,
            "disambiguation": "",
            "type": "member of band"
        }],
        "urlAmazon": "http://www.amazon.com/asdf/e/B000APEBQY?tag=wikia-20",
        "urlITunes": "https://itunes.apple.com/us/artist/id3996865",
        "urlAllmusic": "http://www.allmusic.com/artist/mn0000446509",
        "urlDiscogs": "http://www.discogs.com/artist/18839",
        "urlMusicBrainz": "http://musicbrainz.org/artist/65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "urlYouTube": "https://www.youtube.com/user/MetallicaTV",
        "urlSpotify": "https://play.spotify.com/artist/2ye2Wgw4gimLv2eAKyk1NB",
        "urlPureVolume": "http://www.purevolume.com/metallica",
        "urlRateYourMusic": "http://rateyourmusic.com/artist/metallica",
        "urlSoundCloud": "http://soundcloud.com/loureedmetallica",
        "id_artist_musicbrainz": "65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "disambiguation": "",
        "type": "Group",
        "lifeSpan": {
            "ended": false,
            "begin": "1981-10",
            "end": ""
        },
        "location": {
            "id_city_musicbrainz": "1f40c6e1-47ba-4e35-996f-fe6ee5840e62",
            "country": "United States",
            "city": "Los Angeles"
        },
        "gender": "",
        "endArea": {
            "id": "",
            "name": "",
            "disambiguation": ""
        }
    }
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */
router.get('/artist/name/:artistName', function (req, res, next) {
    var db = req.db,
        artistName = req.params.artistName;
    db.collection(COLLECTIONARTIST).findOne({
        name: artistName
    }, {
        wordCount: 0,
        rdf: 0
    }, (err, artist) => {
        if (err) {
            return res.status(404).json(config.http.error.internal_error_404);
        }
        return res.json(artist);
    });
});
//==========================================================================================================================\\
//==========================================API REST POUR RECUPERER UN ALBUM PAR ID=========================================\\
//==========================================================================================================================\\
/**
 * @api {get} api/v1/album/id/:id Get an album document by id
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/album/id/5714debe25ac0d8aee36b664
 * @apiVersion 1.0.0
 * @apiName GetAlbumById
 * @apiGroup Api/v1
 * 
 * @apiParam {Number} id album's id
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    {
        "_id": "5714debe25ac0d8aee36b664",
        "name": "Metallica",
        "title": "Master Of Puppets",
        "publicationDate": "1986",
        "urlWikipedia": "http://en.wikipedia.org/wiki/Master_of_Puppets",
        "genre": "Thrash Metal",
        "length": "54:46",
        "urlAlbum": "http://lyrics.wikia.com/Metallica:Master_Of_Puppets_%281986%29",
        "urlITunes": "https://itunes.apple.com/us/album/id167353139?i=167353334",
        "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB0012235Q6%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
        "urlGoEar": "http://goear.com/listen.php?v=c6e3d05",
        "urlSpotify": "https://play.spotify.com/track/4hOohf45f0JtxYKNsEAIOV",
        "urlAllmusic": "http://www.allmusic.com/song/mt0031988990",
        "urlMusicBrainz": "http://musicbrainz.org/recording/0f65985f-4ab2-4416-87eb-ccfd1ac4eb89"
        "id_artist": "56d93d84ce06f50c0fed8747"
    }
 * @apiError error The id is not valid.
 * @apiErrorExample Error-Response invalid ObjectId:
    HTTP/1.1 404 Not Found
    {
        "error": "You must type a valid ObjectId"
    }
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */
router.get('/album/id/:id', function (req, res, next) {
    var db = req.db,
        id = req.params.id;
    if (!ObjectId.isValid(id)) {
        return res.status(404).json(config.http.error.objectid_404);
    }
    db.collection(COLLECTIONALBUM).findOne({
        _id: new ObjectId(id)
    }, {
        wordCount: 0,
        rdf: 0
    }, (err, album) => {
        if (err) {
            return res.status(404).json(config.http.error.internal_error_404);
        }
        return res.json(album);
    });
});
//==========================================================================================================================\\
//=========================================API REST POUR RECUPERER UNE MUSIQUE PAR ID=======================================\\
//==========================================================================================================================\\
/**
 * @api {get} api/v1/song/id/:id Get a song document by id
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/song/id/5714dedb25ac0d8aee4ad810
 * @apiVersion 1.0.0
 * @apiName GetSongById
 * @apiGroup Api/v1
 * 
 * @apiParam {Number} id song's id
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    {
        "_id": "5714dedb25ac0d8aee4ad810",
        "name": "Metallica",
        "position": 2,
        "albumTitle": "Ride The Lightning",
        "lengthAlbum": "47:26",
        "publicationDateAlbum": "1984",
        "title": "For Whom The Bell Tolls",
        "urlSong": "http://lyrics.wikia.com/Metallica:For_Whom_The_Bell_Tolls",
        "lyrics": "Make his fight on the hill in the early day Constant chill deep inside...",
        "urlWikipedia": "http://en.wikipedia.org/wiki/For_Whom_the_Bell_Tolls_(Metallica_song)",
        "id_album": "5714debe25ac0d8aee36b663",
        "format": [],
        "genre": ["Heavy metal music"],
        "producer": ["Metallica", "Flemming Rasmussen"],
        "recordLabel": ["Elektra Records"],
        "writer": ["James Hetfield", "Lars Ulrich", "Cliff Burton"],
        "recorded": ["--02-20"],
        "abstract": "\"For Whom the Bell Tolls\" is a song by American thrash metal band Metallica...", 
        "releaseDate": ["1985-08-31"],
        "runtime": ["310.0"],
        "award": [],
        "subject": ["Songs written by James Hetfield", "1985 singles", "Songs written by Lars Ulrich", "Elektra Records singles", "Metallica songs", "1984 songs", "Anti-war songs", "Songs written by Cliff Burton"],
        "urlYouTube": "",
        "isClassic": false,
        "multitrack_path": "M Multitracks/Metallica - For Whom The Bell Tolls",
        "urlITunes": "https://itunes.apple.com/us/album/id167353139?i=167353334",
        "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB0012235Q6%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
        "urlGoEar": "http://goear.com/listen.php?v=c6e3d05",
        "urlSpotify": "https://play.spotify.com/track/4hOohf45f0JtxYKNsEAIOV",
        "urlAllmusic": "http://www.allmusic.com/song/mt0031988990",
        "urlMusicBrainz": "http://musicbrainz.org/recording/0f65985f-4ab2-4416-87eb-ccfd1ac4eb89"
    }
 * @apiError error The id is not valid.
 * @apiErrorExample Error-Response invalid ObjectId:
    HTTP/1.1 404 Not Found
    {
        "error": "You must type a valid ObjectId"
    }
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */
router.get('/song/id/:id', function (req, res, next) {
    var db = req.db,
        id = req.params.id;
    if (!ObjectId.isValid(id)) {
        return res.status(404).json(config.http.error.objectid_404);
    }
    db.collection(COLLECTIONSONG).findOne({
        _id: new ObjectId(id)
    }, {
        wordCount: 0,
        rdf: 0
    }, (err, song) => {
        if (err) {
            return res.status(404).json(config.http.error.internal_error_404);
        }
        return res.json(song);
    });
});
//==========================================================================================================================\\
//====================================API REST POUR RECUPERER UN ARTISTE PAR NOM DE MEMBRE==================================\\
//==========================================================================================================================\\
/**
 * @api {get} api/v1/member/name/:memberName Get an artist document by memberName
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/member/name/Adrian%20Smith
 * @apiVersion 1.0.0
 * @apiName GetArtistByMemberName
 * @apiGroup Api/v1
 * 
 * @apiParam {String} memberName member's name
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    {
        "_id": "56d8432453a7ddfc01f96c1f",
        "name": "Iron Maiden",
        "urlWikipedia": "http://en.wikipedia.org/wiki/Iron_Maiden",
        "urlOfficialWebsite": "http://www.ironmaiden.com/",
        "urlFacebook": "https://www.facebook.com/ironmaiden",
        "urlMySpace": "https://myspace.com/ironmaiden",
        "urlTwitter": "https://twitter.com/ironmaiden",
        "locationInfo": ["England", "London"],
        "urlWikia": "Iron_Maiden",
        "genres": ["Heavy Metal"],
        "labels": ["Atlantic Records", "EMI", "Elektra", "Epic Records"],
        "members": [{
            "id_member_musicbrainz": "118ba687-ad7f-4c28-9355-67e14b18baeb",
            "name": "Ron McGovney",
            "instruments": [
                "bass guitar"
            ],
            "begin": "1982",
            "end": "1982",
            "ended": true,
            "disambiguation": "",
            "type": "member of band"
        }],
        "urlAmazon": "http://www.amazon.com/asdf/e/B000APEBQY?tag=wikia-20",
        "urlITunes": "https://itunes.apple.com/us/artist/id3996865",
        "urlAllmusic": "http://www.allmusic.com/artist/mn0000446509",
        "urlDiscogs": "http://www.discogs.com/artist/18839",
        "urlMusicBrainz": "http://musicbrainz.org/artist/65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "urlYouTube": "https://www.youtube.com/user/MetallicaTV",
        "urlSpotify": "https://play.spotify.com/artist/2ye2Wgw4gimLv2eAKyk1NB",
        "urlPureVolume": "http://www.purevolume.com/metallica",
        "urlRateYourMusic": "http://rateyourmusic.com/artist/metallica",
        "urlSoundCloud": "http://soundcloud.com/loureedmetallica",
        "id_artist_musicbrainz": "65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "disambiguation": "",
        "type": "Group",
        "lifeSpan": {
            "ended": false,
            "begin": "1981-10",
            "end": ""
        },
        "location": {
            "id_city_musicbrainz": "1f40c6e1-47ba-4e35-996f-fe6ee5840e62",
            "country": "United States",
            "city": "Los Angeles"
        },
        "gender": "",
        "endArea": {
            "id": "",
            "name": "",
            "disambiguation": ""
        }
    }
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */
router.get('/member/name/:memberName', function (req, res, next) {
    var db = req.db,
        memberName = req.params.memberName.trim();
    db.collection(COLLECTIONARTIST).find({
        "members.name": memberName
    }, {
        wordCount: 0,
        rdf: 0
    }).toArray((err, artists) => {
        if (err) {
            return res.status(404).json(config.http.error.internal_error_404);
        }
        return res.json(artists);
    });
});

/**
 * @api {get} api/v1/animux_all/:start Get songs with an animux field
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/animux_all/340
 * @apiVersion 1.0.0
 * @apiName GetSongsWithAnAnimuxField
 * @apiGroup Api/v1
 * @apiDescription This api return the first 200 songs documents 
 *                 for instance wasabi.i3s.unice.fr/api/v1/animux_all/120 will return all songs between [120 and 320[ 
 *
 * @apiParam {Number} start Where we want to start the extraction.
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
[{
    "_id": "5714dec325ac0d8aee38270d",
    "name": "ABBA",
    "position": 5,
    "lengthAlbum": "41:33",
    "urlSong": "http://lyrics.wikia.com/ABBA:Does_Your_Mother_Know",
    "lyrics": "You&apos;re so hot, teasing me So you&apos;re blue but I can&apos;t take a...",
    "urlWikipedia": "http://en.wikipedia.org/wiki/Does_Your_Mother_Know",
    "id_album": "5714debb25ac0d8aee34d9a0",
    "format": [
        "Single (music)"
    ],
    "genre": [
        "Disco",
        "Pop music",
        "Rock music"
    ],
    "producer": [
        "Benny Andersson",
        "Björn Ulvaeus"
    ],
    "recordLabel": [
        "Polar Music",
        "Epic Records"
    ],
    "writer": [
        "Björn Ulvaeus",
        "Benny Andersson"
    ],
    "recorded": [
        "--02-06"
    ],
    "abstract": "\"Does Your Mother Know\", (working title: \"I Can Do It\"), is a s",
    "releaseDate": [],
    "runtime": [
        "195.0"
    ],
    "award": [],
    "subject": [
        "European Hot 100 Singles number-one singles",
        "Polar Music singles"
    ],
    "isClassic": false,
    "title": "Does Your Mother Know",
    "publicationDateAlbum": "1979",
    "albumTitle": "Voulez-Vous",
    "deezer_mapping": [
        [
            1108951,
            "search-exact"
        ],
        [
            1108951,
            "youtubefgpt"
        ],
        [
            1113425,
            "youtubefgpt"
        ]
    ],
    "id_song_deezer": "1108951",
    "isrc": "SEAYD7901060",
    "length": "195",
    "explicitLyrics": false,
    "rank": "24",
    "bpm": "",
    "gain": "",
    "preview": "http://cdn-preview-a.deezer.com/stream/a28567a82ea0ad7668f138bdade4917c-7.mp3",
    "availableCountries": [],
    "publicationDate": "2008-12-08",
    "urlMusicBrainz": "",
    "urlPandora": "",
    "urlITunes": "",
    "urlSpotify": "",
    "urlYouTube": "WkL7Fkigfn8",
    "urlAmazon": "",
    "urlHypeMachine": "",
    "urlAllmusic": "",
    "urlGoEar": "",
    "urlLastFm": "",
    "multitrack_path": "",
    "multitrack_file": "",
    "language": "",
    "begin": "",
    "disambiguation": "",
    "end": "",
    "id_song_musicbrainz": "",
    "animux_path": "./mongo/animux/A/ABBA/Does Your Mother Know_Animux.txt",
    "animux_content": "#ARTIST:ABBA\n#TITLE:Does Your Mother Know\n#MP3:ABBA - Does Your Mother K..."
},{
    ANOTHER SONG OBJECT
}]
 * @apiError error isn't a number or is negative.
 * @apiErrorExample Error-Response:
    HTTP/1.1 404 Not Found
    {
        "error": "Page not found"
    }
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */

router.get('/animux_all/:start', function (req, res, next) {
    var db = req.db,
        start = Number.parseInt(req.params.start);
    if (!Number.isInteger(start) || start < 0) {
        return res.status(404).json(config.http.error.global_404);
    }
    db.collection(COLLECTIONSONG).find({
        animux_path: {
            $exists: 1
        }
    }, {
        wordCount: 0,
        rdf: 0,
    }).skip(start).limit(LIMIT).toArray((err, songs) => {
        if (err) {
            return res.status(404).json(config.http.error.internal_error_404);
        }
        return res.json(songs);
    });
});
export default router;