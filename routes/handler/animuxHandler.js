 import express from 'express';
 import config from '../conf/conf.json';
 import fs from 'fs';
 import utilHandler from './utilHandler';
 const PATH_MAPPING_ANIMUX = "./mongo/animux";
 const COLLECTIONSONG = config.database.collection_song;
 const COLLECTIONARTIST = config.database.collection_artist;


 /**
  * Permet de trouver les répertoires ne matchant pas avec les noms d'artiste de notre base de données 
  * et ainsi pouvoir faire une correction manuelle des répertoires afin qu'ils matchs avec nos noms d'artistes
  * @param {*} req 
  * @param {*} res 
  */
 var getDirArtist = (req, res) => {
     var dirArray = [];
     (function loop(path) {
         var dirs = fs.readdirSync(path);
         let l = dirs.length,
             i = 0;
         for (i; i < l; i++) {
             var pathDir = path + '/' + dirs[i];
             if (fs.lstatSync(pathDir).isDirectory()) {
                 dirArray.push(pathDir);
                 loop(pathDir);
             }
         }
     })(PATH_MAPPING_ANIMUX);

     let l = dirArray.length,
         i = 0,
         nbMatch = 0;
     (function loopArray(i) {
         var pathName = dirArray[i];
         var escapePath = utilHandler.escapeRegExp(PATH_MAPPING_ANIMUX),
             re = new RegExp(escapePath + "\/[A-Z]\/");
         if (re.test(pathName)) {
             var artistName = pathName.replace(re, "");
             req.db.collection(COLLECTIONARTIST).findOne({
                 name: new RegExp("^" + utilHandler.escapeRegExp(artistName) + "$", "i")
             }, (err, artist) => {
                 if (err) {
                     return res.status(404).json(config.http.error.artist_404);
                 }
                 if (artist != null) {
                     console.log(artist.name + " == " + artistName + "  nbMatch = " + nbMatch++);
                 }
                 if (i < l) {
                     i++;
                     loopArray(i);
                 }
             });
         } else {
             if (i < l) {
                 i++;
                 loopArray(i);
             }
         }
     })(i)
     //  dirArray.forEach((pathName) => {});
     console.log(l);
     res.json(config.http.valid.send_message_ok);
 };

 /**
  * Permet de trouver les fichiers contenant la synchronisation des lyrics ne matchant pas avec le nom des musiques 
  * de notre base de données et ainsi pouvoir faire une correction manuelle des fichiers
  * @param {*} req 
  * @param {*} res 
  */
 var getFileSong = (req, res) => {

 };

 exports.getDirArtist = getDirArtist;
 exports.getFileSong = getFileSong;