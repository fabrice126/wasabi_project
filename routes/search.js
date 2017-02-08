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
        case "artists":
            tObjectRequest = searchHandler.constructData("name", tParamToFind);
            db.collection(COLLECTIONARTIST).find({
                $or: tObjectRequest
            }, {
                "name": 1
            }).skip(skip).limit(LIMIT).toArray((err, artists) => {
                if (err) throw err;
                objSend.artists = artists;
                res.send(JSON.stringify(objSend));
            });
            break;
        case "albums":
            tObjectRequest = searchHandler.constructData("titre", tParamToFind);
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
                    "titleAlbum": "$titre",
                    "name": 1
                }
            }], (err, albums) => {
                if (err) throw err;
                objSend.albums = albums;
                res.send(JSON.stringify(objSend));
            });
            break;
        case "songs":
            tObjectRequest = searchHandler.constructData("titre", tParamToFind);
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
                    "albumTitre": 1,
                    "name": 1,
                    "titleSong": "$titre"
                }
            }], (err, songs) => {
                if (err) throw err;
                objSend.songs = songs;
                res.send(JSON.stringify(objSend));
            });
            break;
        default:
            res.status(404).send([{
                error: config.http.error.global_404
            }]);
            break;
    }
});

//==========================================================================================================================\\
//==============================WEBSERVICE REST POUR LA NAVIGATION ENTRE CATEGORIES (SUBJCET)===============================\\
//==========================================================================================================================\\
//GET CATEGORY PAR NOM DE CATEGORY ET PAR COLLECTION
router.get('/category/:collection/:categoryName', (req, res) => {
    var collection = req.params.collection;
    if (collection !== COLLECTIONARTIST && collection !== COLLECTIONALBUM && collection !== COLLECTIONSONG) {
        return res.status(404).send([{
            error: config.http.error.global_404
        }]);
    }
    var categoryName = req.params.categoryName;
    req.db.collection(collection).find({
        subject: categoryName
    }, {
        name: 1,
        titre: 1,
        albumTitre: 1
    }).sort({
        titre: 1
    }).limit(LIMIT).toArray((err, objs) => {
        res.send(JSON.stringify(objs));
    })
});

//==========================================================================================================================\\
//====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE PRODUCER=====================================\\
//==========================================================================================================================\\
//GET PRODUCER PAR NOM DE PRODUCER
//Peut évoluer en /producer/:collection/:producerName avec :collection = artist/album/song si un artist ou un album a des producer
router.get('/producer/:producerName', (req, res) => {
    var producerName = req.params.producerName;
    req.db.collection(COLLECTIONSONG).find({
        producer: producerName
    }, {
        name: 1,
        titre: 1,
        albumTitre: 1
    }).sort({
        titre: 1
    }).limit(LIMIT).toArray((err, objs) => {
        res.send(JSON.stringify(objs));
    })
});

//==========================================================================================================================\\
//===================================WEBSERVICE REST POUR LA NAVIGATION ENTRE RECORDLABEL===================================\\
//==========================================================================================================================\\
//GET RECORDLABEL PAR NOM DE RECORDLABEL
//Peut évoluer en /recordlabel/:collection/:recordLabelName avec :collection = artist/album/song si un artiste ou un album a des recordLabel
router.get('/recordlabel/:recordLabelName', (req, res) => {
    var db = req.db;
    var recordLabelName = req.params.recordLabelName;
    db.collection(COLLECTIONSONG).find({
        recordLabel: recordLabelName
    }, {
        name: 1,
        titre: 1,
        albumTitre: 1
    }).sort({
        titre: 1
    }).limit(LIMIT).toArray((err, objs) => {
        res.send(JSON.stringify(objs));
    })
});
//==========================================================================================================================\\
//=====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE GENRE=======================================\\
//==========================================================================================================================\\
//GET RECORDLABEL PAR NOM DE RECORDLABEL
//Peut évoluer en /recordlabel/:collection/:genreName avec :collection = album/song si un album a des Genre
router.get('/genre/:genreName', (req, res) => {
    var genreName = req.params.genreName;
    req.db.collection(COLLECTIONSONG).find({
        genre: genreName
    }, {
        name: 1,
        titre: 1,
        albumTitre: 1
    }).sort({
        titre: 1
    }).limit(LIMIT).toArray((err, objs) => {
        res.send(JSON.stringify(objs));
    })
});
//==========================================================================================================================\\
//====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE RECORDED=====================================\\
//==========================================================================================================================\\
//GET RECORDED PAR NOM DE RECORDED
router.get('/recorded/:recordedName', (req, res) => {
    var recordedName = req.params.recordedName;
    req.db.collection(COLLECTIONSONG).find({
        recorded: recordedName
    }, {
        name: 1,
        titre: 1,
        albumTitre: 1
    }).sort({
        titre: 1
    }).limit(LIMIT).toArray((err, objs) => {
        res.send(JSON.stringify(objs));
    })
});
//==========================================================================================================================\\
//=====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE AWARD=======================================\\
//==========================================================================================================================\\
//GET AWARD PAR NOM DE AWARD
router.get('/award/:awardName', (req, res) => {
    var awardName = req.params.awardName;
    req.db.collection(COLLECTIONSONG).find({
        award: awardName
    }, {
        name: 1,
        titre: 1,
        albumTitre: 1
    }).sort({
        titre: 1
    }).limit(LIMIT).toArray((err, objs) => {
        res.send(JSON.stringify(objs));
    })
});
//==========================================================================================================================\\
//=====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE WRITER======================================\\
//==========================================================================================================================\\
//GET WRITER PAR NOM DE WRITER
router.get('/writer/:writerName', (req, res) => {
    var writerName = req.params.writerName;
    req.db.collection(COLLECTIONSONG).find({
        writer: writerName
    }, {
        name: 1,
        titre: 1,
        albumTitre: 1
    }).sort({
        titre: 1
    }).limit(LIMIT).toArray((err, objs) => {
        res.send(JSON.stringify(objs));
    })
});
//==========================================================================================================================\\
//=====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE FORMAT======================================\\
//==========================================================================================================================\\
//GET FORMAT PAR NOM DE FORMAT
router.get('/format/:formatName', (req, res) => {
    var formatName = req.params.formatName;
    req.db.collection(COLLECTIONSONG).find({
        format: formatName
    }, {
        name: 1,
        titre: 1,
        albumTitre: 1
    }).sort({
        titre: 1
    }).limit(LIMIT).toArray((err, objs) => {
        res.send(JSON.stringify(objs));
    })
});
//==========================================================================================================================\\
//====================WEBSERVICE REST POUR COMPTER LE NOMBRE D'OCCURENCE DE DOCUMENT DANS UNE COLLECTION ===================\\
//==========================================================================================================================\\
// /!\/!\ Cette fonction fait exploser la RAM car elle compte le nombre d'occurence de chaque titre commençant par la lettre :lettre dans la collection song/!\/!\

router.get('/count/:collection/:lettre', (req, res) => {
    // var db = req.db, collection= req.params.collection,lettre= req.params.lettre, tParamToFind, fieldCollection, tObjectRequest;
    // if(collection == "Artists"){
    //     collection = COLLECTIONARTIST;
    //     fieldCollection = "name";
    // }else if(collection == "Albums"){
    //     collection = COLLECTIONALBUM;
    //     fieldCollection = "titre";
    // }else if(collection == "Songs"){
    //     collection = COLLECTIONSONG;
    //     fieldCollection = "titre";
    // }
    // if(collection !== COLLECTIONARTIST && collection !==COLLECTIONALBUM && collection !==COLLECTIONSONG || lettre.length>2){
    //     return res.status(404).send([{error:config.http.error.global_404}]);
    // }
    // tParamToFind = searchHandler.optimizeFind(lettre);
    // tObjectRequest = searchHandler.constructData(fieldCollection, tParamToFind);
    // db.collection(collection).count({$or:tObjectRequest},(err, countfield) => {
    //     if(err){
    //         console.log(err);
    //         return res.status(404).send([{error:config.http.error.global_404}]);
    //     }
    //     var dbcount = {count:countfield};

    var dbcount = {
        count: 0
    }; // si tout est commenté
    res.send(JSON.stringify(dbcount));
    // });
});
//==========================================================================================================================\\
//================WEBSERVICE REST POUR COMPTER LE NOMBRE D'OCCURENCE D'UN ATTRIBUT DANS UNE COLLECTION DONNEE===============\\
//==========================================================================================================================\\
router.get('/count/:collection/:fieldName/:fieldValue', (req, res) => {
    var collection = req.params.collection,
        fieldName = req.params.fieldName,
        fieldValue = req.params.fieldValue;
    if (collection !== COLLECTIONARTIST && collection !== COLLECTIONALBUM && collection !== COLLECTIONSONG) {
        return res.status(404).send([{
            error: config.http.error.global_404
        }]);
    }
    var query = {};
    query[fieldName] = fieldValue;
    req.db.collection(collection).count(query, (err, countfield) => {
        if (err) {
            console.log(err);
            return res.status(404).send([{
                error: config.http.error.global_404
            }]);
        }
        var dbcount = {
            count: countfield
        };
        res.send(JSON.stringify(dbcount));
    });
});
//==========================================================================================================================\\
//============================WEBSERVICE REST POUR L'AFFICHAGE DU NOMBRE D'ARTISTES/ALBUMS/SONGS============================\\
//==========================================================================================================================\\
//GET PERMET D'OBTENIR LE NOMBRE D'ARTISTES/ALBUMS/SONGS
router.get('/dbinfo', (req, res) => {
    var db = req.db;
    db.collection(COLLECTIONARTIST).count((err, count) => {
        var dbinfo = {};
        dbinfo.nbArtist = count;
        db.collection(COLLECTIONALBUM).count((err, count) => {
            dbinfo.nbAlbum = count;
            db.collection(COLLECTIONSONG).count((err, count) => {
                dbinfo.nbSong = count;
                res.send(JSON.stringify(dbinfo));
            });
        });
    });
});
//==========================================================================================================================\\
//=======================================WEBSERVICE REST POUR LA GESTION DES ARTISTES=======================================\\
//==========================================================================================================================\\
//GET ARTIST PAR NOM D'ARTISTE (UN NOM D'ARTISTE EST UNIQUE -> REGLE DE LYRICS WIKIA LORS DE L'EXTRACTION DES DONNEES)
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
            return res.status(404).send([{
                error: config.http.error.artist_404
            }]);
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
            "dateSortie": -1
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
                        "titre": 1
                    }).sort({
                        "position": 1
                    }).toArray((err, songs) => {
                        if (err) throw err;
                        //On construit le tableau songs afin d'y ajouter les infos des musiques
                        album.songs = songs;
                        cnt++;
                        if (nbAlbum == cnt) {
                            res.send(JSON.stringify(artist));
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
router.get('/artist/:artistName/album/:albumName', (req, res) => {
    var db = req.db,
        albumName = req.params.albumName,
        artistName = req.params.artistName;
    db.collection(COLLECTIONARTIST).findOne({
        name: artistName
    }, {
        "urlAlbum": 0,
        "wordCount": 0
    }, (err, artist) => {
        if (artist == null) {
            return res.status(404).send([{
                error: config.http.error.artist_404
            }]);
        }
        //!\ UN ARTIST PEUT AVOIR PLUSIEURS FOIS UN MEME TITRE D'ALBUM /!\ ERREUR A CORRIGER -> si on clique sur un album
        db.collection(COLLECTIONALBUM).findOne({
            $and: [{
                "titre": albumName
            }, {
                "id_artist": artist._id
            }]
        }, {
            "urlAlbum": 0,
            "wordCount": 0
        }, (err, album) => {
            if (album == null) {
                return res.status(404).send([{
                    error: config.http.error.album_404
                }]);
            }
            db.collection(COLLECTIONSONG).find({
                "id_album": album._id
            }, {
                "position": 1,
                "titre": 1
            }).toArray((err, songs) => {
                if (songs == null) {
                    return res.status(404).send([{
                        error: config.http.error.song_404
                    }]);
                }
                album.songs = songs;
                artist.albums = album;
                res.send(JSON.stringify(artist));

            });
        });
    });
});
//GET ALBUM PAR ID D'ARTISTE ET D'ALBUM
router.get('/artist_id/:artistId/album_id/:albumId', (req, res) => {
    var db = req.db,
        artistId = req.params.artistId,
        albumId = req.params.albumId;
    db.collection(COLLECTIONARTIST).findOne({
        _id: ObjectId(artistId)
    }, {
        "urlAlbum": 0,
        "wordCount": 0
    }, (err, artist) => {
        if (artist == null) {
            return res.status(404).send([{
                error: config.http.error.artist_404
            }]);
        }
        db.collection(COLLECTIONALBUM).findOne({
            "_id": ObjectId(albumId)
        }, {
            "urlAlbum": 0,
            "wordCount": 0
        }, (err, album) => {
            if (album == null) {
                return res.status(404).send([{
                    error: config.http.error.album_404
                }]);
            }
            db.collection(COLLECTIONSONG).find({
                "id_album": album._id
            }, {
                "position": 1,
                "titre": 1
            }).toArray((err, songs) => {
                if (songs == null) {
                    return res.status(404).send([{
                        error: config.http.error.song_404
                    }]);
                }
                album.songs = songs;
                artist.albums = album;
                res.send(JSON.stringify(artist));
            });
        });
    });
});

//PUT ALBUM PAR ID D'ABUM ET DE MUSIQUE
router.put('/artist/:artistName/album/:albumName', (req, res) => {
    var db = req.db,
        albumBody = req.body,
        albumTitre = albumBody.titre.trim(),
        nbSongUpdated = 0;
    //FUTURE Si un album n'a pas encore d'attribut songs. Peut se produire lors de l'ajout d'un album
    for (var j = 0; j < albumBody.songs.length; j++) {
        //On change le titre de l'album contenu dans les documents musiques
        albumBody.songs[j].albumTitre = albumTitre; //déja trim lors de l'initialisation
        albumBody.songs[j].titre = albumBody.songs[j].titre.trim();
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
    res.send("OK");
});

//==========================================================================================================================\\
//=======================================WEBSERVICE REST POUR LA GESTION DES MUSIQUES=======================================\\
//==========================================================================================================================\\
//GET SONG PAR NOM D'ARTISTE TITRE D'ALBUM ET TITRE DE MUSIQUE
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
            return res.status(404).send([{
                error: config.http.error.artist_404
            }]);
        }
        db.collection(COLLECTIONALBUM).findOne({
            $and: [{
                "id_artist": artist._id
            }, {
                "titre": albumName
            }]
        }, {
            "_id": 1,
            "titre": 1
        }, (err, album) => {
            if (album == null) {
                return res.status(404).send([{
                    error: config.http.error.album_404
                }]);
            }
            db.collection(COLLECTIONSONG).findOne({
                $and: [{
                    "id_album": album._id
                }, {
                    "titre": songName
                }]
            }, {
                "urlSong": 0,
                "wordCount": 0
            }, (err, song) => {
                if (song == null) {
                    return res.status(404).send([{
                        error: config.http.error.song_404
                    }]);
                }
                album.songs = song;
                artist.albums = album;
                res.send(JSON.stringify(artist));
            });
        });

    });
});
//GET SONG PAR ID D'ARTISTE,ALBUM,MUSIQUE
router.get('/artist_id/:artistId/album_id/:albumId/song_id/:songId', (req, res) => {
    console.log("test ===============");
    var db = req.db,
        artistId = req.params.artistId,
        albumId = req.params.albumId,
        songId = req.params.songId;
    db.collection(COLLECTIONARTIST).findOne({
        _id: ObjectId(artistId)
    }, {
        "_id": 1,
        "name": 1
    }, (err, artist) => {
        if (artist == null) {
            return res.status(404).send([{
                error: config.http.error.artist_404
            }]);
        }
        db.collection(COLLECTIONALBUM).findOne({
            "_id": ObjectId(albumId)
        }, {
            "_id": 1,
            "titre": 1
        }, (err, album) => {
            if (album == null) {
                return res.status(404).send([{
                    error: config.http.error.album_404
                }]);
            }
            db.collection(COLLECTIONSONG).findOne({
                "_id": ObjectId(songId)
            }, {
                "urlSong": 0,
                "wordCount": 0
            }, (err, song) => {
                if (song == null) {
                    return res.status(404).send([{
                        error: config.http.error.song_404
                    }]);
                }
                album.songs = song;
                artist.albums = album;
                res.send(JSON.stringify(artist));
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
    //!\ Il faut supprimer les attributs qui sont de type objectId dans notre base car songBody les récupéres en string
    delete songBody.id_album;
    delete songBody._id;
    db.collection(COLLECTIONSONG).update({
        _id: ObjectId(idSong)
    }, {
        $set: songBody
    }, (err) => {
        //On fait un POST sur elasticsearch afin de modifier le champs titre de la musique sur le BDD elasticsearch
        searchHandler.updateSongES(req, songBody, idSong)
    });
    res.send("OK");
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
                "fields": ["titre^4", "name^2", "albumTitre"]
            }
        },
        "size": maxinfo
    };
    searchHandler.fullTextQuery(req, maxinfo, queryArtist, querySong, maxinfoselected).then((resp) => {
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
                "fields": ["titre^4", "name^2", "albumTitre"]
            }
        },
        "size": LIMIT
    };
    var start = Date.now();
    searchHandler.fullTextQuery(req, LIMIT, queryArtist, querySong, maxinfoselected).then((resp) => {
        res.send(resp);
    }).catch((err) => {
        res.send(err);
    });
});


export default router;