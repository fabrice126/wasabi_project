/**
 * mergedb.js a pour but d'ajouter dans la BDD local les ajouts effectués par michel sur la BDD du serveur.
 * mergedb.js ne doit pas être utilisé sur le serveur car il risque d'entrainer une baisse des performances
 * avant d'utiliser mergedb.js assurez-vous d'avoir importé un dump récent de la BDD du serveur (mongorestore wasabi_server) pour cela :
 *  - importer votre base du serveur : sur le serveur taper la commande suivante dans le dossier wasabi_project/mongo/backup_mongo_tmp: mongodump --out wasabi_server
 *  - un dump de la BDD sur le serveur est maintenant disponible dans le dossier wasabi_project/mongo/backup_mongo_tmp
 * transferer ce dump en local dans le dossier local : wasabi_project/mongo/backup_mongo_tmp
 *  - Pour restaurer la BDD du serveur en local, taper la commande suivante dans le dossier wasabi_project/mongo/backup_mongo_tmp : mongorestore --db wasabi_server wasabi_server/wasabi
 */

var express     = require('express');
var router      = express.Router();
var db_server   = require('mongoskin').db("mongodb://localhost:27017/wasabi_server");
var ObjectId    = require('mongoskin').ObjectID;
var config      = require('./conf/conf.json');
const COLLECTIONARTIST  = config.database.collection_artist;
const COLLECTIONALBUM   = config.database.collection_album;
const COLLECTIONSONG    = config.database.collection_song;
/**
 * Permet de merge les lyrics ayant un probléme de droit d'auteur en local mais avec des paroles sur le serveur
 */
router.get('/song/lyricsnotlicensed',function(req, res) {
    var db = req.db, request = {lyrics:/Unfortunately, we are not licensed to display/}, isNotEq = 0 ;
    this.console.log("dedans /mergedb/song/lyrics");
    db.collection(COLLECTIONSONG).find(request).toArray(function(err, tSongs) {
        var i = 0, songLength = tSongs.length;
        //Recursivement avec un timeout afin d'éviter l'erreur : possible EventEmitter memory leak detected. 51 open listeners added. Use emitter.setMaxListeners() to increase limit
        (function loopSong(i){
            //On va chercher dans la BDD du serveur qu'on a importé en local
            (function(song){
                var next = ++i;
                db_server.collection(COLLECTIONSONG).findOne({_id: new ObjectId(song._id) }, function (err, songServer) {
                    //Alors la chanson a été modifié sur le serveur
                    if(songServer.lyrics.length != song.lyrics.length){
                        isNotEq = isNotEq+1;
                        //On met a jour la db local
                        db.collection(COLLECTIONSONG).update({_id : new ObjectId(song._id)}, { $set: {"lyrics":songServer.lyrics} });
                        console.log("Song updated = "+songServer.name+" - "+songServer.titre+" - "+songServer._id+" - "+songServer.lyrics.length+" <-> "+song.lyrics.length);
                    }
                });
                if(i<songLength){
                    setTimeout(function(){loopSong(next);},1)
                }else{
                    console.log("Traitement terminé. Document updated = "+isNotEq);
                }
            })(tSongs[i]);
        })(i);
    });
    res.send("OK");
});
/**
 * Permet de merge les lyrics de la BDD local avec les lyrics de la BDD du serveur
 */
router.get('/song/lyrics',function(req, res) {
    var db = req.db, request = {}, limit = 100000, skip = 1000000, hasNext = true, isNotEq = 0 ;
    this.console.log("dedans /mergedb/song/lyrics");
    (function loopSkipSong(skip){
        db.collection(COLLECTIONSONG).find(request).skip(skip).limit(limit).toArray(function(err, tSongs) {
            if(tSongs.length<limit){
                hasNext = false;
            }
            var i = 0, songLength = tSongs.length;
            //Recursivement avec un timeout afin d'éviter l'erreur : possible EventEmitter memory leak detected. 51 open listeners added. Use emitter.setMaxListeners() to increase limit
            (function loopSong(i){
                //On va chercher dans la BDD du serveur qu'on a importé en local
                (function(song){
                    var next = ++i;
                    db_server.collection(COLLECTIONSONG).findOne({_id: new ObjectId(song._id) }, function (err, songServer) {
                        //Alors la chanson a été modifié sur le serveur
                        if(songServer.lyrics.length != song.lyrics.length){
                            isNotEq = isNotEq+1;
                            //On met a jour la db local
                            db.collection(COLLECTIONSONG).update({_id : new ObjectId(song._id)}, { $set: {"lyrics":songServer.lyrics} });
                            console.log("Song updated = "+songServer.name+" - "+songServer.titre+" - "+songServer._id+" - "+songServer.lyrics.length+" <-> "+song.lyrics.length);
                        }
                    });
                    if(i<songLength){
                        //Ce timeout évite l'erreur: RangeError: Maximum call stack size exceeded
                        setTimeout(function(){
                            loopSong(next);
                        },1)
                    }else if(!hasNext){
                        console.log("Traitement terminé. Document upadated = "+isNotEq);
                    }else{
                        skip += limit;
                        console.log("SKIP = "+skip);
                        loopSkipSong(skip);
                    }
                })(tSongs[i]);
            })(i);
        });
    })(skip);
    res.send("OK");
});
module.exports = router;