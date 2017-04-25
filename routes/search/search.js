import express from 'express';
import RateLimit from 'express-rate-limit';
import searchController from './search.controller';
import config from '../conf/conf';
const router = express.Router();
//==========================================================================================================================\\
//===========================WEBSERVICE REST POUR L'AFFICHAGE DU LISTING DES ARTISTES/ALBUMS/SONGS==========================\\
//==========================================================================================================================\\
//GET LISTING DES ARTISTES ALBUMS ET MUSIQUES EN FONCTION DE OU DES LETTRES 
/**
 * @api {get} search/categorie/:nomCategorie/lettre/:lettre/page/:numPage Get page information
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/search/categorie/artists/lettre/b/page/5
 * @apiVersion 1.0.0
 * @apiName GetPageByCategory
 * @apiGroup Search
 *
 * @apiParam {String} nomCategorie {artists,albums,songs}.
 * @apiParam {String} lettre Une ou deux lettres.
 * @apiParam {Number} numPage Users unique ID.
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    {
        "limit": 200,
        "artists": [{
                "_id": "56d843ec53a7ddfc01f96d17",
                "name": "J"
            },
            {
                "_id": "56d843ed53a7ddfc01f96d18",
                "name": "J Alvarez"
            }
        ]
    } 
 *  @apiSuccessExample Success-Response for an album:
    HTTP/1.1 200 OK
    {
        "limit": 200,
        "albums": [{
                "_id": "5714debb25ac0d8aee34e3a7",
                "name": "Agnetha Fältskog",
                "titleAlbum": "A"
            },
            {
                "_id": "5714debb25ac0d8aee355421",
                "name": "Cass McCombs",
                "titleAlbum": "A"
            }
        ]
    }   
 *  @apiSuccessExample Success-Response for a song:
    HTTP/1.1 200 OK
    {
        "limit": 200,
        "songs": [{
                "_id": "5714dec325ac0d8aee3859f9",
                "name": "Addict",
                "albumTitle": "Come On Sun",
                "titleSong": "K"
            },
            {
                "_id": "5714dec325ac0d8aee3804f5",
                "name": "A",
                "albumTitle": "A Vs. Monkey Kong",
                "titleSong": "A"
            }
        ]
    }
 * @apiError error The nomCategorie or lettre or numPage was not found.
 * @apiErrorExample Error-Response:
    HTTP/1.1 404 Not Found
    {
        "error": "Page not found"
    }
 */
router.get('/categorie/:nomCategorie/lettre/:lettre/page/:numPage', new RateLimit(config.http.limit_request.search), searchController.get_collectionByCategoryAndLetter);

//==========================================================================================================================\\
//==============================WEBSERVICE REST POUR LA NAVIGATION ENTRE CATEGORIES (SUBJCET)===============================\\
//==========================================================================================================================\\
//GET CATEGORY PAR NOM DE CATEGORY ET PAR COLLECTION
/**
 * @api {get} search/category/:collection/:categoryName Get category
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/search/category/song/Songs%20written%20by%20Cliff%20Burton
 * @apiVersion 1.0.0
 * @apiName GetSongsByCategory
 * @apiGroup Search
 *
 * @apiParam {Number} collection {artists,albums,songs}.
 * @apiParam {Number} categoryName category is the subject field in the database.
 * 
 * 
 * @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    [{
        "_id": "5714dece25ac0d8aee403c97",
        "name": "Drowning Pool",
        "albumTitle": "Other Releases",
        "title": "Creeping Death"
    }, {
        "_id": "5714dedb25ac0d8aee4ad814",
        "name": "Metallica",
        "albumTitle": "Ride The Lightning",
        "title": "Creeping Death"
    }]
 *
 * @apiError error The collection was not found.
 * @apiErrorExample Error-Response:
    HTTP/1.1 404 Not Found
    {
        "error": "Page not found"
    }
 */
router.get('/category/:collection/:categoryName', new RateLimit(config.http.limit_request.search), searchController.get_category);

//==========================================================================================================================\\
//====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE PRODUCER=====================================\\
//==========================================================================================================================\\
//GET PRODUCER PAR NOM DE PRODUCER
//Peut évoluer en /producer/:collection/:producerName avec :collection = artist/album/song si un artist ou un album a des producer
/**
 * @api {get} search/producer/:producerName Get songs by producer
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/search/producer/Flemming%20Rasmussen
 * @apiVersion 1.0.0
 * @apiName GetSongsByProducer
 * @apiGroup Search
 *
 * @apiParam {Number} producerName producer name.
 * 
 * 
 * @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    [{
        "_id": "5714dedb25ac0d8aee4ad81f",
        "name": "Metallica",
        "albumTitle": "...And Justice For All",
        "title": "...And Justice For All"
    }, {
        "_id": "5714dedb25ac0d8aee4ad89d",
        "name": "Metallica",
        "albumTitle": "Singles",
        "title": "...And Justice For All"
    }]
 *
 */
router.get('/producer/:producerName', new RateLimit(config.http.limit_request.search), searchController.get_songByProducer);

//==========================================================================================================================\\
//===================================WEBSERVICE REST POUR LA NAVIGATION ENTRE RECORDLABEL===================================\\
//==========================================================================================================================\\
//GET RECORDLABEL PAR NOM DE RECORDLABEL
//Peut évoluer en /recordlabel/:collection/:recordLabelName avec :collection = artist/album/song si un artiste ou un album a des recordLabel
/**
 * @api {get} search/recordlabel/:recordLabelName Get songs by recordLabel
 * @apiExample {get} Example usage: 
 *      wasabi.i3s.unice.fr/search/recordlabel/Elektra%20Records
 * @apiVersion 1.0.0
 * @apiName GetSongsByRecordLabel
 * @apiGroup Search
 *
 * @apiParam {Number} recordLabelName a record label name.
 * 
 * 
 * @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    [{
        "_id": "5714dee025ac0d8aee4ea2d5",
        "name": "Queen",
        "albumTitle": "A Night At The Opera",
        "title": "'39"
    }, {
        "_id": "5714dee025ac0d8aee4ea30a",
        "name": "Queen",
        "albumTitle": "Live Killers",
        "title": "'39"
    }]
 *
 */


router.get('/recordlabel/:recordLabelName', new RateLimit(config.http.limit_request.search), searchController.get_songByRecordLabel);

//==========================================================================================================================\\
//=====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE GENRE=======================================\\
//==========================================================================================================================\\
//GET RECORDLABEL PAR NOM DE RECORDLABEL
/**
 * @api {get} search/genre/:genreName Get songs by genre
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/search/genre/Thrash%20metal
 * @apiVersion 1.0.0
 * @apiName GetSongsByGenre
 * @apiGroup Search
 *
 * @apiParam {String} genreName songs having this genre.
 * 
 * @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    [{
        "_id": "5714dedb25ac0d8aee4ad81f",
        "name": "Metallica",
        "albumTitle": "...And Justice For All",
        "title": "...And Justice For All"
    }, {
        "_id": "5714dedb25ac0d8aee4aa923",
        "name": "Megadeth",
        "albumTitle": "Endgame",
        "title": "Dialectic Chaos"
    }]
 */
router.get('/genre/:genreName', new RateLimit(config.http.limit_request.search), searchController.get_songByGenre);
//==========================================================================================================================\\
//====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE RECORDED=====================================\\
//==========================================================================================================================\\
//GET RECORDED PAR NOM DE RECORDED
/**
 * @api {get} search/recorded/:recordedName Get songs by recordedName
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/search/recorded/1985
 *      wasabi.i3s.unice.fr/search/recorded/--06-16
 * @apiVersion 1.0.0
 * @apiName GetSongsByRecordedName
 * @apiGroup Search
 *
 * @apiParam {String} recordedName The field may assume different values.
 *
 *
 * @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    [{
        "_id": "5714dec325ac0d8aee388df2",
        "name": "Aimee Mann",
        "albumTitle": "Ultimate Collection",
        "title": "'Til Tuesday:Voices Carry"
    }, {
        "_id": "5714decf25ac0d8aee41bd1c",
        "name": "Feargal Sharkey",
        "albumTitle": "Feargal Sharkey",
        "title": "A Good Heart"
    }]
 *
 */
router.get('/recorded/:recordedName', new RateLimit(config.http.limit_request.search), searchController.get_songByRecorded);
//==========================================================================================================================\\
//=====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE AWARD=======================================\\
//==========================================================================================================================\\
//GET AWARD PAR NOM DE AWARD
/**
 * @api {get} search/award/:awardName Get songs by awardName
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/search/award/Platinum
 * @apiVersion 1.0.0
 * @apiName GetSongsByAwardName
 * @apiGroup Search
 *
 * @apiParam {String} awardName {undefined,Diamond,
    Gold,Gold+Gold+Platinum,Gold+Silver,Million,Million2× Platinum,
    Multi Platinum,N/A,Platinum,Platinum+Gold,
    Platinum+Platinum","Platinumref|The Platinum award for \"Summertime Sadness\" in the United States represents sales of both the original version and the Cedric Gervais remix.|group=\"note\"|name=RIAA,
    Silver,platinum,—,−}.
 *
 *
 * @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    [{
        "_id": "5714ded425ac0d8aee459dfe",
        "name": "Jay-Z",
        "albumTitle": "The Blueprint²: The Gift & The Curse",
        "title": "'03 Bonnie & Clyde"
    }, {
        "_id": "5714dee025ac0d8aee4ea2d5",
        "name": "Queen",
        "albumTitle": "A Night At The Opera",
        "title": "'39"
    }]
 *
 */
router.get('/award/:awardName', new RateLimit(config.http.limit_request.search), searchController.get_songByAward);

//==========================================================================================================================\\
//=====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE WRITER======================================\\
//==========================================================================================================================\\
//GET WRITER PAR NOM DE WRITER
/**
 * @api {get} search/writer/:writerName Get songs by writerName
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/search/writer/Lars%20Ulrich
 * @apiVersion 1.0.0
 * @apiName GetSongsByWriterName
 * @apiGroup Search
 *
 * @apiParam {String} writerName a writer name 
 *
 *
 * @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    [{
        "_id": "5714dedb25ac0d8aee4ad8ae",
        "name": "Metallica",
        "albumTitle": "Singles",
        "title": "Better Than You"
    }, {
        "_id": "5714dedb25ac0d8aee4ad83c",
        "name": "Metallica",
        "albumTitle": "Load",
        "title": "Bleeding Me"
    }]
 *
 */
router.get('/writer/:writerName', new RateLimit(config.http.limit_request.search), searchController.get_songByWriter);
//==========================================================================================================================\\
//=====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE FORMAT======================================\\
//==========================================================================================================================\\
//GET FORMAT PAR NOM DE FORMAT
/**
 * @api {get} search/format/:formatName Get songs by formatName
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/search/format/Gramophone%20record
 *      wasabi.i3s.unice.fr/search/format/CD%20single
 * @apiVersion 1.0.0
 * @apiName GetSongsByFormatName
 * @apiGroup Search
 *
 * @apiParam {String} formatName a writer name 
 *
 *
 * @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    [{
        "_id": "5714dee725ac0d8aee54060e",
        "name": "The Gaslight Anthem",
        "albumTitle": "Handwritten",
        "title": "\"45\""
    }, {
        "_id": "5714decc25ac0d8aee3ed894",
        "name": "David Bowie",
        "albumTitle": "\"Heroes\"",
        "title": "\"Heroes\""
    }]
 *
 */
router.get('/format/:formatName', new RateLimit(config.http.limit_request.search), searchController.get_songByFormat);
//==========================================================================================================================\\
//====================WEBSERVICE REST POUR COMPTER LE NOMBRE D'OCCURENCE DE DOCUMENT DANS UNE COLLECTION ===================\\
//==========================================================================================================================\\
// /!\/!\ Cette fonction fait exploser la RAM car elle compte le nombre d'occurence de chaque title commençant par la lettre :lettre dans la collection song/!\/!\

router.get('/count/:collection/:lettre', searchController.get_countByLetter);
//==========================================================================================================================\\
//================WEBSERVICE REST POUR COMPTER LE NOMBRE D'OCCURENCE D'UN ATTRIBUT DANS UNE COLLECTION DONNEE===============\\
//==========================================================================================================================\\
/**
 * @api {get} search/count/:collection/:fieldName/:fieldValue Get number of :fieldValue
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/search/count/song/award/Platinum
 *      wasabi.i3s.unice.fr/search/count/album/genre/Alternative%20Rock
 * @apiVersion 1.0.0
 * @apiName GetNumberOfFieldValue
 * @apiGroup Search
 *
 * @apiParam {String} collection {artist, album, song}
 * @apiParam {String} fieldName a field name in the database
 * @apiParam {String} fieldValue a value of a field in the database 
 * 
 *
 * @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "count":3366
    }
 *
 */

router.get('/count/:collection/:fieldName/:fieldValue', new RateLimit(config.http.limit_request.search), searchController.get_countByField);
//==========================================================================================================================\\
//============================WEBSERVICE REST POUR L'AFFICHAGE DU NOMBRE D'ARTISTES/ALBUMS/SONGS============================\\
//==========================================================================================================================\\
//GET PERMET D'OBTENIR LE NOMBRE D'ARTISTES/ALBUMS/SONGS
/**
 * @api {get} search/dbinfo Get number of artist,album,song
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/search/dbinfo
 * @apiVersion 1.0.0
 * @apiName GetNumberOfArtistAlbumSong
 * @apiGroup Search
 * 
 *
 * @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "nbArtist":77492,
        "nbAlbum":208743,
        "nbSong":2099289
    }
 *
 */
router.get('/dbinfo', searchController.get_dbinfo);
//==========================================================================================================================\\
//=======================================WEBSERVICE REST POUR LA GESTION DES ARTISTES=======================================\\
//==========================================================================================================================\\
//GET ARTIST PAR NOM D'ARTISTE (UN NOM D'ARTISTE EST UNIQUE -> REGLE DE LYRICS WIKIA LORS DE L'EXTRACTION DES DONNEES)
/**
 * @api {get} search/artist/:artistName Get infos about artist
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/search/artist/Metallica
 * @apiVersion 1.0.0
 * @apiName GetInfosArtistByArtistName
 * @apiGroup Search
 *
 * @apiParam {String} artistName An artist name.
 *
 * @apiSuccessExample Success-Response:
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
        "genres": ["Heavy Metal", "Thrash Metal"],
        "labels": ["Elektra", "Megaforce Records", "Mercury Records", "Warner Bros. Records"],
        "members": [{
            "name": "Ron McGovney",
            "instruments": [
                "bass guitar"
            ],
            "begin": "1982",
            "end": "1982",
            "ended": true,
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
        "lifeSpan": {
            "ended": false,
            "begin": "1981-10",
            "end": ""
        },
        "location": {
            "country": "United States",
            "city": "Los Angeles"
        },
        "gender": "",
        "endArea": {
            "id": "",
            "name": ""
        },
        "rdf": " 1963-03-04 Jason Curtis Newsted Bass, guitar, drums, vocals Jason Newsted Jason Curtis Newsted (born March 4, 1963) is an American metal musician, known for playing bass guitar with the bands Metallica (in which he did occasional lead vocals) ...",
        "albums": [{
            "_id": "5714debe25ac0d8aee36b664",
            "name": "Metallica",
            "title": "Master Of Puppets",
            "publicationDate": "1986",
            "genre": "Thrash Metal",
            "length": "54:46",
            "id_artist": "56d93d84ce06f50c0fed8747",
            "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB000002H33%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
            "urlITunes": "https://itunes.apple.com/us/album/id278129100",
            "urlAllmusic": "http://www.allmusic.com/album/mw0000667490",
            "urlDiscogs": "http://www.discogs.com/release/367423",
            "urlMusicBrainz": "http://musicbrainz.org/release/fed37cfc-2a6d-4569-9ac0-501a7c7598eb",
            "urlSpotify": "https://play.spotify.com/album/41bTjcSaiEe4G40RVVHbux",
            "songs": [{
                "_id": "5714dedb25ac0d8aee4ad816",
                "position": 0,
                "title": "Battery"
                }, {
                "_id": "5714dedb25ac0d8aee4ad817",
                "position": 1,
                "title": "Master Of Puppets"
                }, {
                "_id": "5714dedb25ac0d8aee4ad81d",
                "position": 7,
                "title": "Damage, Inc."
            }]
        }]
    }
 * @apiError error The artistName was not found.
 * @apiErrorExample Error-Response:
    HTTP/1.1 404 Not Found
    {
        "error":"Artist not found"
    }
 */


router.get('/artist/:artistName', new RateLimit({
    "windowMs": 60000, // 60 secondes 
    "max": 30, // limit each IP to 100 requests per windowMs 
    "delayMs": 0 // disable delaying - full speed until the max limit is reached
}), searchController.get_artist);
//==========================================================================================================================\\
//========================================WEBSERVICE REST POUR LA GESTION DES ALBUMS========================================\\
//==========================================================================================================================\\
//GET ALBUM PAR NOM D'ARTISTE ET TITRE D'ALBUM
//FIXME /!\ UN ARTIST PEUT AVOIR PLUSIEURS TITRES D'ALBUMS IDENTIQUES/!\ ERREUR A CORRIGER eventullement : créer une autre route /artist/:artistName/album/:albumId ou utiliser la route /artist_id/:artistId/album_id/:albumId
/**
 * @api {get} search/artist/:artistName/album/:albumName Get infos about album
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/search/artist/Metallica/album/Master%20Of%20Puppets
 * @apiVersion 1.0.0
 * @apiName GetInfosAlbumByAlbumName
 * @apiGroup Search
 *
 * @apiParam {String} artistName An artist name.
 * @apiParam {String} albumName An album title of artistName.
 * 
 * @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "_id": "56d93d84ce06f50c0fed8747",
        "name": "Metallica",
        "albums": {
            "_id": "5714debe25ac0d8aee36b664",
            "name": "Metallica",
            "title": "Master Of Puppets",
            "publicationDate": "1986",
            "urlWikipedia": "http://en.wikipedia.org/wiki/Master_of_Puppets",
            "genre": "Thrash Metal",
            "length": "54:46",
            "id_artist": "56d93d84ce06f50c0fed8747",
            "rdf": " Gold Platinum Master of Puppets is the third studio album by American heavy metal band Metallica... ",
            "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB000002H33%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
            "urlITunes": "https://itunes.apple.com/us/album/id278129100",
            "urlAllmusic": "http://www.allmusic.com/album/mw0000667490",
            "urlDiscogs": "http://www.discogs.com/release/367423",
            "urlMusicBrainz": "http://musicbrainz.org/release/fed37cfc-2a6d-4569-9ac0-501a7c7598eb",
            "urlSpotify": "https://play.spotify.com/album/41bTjcSaiEe4G40RVVHbux",
            "songs": [{
                "_id": "5714dedb25ac0d8aee4ad816",
                "position": 0,
                "title": "Battery"
                }, {
                "_id": "5714dedb25ac0d8aee4ad817",
                "position": 1,
                "title": "Master Of Puppets"
                }, {
                "_id": "5714dedb25ac0d8aee4ad818",
                "position": 2,
                "title": "The Thing That Should Not Be"
                }, {
                "_id": "5714dedb25ac0d8aee4ad819",
                "position": 3,
                "title": "Welcome Home (Sanitarium)"
            }]
        }
    }
 * @apiError error albumName was not found.
 * @apiErrorExample Error-Response:
    HTTP/1.1 404 Not Found
    {
        "error": "Album not found"
    }
 * @apiError error artistName was not found.
 * @apiErrorExample Error-Response:
    HTTP/1.1 404 Not Found
    {
        "error": "Artist not found"
    }
 */
router.get('/artist/:artistName/album/:albumName', new RateLimit({
    "windowMs": 60000, // 60 secondes 
    "max": 30, // limit each IP to 100 requests per windowMs 
    "delayMs": 0 // disable delaying - full speed until the max limit is reached
}), searchController.get_album);
//GET ALBUM PAR ID D'ARTISTE ET D'ALBUM
/**
 * @api {get} search/artist_id/:artistId/album_id/:albumId Get infos about album by id
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/search/artist_id/56d93d84ce06f50c0fed8747/album_id/5714debe25ac0d8aee36b664
 * @apiVersion 1.0.0
 * @apiName GetInfosAlbumByAlbumId
 * @apiGroup Search
 *
 * @apiParam {String} artistId An artist name.
 * @apiParam {String} albumId An album title of artistName.
 * 
 *  
 * @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "_id": "56d93d84ce06f50c0fed8747",
        "name": "Metallica",
        "albums": {
            "_id": "5714debe25ac0d8aee36b664",
            "name": "Metallica",
            "title": "Master Of Puppets",
            "publicationDate": "1986",
            "urlWikipedia": "http://en.wikipedia.org/wiki/Master_of_Puppets",
            "genre": "Thrash Metal",
            "length": "54:46",
            "id_artist": "56d93d84ce06f50c0fed8747",
            "rdf": " Gold Platinum Master of Puppets is the third studio album by American heavy metal band Metallica... ",
            "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB000002H33%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
            "urlITunes": "https://itunes.apple.com/us/album/id278129100",
            "urlAllmusic": "http://www.allmusic.com/album/mw0000667490",
            "urlDiscogs": "http://www.discogs.com/release/367423",
            "urlMusicBrainz": "http://musicbrainz.org/release/fed37cfc-2a6d-4569-9ac0-501a7c7598eb",
            "urlSpotify": "https://play.spotify.com/album/41bTjcSaiEe4G40RVVHbux",
            "songs": [{
                "_id": "5714dedb25ac0d8aee4ad816",
                "position": 0,
                "title": "Battery"
                }, {
                "_id": "5714dedb25ac0d8aee4ad817",
                "position": 1,
                "title": "Master Of Puppets"
                }, {
                "_id": "5714dedb25ac0d8aee4ad818",
                "position": 2,
                "title": "The Thing That Should Not Be"
                }, {
                "_id": "5714dedb25ac0d8aee4ad819",
                "position": 3,
                "title": "Welcome Home (Sanitarium)"
            }]
        }
    }
 * @apiError error You must type a valid ObjectId.
 * @apiErrorExample Error-Response:
    HTTP/1.1 404 Not Found
    {
        "error": "You must type a valid ObjectId"
    }
 * @apiError error albumName was not found.
 * @apiErrorExample Error-Response:
    HTTP/1.1 404 Not Found
    {
        "error": "Album not found"
    }
 * @apiError error artistName was not found.
 * @apiErrorExample Error-Response:
    HTTP/1.1 404 Not Found
    {
        "error": "Artist not found"
    }
 */
router.get('/artist_id/:artistId/album_id/:albumId', new RateLimit(config.http.limit_request.search), searchController.get_albumById);

//PUT ALBUM PAR NOM D'ALBUM
router.put('/artist/:artistName/album/:albumName', new RateLimit(config.http.limit_request.search), searchController.put_album);

//==========================================================================================================================\\
//=======================================WEBSERVICE REST POUR LA GESTION DES MUSIQUES=======================================\\
//==========================================================================================================================\\
//GET SONG PAR NOM D'ARTISTE TITRE D'ALBUM ET TITRE DE MUSIQUE
/**
 * @api {get} search/artist/:artistName/album/:albumName/song/:songName Get infos about song by song name
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/search/artist/Metallica/album/Master%20Of%20Puppets/song/Master%20Of%20Puppets
 * @apiVersion 1.0.0
 * @apiName GetInfosSongBySongName
 * @apiGroup Search
 *
 * @apiParam {String} artistName An artist name.
 * @apiParam {String} albumName An album title of artistName.
 * @apiParam {String} songName A song title of songName.
 * 
 * 
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    {
        "_id": "56d93d84ce06f50c0fed8747",
        "name": "Metallica",
        "albums": {
            "_id": "5714debe25ac0d8aee36b664",
            "title": "Master Of Puppets",
            "songs": {
                "_id": "5714dedb25ac0d8aee4ad817",
                "name": "Metallica",
                "position": 1,
                "albumTitle": "Master Of Puppets",
                "lengthAlbum": "54:46",
                "publicationDateAlbum": "1986",
                "title": "Master Of Puppets",
                "lyrics": "End of passion play, crumbling away I&apos;m your source of self-destruction...",
                "urlWikipedia": "http://en.wikipedia.org/wiki/Master_of_Puppets_(song)",
                "id_album": "5714debe25ac0d8aee36b664",
                "rdf": "<?xml version='1.0' encoding='utf-8' ?><rdf:RDF xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#'  xmlns:rdfs='http://www.w3.org/2000/01/rdf-schema#' xmlns:dct='http://purl.org/dc/terms/' xmlns:dbp='http://dbpedia.org/property/' xmlns:dbo='http://dbpedia.org/ontology/' >   <rdf:Description rdf:about='http://dbpedia.org/resource/Master_of_Puppets_(song)'><dct:subject rdf:resource='http://dbpedia.org/resource/Category:Songs_written_by_Lars_Ulrich' />     <dct:subject rdf:resource='http://dbpedia.org/resource/Category:Metallica_songs' /><dct:subject rdf:resource='http://dbpedia.org/resource/Category:Elektra_Records_singles' /></rdf:Description> </rdf:RDF>",
                "format": ["Gramophone record", "12-inch single"],
                "genre": ["Thrash metal", "Progressive metal"],
                "producer": ["Flemming Rasmussen"],
                "recordLabel": ["Elektra Records", "Music for Nations"],
                "writer": ["Cliff Burton", "Lars Ulrich", "James Hetfield", "Kirk Hammett"],
                "recorded": ["1985"],
                "abstract": "\"Master of Puppets\" is a song by the American heavy metal band Metallica...",
                "releaseDate": ["1986-07-02"],
                "runtime": ["516.0"],
                "award": [],
                "subject": ["Songs written by Lars Ulrich", "Metallica songs", "Elektra Records singles", "Songs written by Cliff Burton", "Songs about drugs", "Songs written by James Hetfield", "Songs written by Kirk Hammett", "1986 singles"],
                "urlYouTube": "",
                "isClassic": false,
                "multitrack_path": "M Multitracks/Metallica - Master Of Puppets",
                "urlITunes": "https://itunes.apple.com/us/album/id167353581?i=167353601",
                "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00122A546%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
                "urlGoEar": "http://goear.com/listen.php?v=afd1e62",
                "urlSpotify": "https://play.spotify.com/track/6NwbeybX6TDtXlpXvnUOZC",
                "urlAllmusic": "http://www.allmusic.com/song/mt0002228132",
                "urlMusicBrainz": "http://musicbrainz.org/recording/49b8371f-156a-41e8-92c9-8cd899235b90"
            }
        }
    }
 * @apiError error The artistName was not found.
 * @apiErrorExample Error-Response for artist not found:
    HTTP/1.1 404 Artist Not Found
    {
        "error": "Artist not found"
    }
 * @apiError error The albumName was not found.
 * @apiErrorExample Error-Response for album not found:
    HTTP/1.1 404 Album Not Found
    {
        "error": "Album not found"
    }
 * @apiError error The songName was not found.
 * @apiErrorExample Error-Response for song not found:
    HTTP/1.1 404 Song Not Found
    {
        "error": "Song not found"
    }
 */
router.get('/artist/:artistName/album/:albumName/song/:songName', new RateLimit({
    "windowMs": 60000, // 60 secondes 
    "max": 30, // limit each IP to 100 requests per windowMs 
    "delayMs": 0 // disable delaying - full speed until the max limit is reached
}), searchController.get_song);
//GET SONG PAR ID D'ARTISTE,ALBUM,MUSIQUE
/**
 * @api {get} search/artist_id/:artistId/album_id/:albumId/song_id/:songId Get Page information
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/search/artist_id/56d93d84ce06f50c0fed8747/album_id/5714debe25ac0d8aee36b664/song_id/5714dedb25ac0d8aee4ad817
 * @apiVersion 1.0.0
 * @apiName GetPageSongByID
 * @apiGroup Search
 *
 * @apiParam {String} artistId Artist's id.
 * @apiParam {String} albumId Album's id.
 * @apiParam {String} songId Song's id.
 * 
 * @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "_id": "56d93d84ce06f50c0fed8747",
        "name": "Metallica",
        "albums": {
        "_id": "5714debe25ac0d8aee36b664",
        "title": "Master Of Puppets",
        "songs": {
            "_id": "5714dedb25ac0d8aee4ad817",
            "name": "Metallica",
            "position": 1,
            "albumTitle": "Master Of Puppets",
            "lengthAlbum": "54:46",
            "publicationDateAlbum": "1986",
            "title": "Master Of Puppets",
            "lyrics": "End of passion play, crumbling away I&apos;m your source ...",
            "urlWikipedia": "http://en.wikipedia.org/wiki/Master_of_Puppets_(song)",
            "id_album": "5714debe25ac0d8aee36b664",
            "rdf": "Some RDF...",
            "format": ["Gramophone record", "12-inch single"],
            "genre": ["Thrash metal", "Progressive metal"],
            "producer": ["Flemming Rasmussen"],
            "recordLabel": ["Elektra Records", "Music for Nations"],
            "writer": ["Cliff Burton", "Lars Ulrich", "James Hetfield", "Kirk Hammett"],
            "recorded": ["1985"],
            "abstract": "\"Master of Puppets\" is a song by the American heavy metal ...",
            "releaseDate": ["1986-07-02"],
            "runtime": ["516.0"],
            "award": [],
            "subject": ["Songs written by Lars Ulrich", "Metallica songs", "Elektra Records singles", "Songs written by Cliff Burton", "Songs about drugs", "Songs written by James Hetfield", "Songs written by Kirk Hammett", "1986 singles"],
            "urlYouTube": "",
            "isClassic": false,
            "multitrack_path": "M Multitracks/Metallica - Master Of Puppets",
            "urlITunes": "https://itunes.apple.com/us/album/id167353581?i=167353601",
            "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00122A546%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
            "urlGoEar": "http://goear.com/listen.php?v=afd1e62",
            "urlSpotify": "https://play.spotify.com/track/6NwbeybX6TDtXlpXvnUOZC",
            "urlAllmusic": "http://www.allmusic.com/song/mt0002228132",
            "urlMusicBrainz": "http://musicbrainz.org/recording/49b8371f-156a-41e8-92c9-8cd899235b90"
            }
        }
    }
 * @apiError error The ObjectId is not valid.
 * @apiErrorExample Error-Response:
    HTTP/1.1 404 Not Found
    {
        "error": "You must type a valid ObjectId"
    }
 * @apiError error The artistId was not found.
 * @apiErrorExample Error-Response:
    HTTP/1.1 404 Not Found
    {
        "error": "Artist not found"
    }
 * @apiError error The albumId was not found
 * @apiErrorExample Error-Response:
    HTTP/1.1 404 Not Found
    {
        "error": "Album not found"
    }
 * @apiError error The songId was not found
 * @apiErrorExample Error-Response:
    HTTP/1.1 404 Not Found
    {
        "error": "Song not found"
    }
 */
router.get('/artist_id/:artistId/album_id/:albumId/song_id/:songId', new RateLimit(config.http.limit_request.search), searchController.get_songById);
//PUT SONG OBJECT
router.put('/artist/:artistName/album/:albumName/song/:songName', new RateLimit(config.http.limit_request.search), searchController.put_song);
//==========================================================================================================================\\
//====================================API REST POUR RECUPERER UN ARTISTE PAR NOM DE MEMBRE==================================\\
//==========================================================================================================================\\
/**
 * @api {get} api/v1/member/name/:memberName Get an artist document by memberName
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/search/member/name/Adrian%20Smith
 * @apiVersion 1.0.0
 * @apiName GetArtistByMemberName
 * @apiGroup Search
 * 
 * @apiParam {String} memberName member's name
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    {
        "_id": "56d8432453a7ddfc01f96c1f",
        "name": "Iron Maiden
    }
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */
router.get('/member/name/:memberName', searchController.get_member_name_memberName);
//==========================================================================================================================\\
//=============================================WEBSERVICE REST POUR LA RECHERCHE============================================\\
//==========================================================================================================================\\
//permet de chercher des artistes via la barre de recherche
//FUTURE voir la configuration
router.get('/fulltext/:searchText', searchController.get_fullTextSearch);

router.get('/more/:searchText', new RateLimit(config.http.limit_request.search), searchController.get_moreSearchText);


export default router;