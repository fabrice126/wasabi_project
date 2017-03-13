import express from 'express';
import request from 'request';
import searchHandler from './handler/searchHandler.js';
import elasticSearchHandler from './handler/elasticSearchHandler.js';
import config from './conf/conf.json';
import {
    ObjectId
} from 'mongoskin';
const router = express.Router();
const COLLECTIONARTIST = config.database.collection_artist;
const COLLECTIONALBUM = config.database.collection_album;
const COLLECTIONSONG = config.database.collection_song;
const LIMIT = config.request.limit;
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

router.get('/categorie/:nomCategorie/lettre/:lettre/page/:numPage', (req, res, next) => {
    var tObjectRequest, skip, tParamToFind;
    var nomCategorie = req.params.nomCategorie.toLowerCase(),
        lettre = req.params.lettre,
        numPage = req.params.numPage,
        db = req.db,
        numPageTest = parseInt(numPage),
        objSend = {
            limit: LIMIT
        };
    //Si le numéro de page est un entier supérieur a 0 et qu'il y a moins de 3 lettres dans :lettre, on ne verifie pas si la variable lettre est un nombre car l'utilisateur doit aussi chercher par nombre s'il le souhaite
    if (Number.isInteger(numPageTest) && numPageTest >= 0 && lettre.length <= 2) {
        skip = numPage * LIMIT;
        tParamToFind = searchHandler.optimizeFind(lettre);
    } else {
        nomCategorie = "default";
    }
    switch (nomCategorie) {
        case "artist":
        case "artists":
            tObjectRequest = searchHandler.constructData("name", tParamToFind);
            db.collection(COLLECTIONARTIST).find({
                $or: tObjectRequest
            }, {
                "name": 1
            }).skip(skip).limit(LIMIT).toArray((err, artists) => {
                if (err) throw err;
                objSend.artists = artists;
                res.json(objSend);
            });
            break;
        case "album":
        case "albums":
            tObjectRequest = searchHandler.constructData("title", tParamToFind);
            db.collection(COLLECTIONALBUM).aggregate([{
                "$match": {
                    $or: tObjectRequest
                }
            }, {
                "$skip": skip
            }, {
                "$limit": LIMIT
            }, {
                $project: {
                    "titleAlbum": "$title",
                    "name": 1
                }
            }], (err, albums) => {
                if (err) throw err;
                objSend.albums = albums;
                res.json(objSend);
            });
            break;
        case "song":
        case "songs":
            tObjectRequest = searchHandler.constructData("title", tParamToFind);
            db.collection(COLLECTIONSONG).aggregate([{
                "$match": {
                    $or: tObjectRequest
                }
            }, {
                "$skip": skip
            }, {
                "$limit": LIMIT
            }, {
                $project: {
                    "albumTitle": 1,
                    "name": 1,
                    "titleSong": "$title"
                }
            }], (err, songs) => {
                if (err) throw err;
                objSend.songs = songs;
                res.json(objSend);
            });
            break;
        default:
            res.status(404).json(config.http.error.global_404);
            break;
    }
});

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
router.get('/category/:collection/:categoryName', (req, res) => {
    var collection = req.params.collection;
    if (collection !== COLLECTIONARTIST && collection !== COLLECTIONALBUM && collection !== COLLECTIONSONG) {
        return res.status(404).json(config.http.error.global_404);
    }
    var categoryName = req.params.categoryName;
    req.db.collection(collection).find({
        subject: categoryName
    }, {
        name: 1,
        title: 1,
        albumTitle: 1
    }).sort({
        title: 1
    }).limit(LIMIT).toArray((err, objs) => {
        res.json(objs);
    })
});

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
router.get('/producer/:producerName', (req, res) => {
    var producerName = req.params.producerName;
    req.db.collection(COLLECTIONSONG).find({
        producer: producerName
    }, {
        name: 1,
        title: 1,
        albumTitle: 1
    }).sort({
        title: 1
    }).limit(LIMIT).toArray((err, objs) => {
        res.json(objs);
    })
});

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


router.get('/recordlabel/:recordLabelName', (req, res) => {
    var db = req.db;
    var recordLabelName = req.params.recordLabelName;
    db.collection(COLLECTIONSONG).find({
        recordLabel: recordLabelName
    }, {
        name: 1,
        title: 1,
        albumTitle: 1
    }).sort({
        title: 1
    }).limit(LIMIT).toArray((err, objs) => {
        res.json(objs);
    })
});

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
router.get('/genre/:genreName', (req, res) => {
    var genreName = req.params.genreName;
    req.db.collection(COLLECTIONSONG).find({
        genre: genreName
    }, {
        name: 1,
        title: 1,
        albumTitle: 1
    }).sort({
        title: 1
    }).limit(LIMIT).toArray((err, objs) => {
        res.json(objs);
    })
});
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
router.get('/recorded/:recordedName', (req, res) => {
    var recordedName = req.params.recordedName;
    req.db.collection(COLLECTIONSONG).find({
        recorded: recordedName
    }, {
        name: 1,
        title: 1,
        albumTitle: 1
    }).sort({
        title: 1
    }).limit(LIMIT).toArray((err, objs) => {
        res.json(objs);
    })
});
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
router.get('/award/:awardName', (req, res) => {
    var awardName = req.params.awardName;
    req.db.collection(COLLECTIONSONG).find({
        award: awardName
    }, {
        name: 1,
        title: 1,
        albumTitle: 1
    }).sort({
        title: 1
    }).limit(LIMIT).toArray((err, objs) => {
        res.json(objs);
    })
});

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
router.get('/writer/:writerName', (req, res) => {
    var writerName = req.params.writerName;
    req.db.collection(COLLECTIONSONG).find({
        writer: writerName
    }, {
        name: 1,
        title: 1,
        albumTitle: 1
    }).sort({
        title: 1
    }).limit(LIMIT).toArray((err, objs) => {
        res.json(objs);
    })
});
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
router.get('/format/:formatName', (req, res) => {
    var formatName = req.params.formatName;
    req.db.collection(COLLECTIONSONG).find({
        format: formatName
    }, {
        name: 1,
        title: 1,
        albumTitle: 1
    }).sort({
        title: 1
    }).limit(LIMIT).toArray((err, objs) => {
        res.json(objs);
    })
});
//==========================================================================================================================\\
//====================WEBSERVICE REST POUR COMPTER LE NOMBRE D'OCCURENCE DE DOCUMENT DANS UNE COLLECTION ===================\\
//==========================================================================================================================\\
// /!\/!\ Cette fonction fait exploser la RAM car elle compte le nombre d'occurence de chaque title commençant par la lettre :lettre dans la collection song/!\/!\

router.get('/count/:collection/:lettre', (req, res) => {
    // var db = req.db, collection= req.params.collection,lettre= req.params.lettre, tParamToFind, fieldCollection, tObjectRequest;
    // if(collection == "Artists"){
    //     collection = COLLECTIONARTIST;
    //     fieldCollection = "name";
    // }else if(collection == "Albums"){
    //     collection = COLLECTIONALBUM;
    //     fieldCollection = "title";
    // }else if(collection == "Songs"){
    //     collection = COLLECTIONSONG;
    //     fieldCollection = "title";
    // }
    // if(collection !== COLLECTIONARTIST && collection !==COLLECTIONALBUM && collection !==COLLECTIONSONG || lettre.length>2){
    //     return res.status(404).json(config.http.error.global_404);
    // }
    // tParamToFind = searchHandler.optimizeFind(lettre);
    // tObjectRequest = searchHandler.constructData(fieldCollection, tParamToFind);
    // db.collection(collection).count({$or:tObjectRequest},(err, countfield) => {
    //     if(err){
    //         console.log(err);
    //         return res.status(404).json(config.http.error.global_404);
    //     }
    //     var dbcount = {count:countfield};

    var dbcount = {
        count: 0
    }; // si tout est commenté
    res.json(dbcount);
    // });
});
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

router.get('/count/:collection/:fieldName/:fieldValue', (req, res) => {
    var collection = req.params.collection,
        fieldName = req.params.fieldName,
        fieldValue = req.params.fieldValue;
    if (collection !== COLLECTIONARTIST && collection !== COLLECTIONALBUM && collection !== COLLECTIONSONG) {
        return res.status(404).json(config.http.error.global_404);
    }
    var query = {};
    query[fieldName] = fieldValue;
    req.db.collection(collection).count(query, (err, countfield) => {
        if (err) {
            console.log(err);
            return res.status(404).json(config.http.error.global_404);
        }
        var dbcount = {
            count: countfield
        };
        res.json(dbcount);
    });
});
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
router.get('/dbinfo', (req, res) => {
    var db = req.db;
    db.collection(COLLECTIONARTIST).count((err, count) => {
        var dbinfo = {};
        dbinfo.nbArtist = count;
        db.collection(COLLECTIONALBUM).count((err, count) => {
            dbinfo.nbAlbum = count;
            db.collection(COLLECTIONSONG).count((err, count) => {
                dbinfo.nbSong = count;
                res.json(dbinfo);
            });
        });
    });
});
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
        "rdf": " 1963-03-04 Jason Curtis Newsted Bass, guitar, drums, vocals Jason Newsted Jason Curtis Newsted (born March 4, 1963) is an American metal musician, known for playing bass guitar with the bands Metallica (in which he did occasional lead vocals) ...",
        "albums": [{
            "_id": "5714debe25ac0d8aee36b664",
            "name": "Metallica",
            "title": "Master Of Puppets",
            "publicationDate": "1986",
            "genre": "Thrash Metal",
            "length": "54:46",
            "id_artist": "56d93d84ce06f50c0fed8747",
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


router.get('/artist/:artistName', (req, res) => {
    var db = req.db,
        artistName = req.params.artistName;
    db.collection(COLLECTIONARTIST).findOne({
        name: artistName
    }, {
        "urlWikia": 0,
        wordCount: 0
    }, (err, artist) => {
        if (artist === null) {
            return res.status(404).json(config.http.error.artist_404);
        }
        db.collection(COLLECTIONALBUM).find({
            id_artist: artist._id
        }, {
            "urlWikipedia": 0,
            "genres": 0,
            "urlAlbum": 0,
            "wordCount": 0,
            "rdf": 0
        }).sort({
            "publicationDate": -1
        }).toArray((err, albums) => {
            var nbAlbum = albums.length,
                cnt = 0;
            //On construit le tableau albums afin d'y ajouter les infos des albums
            artist.albums = albums;
            for (var i = 0; i < nbAlbum; i++) {
                ((album) => {
                    db.collection(COLLECTIONSONG).find({
                        "id_album": album._id
                    }, {
                        "position": 1,
                        "title": 1
                    }).sort({
                        "position": 1
                    }).toArray((err, songs) => {
                        if (err) throw err;
                        //On construit le tableau songs afin d'y ajouter les infos des musiques
                        album.songs = songs;
                        cnt++;
                        if (nbAlbum == cnt) {
                            res.json(artist);
                        }
                    });
                })(artist.albums[i]);
            }
        })
    });
});
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
        "urlWikipedia": "http://en.wikipedia.org/wiki/Metallica",
        "urlOfficialWebsite": "http://www.metallica.com/",
        "urlFacebook": "http://www.facebook.com/metallica",
        "urlMySpace": "https://myspace.com/Metallica",
        "urlTwitter": "http://twitter.com/metallica",
        "locationInfo": ["United States", "California", "Los Angeles"],
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
        "rdf": " 1963-03-04 Jason Curtis Newsted Bass, guitar ...",
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
router.get('/artist/:artistName/album/:albumName', (req, res) => {
    var db = req.db,
        albumName = req.params.albumName,
        artistName = req.params.artistName;
    db.collection(COLLECTIONARTIST).findOne({
        name: artistName
    }, {
        "urlWikia": 0,
        "wordCount": 0
    }, (err, artist) => {
        if (artist == null) {
            return res.status(404).json(config.http.error.artist_404);
        }
        //!\ UN ARTIST PEUT AVOIR PLUSIEURS FOIS UN MEME TITRE D'ALBUM /!\ ERREUR A CORRIGER -> si on clique sur un album
        db.collection(COLLECTIONALBUM).findOne({
            $and: [{
                "title": albumName
            }, {
                "id_artist": artist._id
            }]
        }, {
            "urlAlbum": 0,
            "wordCount": 0
        }, (err, album) => {
            if (album == null) {
                return res.status(404).json(config.http.error.album_404);
            }
            db.collection(COLLECTIONSONG).find({
                "id_album": album._id
            }, {
                "position": 1,
                "title": 1
            }).toArray((err, songs) => {
                if (songs == null) {
                    return res.status(404).json(config.http.error.song_404);
                }
                album.songs = songs;
                artist.albums = album;
                res.json(artist);

            });
        });
    });
});
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
        "urlWikipedia": "http://en.wikipedia.org/wiki/Metallica",
        "urlOfficialWebsite": "http://www.metallica.com/",
        "urlFacebook": "http://www.facebook.com/metallica",
        "urlMySpace": "https://myspace.com/Metallica",
        "urlTwitter": "http://twitter.com/metallica",
        "locationInfo": ["United States", "California", "Los Angeles"],
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
        "rdf": " 1963-03-04 Jason Curtis Newsted Bass, guitar ...",
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
router.get('/artist_id/:artistId/album_id/:albumId', (req, res) => {
    var db = req.db,
        artistId = req.params.artistId,
        albumId = req.params.albumId;
    if (!ObjectId.isValid(artistId) || !ObjectId.isValid(albumId)) {
        return res.status(404).json(config.http.error.objectid_404);
    }
    db.collection(COLLECTIONARTIST).findOne({
        _id: ObjectId(artistId)
    }, {
        "urlWikia": 0,
        "wordCount": 0
    }, (err, artist) => {
        if (artist == null) {
            return res.status(404).json(config.http.error.artist_404);
        }
        db.collection(COLLECTIONALBUM).findOne({
            "_id": ObjectId(albumId)
        }, {
            "urlAlbum": 0,
            "wordCount": 0
        }, (err, album) => {
            if (album == null) {
                return res.status(404).json(config.http.error.album_404);
            }
            db.collection(COLLECTIONSONG).find({
                "id_album": album._id
            }, {
                "position": 1,
                "title": 1
            }).toArray((err, songs) => {
                if (songs == null) {
                    return res.status(404).json(config.http.error.song_404);
                }
                album.songs = songs;
                artist.albums = album;
                res.json(artist);
            });
        });
    });
});

//PUT ALBUM PAR NOM D'ALBUM
router.put('/artist/:artistName/album/:albumName', (req, res) => {
    var db = req.db,
        albumBody = req.body,
        albumTitle = albumBody.title.trim(),
        nbSongUpdated = 0;
    //FUTURE Si un album n'a pas encore d'attribut songs. Peut se produire lors de l'ajout d'un album
    for (var j = 0; j < albumBody.songs.length; j++) {
        //On change le title de l'album contenu dans les documents musiques
        albumBody.songs[j].albumTitle = albumTitle; //déja trim lors de l'initialisation
        albumBody.songs[j].title = albumBody.songs[j].title.trim();
        var idSong = albumBody.songs[j]._id;
        // On supprime l'id car mongodb lance un avertissement si ce champ n'est pas supprimé (_id est immutable pas d'update possible)
        delete albumBody.songs[j]._id;
        delete albumBody.songs[j].id_album;
        ((idSong, song, totalSong) => {
            db.collection(COLLECTIONSONG).update({
                _id: new ObjectId(idSong)
            }, {
                $set: song
            }, (err) => {
                if (err) throw err;
                searchHandler.updateSongES(req, song, idSong)
                //Quand toutes les musiques ont été update on update le document album. ainsi si il n'y a aucun risque que l'album soit update sans que les musiques le soit avant
                nbSongUpdated = nbSongUpdated + 1;
                if (totalSong == nbSongUpdated) {
                    //On supprime le champ songs car il n'éxiste pas dans la collection album
                    delete albumBody.songs; //FUTURE Si un album n'a pas encore d'attribut songs. Peut se produire lors de l'ajout d'un album
                    var idAlbum = albumBody._id;
                    // On supprime l'id car mongodb lance un avertissement si ce champ n'est pas supprimé (_id est immutable pas d'update possible)
                    delete albumBody._id;
                    delete albumBody.id_artist;
                    db.collection(COLLECTIONALBUM).update({
                        _id: new ObjectId(idAlbum)
                    }, {
                        $set: albumBody
                    });
                }
            })
        })(idSong, albumBody.songs[j], albumBody.songs.length);
    }
    res.json(config.http.valid.send_message_ok);
});

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
                "urlYoutube": "",
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
router.get('/artist/:artistName/album/:albumName/song/:songName', (req, res) => {
    var db = req.db,
        artistName = req.params.artistName,
        albumName = req.params.albumName,
        songName = req.params.songName;
    db.collection(COLLECTIONARTIST).findOne({
        name: artistName
    }, {
        "_id": 1,
        "name": 1
    }, (err, artist) => {
        if (artist == null) {
            return res.status(404).json(config.http.error.artist_404);
        }
        db.collection(COLLECTIONALBUM).findOne({
            $and: [{
                "id_artist": artist._id
            }, {
                "title": albumName
            }]
        }, {
            "_id": 1,
            "title": 1
        }, (err, album) => {
            if (album == null) {
                return res.status(404).json(config.http.error.album_404);
            }
            db.collection(COLLECTIONSONG).findOne({
                $and: [{
                    "id_album": album._id
                }, {
                    "title": songName
                }]
            }, {
                "urlSong": 0,
                "wordCount": 0
            }, (err, song) => {
                if (song == null) {
                    return res.status(404).json(config.http.error.song_404);
                }
                album.songs = song;
                artist.albums = album;
                res.json(artist);
            });
        });
    });
});
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
            "urlYoutube": "",
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
router.get('/artist_id/:artistId/album_id/:albumId/song_id/:songId', (req, res) => {
    var db = req.db,
        artistId = req.params.artistId,
        albumId = req.params.albumId,
        songId = req.params.songId;
    if (!ObjectId.isValid(artistId) || !ObjectId.isValid(albumId) || !ObjectId.isValid(songId)) {
        return res.status(404).json(config.http.error.objectid_404);
    }
    db.collection(COLLECTIONARTIST).findOne({
        _id: ObjectId(artistId)
    }, {
        "_id": 1,
        "name": 1
    }, (err, artist) => {
        if (artist == null) {
            return res.status(404).json(config.http.error.artist_404);
        }
        db.collection(COLLECTIONALBUM).findOne({
            "_id": ObjectId(albumId)
        }, {
            "_id": 1,
            "title": 1
        }, (err, album) => {
            if (album == null) {
                return res.status(404).json(config.http.error.album_404);
            }
            db.collection(COLLECTIONSONG).findOne({
                "_id": ObjectId(songId)
            }, {
                "urlSong": 0,
                "wordCount": 0
            }, (err, song) => {
                if (song == null) {
                    return res.status(404).json(config.http.error.song_404);
                }
                album.songs = song;
                artist.albums = album;
                res.json(artist);
            });
        });
    });
});
//PUT SONG OBJECT
router.put('/artist/:artistName/album/:albumName/song/:songName', (req, res) => {
    var db = req.db,
        songBody = req.body;
    //On récupére l'id de la musique afin de modifier l'objet en base de données
    var idSong = songBody._id;
    if (!ObjectId.isValid(idSong)) {
        return res.status(404).json(config.http.error.objectid_404);
    }
    //!\ Il faut supprimer les attributs qui sont de type objectId dans notre base car songBody les récupéres en string
    delete songBody.id_album;
    delete songBody._id;
    db.collection(COLLECTIONSONG).update({
        _id: ObjectId(idSong)
    }, {
        $set: songBody
    }, (err) => {
        //On fait un POST sur elasticsearch afin de modifier le champs title de la musique sur le BDD elasticsearch
        searchHandler.updateSongES(req, songBody, idSong)
    });
    res.json(config.http.valid.send_message_ok);
});
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
router.get('/member/name/:memberName', function (req, res, next) {
    var db = req.db,
        memberName = req.params.memberName;
    db.collection(COLLECTIONARTIST).find({
        "members.name": memberName
    }, {
        name: 1
    }).toArray((err, artists) => {
        if (err) {
            return res.status(404).json(config.http.error.internal_error_404);
        }
        return res.json(artists);
    });
});
//==========================================================================================================================\\
//=============================================WEBSERVICE REST POUR LA RECHERCHE============================================\\
//==========================================================================================================================\\
//permet de chercher des artistes via la barre de recherche
//FUTURE voir la configuration
router.get('/fulltext/:searchText', (req, res) => {
    var searchText = elasticSearchHandler.escapeElasticSearch(req.params.searchText);
    var maxinfo = config.request.limit_search_bar;
    var maxinfoselected = maxinfo / 2; // nombre d'élements devant apparaitre dans l'autocomplétion de recherche
    var queryArtist = {
        "query": {
            "query_string": {
                "default_field": "name",
                "query": searchText
            }
        },
        "size": maxinfo
    };
    var querySong = {
        "query": {
            "query_string": {
                "query": searchText,
                "fields": ["title^4", "name^2", "albumTitle"]
            }
        },
        "size": maxinfo
    };
    searchHandler.fullTextQuery(req, maxinfo, queryArtist, querySong, maxinfoselected).then((resp) => {
        //Ne pas renvoyer avec res.json
        res.send(resp);
    }).catch((err) => {
        res.send(err);
    });
});

router.get('/more/:searchText', (req, res) => {
    var searchText = elasticSearchHandler.escapeElasticSearch(req.params.searchText);
    var maxinfoselected = LIMIT / 2;
    var queryArtist = {
        "query": {
            "query_string": {
                "default_field": "name",
                "query": searchText
            }
        },
        "size": LIMIT
    };
    var querySong = {
        "query": {
            "query_string": {
                "query": searchText,
                "fields": ["title^4", "name^2", "albumTitle"]
            }
        },
        "size": LIMIT
    };
    var start = Date.now();
    searchHandler.fullTextQuery(req, LIMIT, queryArtist, querySong, maxinfoselected).then((resp) => {
        //Ne pas renvoyer avec res.json
        res.send(resp);
    }).catch((err) => {
        res.send(err);
    });
});


export default router;