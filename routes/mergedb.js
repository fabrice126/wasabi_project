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
/**
 * Permet de merge les lyrics de la BDD local avec les lyrics de la BDD du serveur
 */

router.get('/song/lyrics',function(req, res) {
    var db = req.db;
    this.console.log("dedans /mergedb/song/lyrics");
    var request = {lyrics:/Unfortunately, we are not licensed to display/};
    // var projection = {_id:1,name:1,lyrics:1,titre:1,albumTitre:1};
    var projection = {};
    var collection = config.database.collection_song;
    var isNotEq = 0 ;
    db.collection(collection).find(request,projection).toArray(function(err, tSongs) {
        var i = 0;
        var songLength = tSongs.length;
        //Recursivement avec un timeout afin d'éviter l'erreur : possible EventEmitter memory leak detected. 51 open listeners added. Use emitter.setMaxListeners() to increase limit
        (function loopSong(i){
            //On va chercher dans la BDD du serveur qu'on a importé en local
            (function(song){
                var next = ++i;
                db_server.collection(collection).findOne({_id: new ObjectId(song._id) }, projection, function (err, songServer) {
                    //Alors la chanson a été modifié sur le serveur
                    // if(!songServer.lyrics.match(/Unfortunately, we are not licensed to display/)){
                    if(songServer.lyrics.length != song.lyrics.length){
                        //donc on modifie en local
                        isNotEq = isNotEq+1;
                        console.log(songServer.name+" - "+songServer.titre+" - "+songServer._id+" - "+songServer.lyrics.length+" <-> "+song.lyrics.length);
                    }
                });
                if(i<songLength){
                    setTimeout(function(){
                        loopSong(next);
                    },1)
                }else{
                    console.log("Traitement terminé");
                    console.log("isNotEq = "+isNotEq);
                }
            })(tSongs[i]);
        })(i);
    });
    res.send("OK");
});

module.exports = router;