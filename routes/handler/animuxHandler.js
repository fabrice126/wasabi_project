 import express from 'express';
 import config from '../conf/conf';
 import fs from 'fs';
 import utilHandler from './utilHandler';
 import {
     ObjectId
 } from 'mongoskin';
 const PATH_MAPPING_ANIMUX = "./mongo/animux";
 const COLLECTIONSONG = config.database.collection_song;
 const COLLECTIONARTIST = config.database.collection_artist;


 /**
  * Si un nom d'artiste animux match avec un nom d'artiste wasabi alors on rename le nom d'artiste animux avec le nom d'artiste wasabi
  * Le nom d'artiste sera alors le même que sur wasabi 
  * @param {*} req 
  * @param {*} res 
  */
 var sanitizeAndRenameDirArtist = (req, res) => {
     var dirArray = [],
         //récupération des noms d'artistes dans les dossiers : exemple dirArray[i] = '/M/Metallica'
         dirArray = readDirsArtists(PATH_MAPPING_ANIMUX);
     let l = dirArray.length,
         i = 0,
         nbMatch = 0;
     //on chercher si les noms d'artistes du tableau dirArray match avec des noms d'artistes de notre base
     (function loopArray(i) {
         var pathName = dirArray[i];
         var escapePath = utilHandler.escapeRegExp(PATH_MAPPING_ANIMUX),
             re = new RegExp(escapePath + "\/[A-Z]\/");
         if (re.test(pathName)) {
             var artistName = pathName.replace(re, "");
             //Des caracteres n'ont pas le bon encodage. Il faut donc les remplacer par les bons caracteres
             artistName = artistName.replace(/é/gi, "é").replace(/á/gi, "á").replace(/í/gi, "í").replace(/ó/gi, "ó").replace(/ú/gi, "ú").replace(/´/gi, "'");
             artistName = decodeURIComponent(artistName.trim());
             req.db.collection(COLLECTIONARTIST).findOne({
                 name: new RegExp("^" + utilHandler.escapeRegExp(artistName) + "$", "i")
             }, (err, artist) => {
                 if (err) {
                     return res.status(404).json(config.http.error.artist_404);
                 }
                 if (artist != null) {
                     let pathToArtist = PATH_MAPPING_ANIMUX + '/' + artist.name[0].toUpperCase() + '/' + encodeURIComponent(artist.name);
                     console.log(pathName, pathToArtist);
                     fs.rename(pathName, pathToArtist, function (err) {
                         if (err) throw err;
                     });
                     nbMatch++;
                     if (i % 100 == 0) {
                         console.log(nbMatch + "/" + i + '     ' + pathToArtist);
                     }
                 }
             });
         }
         if (i < l) {
             i++;
             loopArray(i);
         }
     })(i)
     res.json(config.http.valid.send_message_ok);
 };

 /**
  * Permet de trouver les répertoires ne matchant pas avec les noms d'artiste de notre base de données 
  * et ainsi pouvoir faire une correction manuelle des répertoires afin qu'ils matchs avec nos noms d'artistes
  * @param {*} req 
  * @param {*} res 
  */
 var getDirArtist = (req, res) => {
     var dirArray = [],
         options = {
             flags: 'w',
             autoClose: true
         },
         loggerNotFound = fs.createWriteStream('animux_artist_not_found_log.txt', options),
         //récupération des noms d'artistes dans les dossiers : exemple dirArray[i] = '/M/Metallica'
         dirArray = readDirsArtists(PATH_MAPPING_ANIMUX);
     let l = dirArray.length,
         i = 0,
         nbMatch = 0;
     //on chercher si les noms d'artistes du tableau dirArray match avec des noms d'artistes de notre base
     (function loopArray(i) {
         var pathName = dirArray[i];
         var escapePath = utilHandler.escapeRegExp(PATH_MAPPING_ANIMUX),
             re = new RegExp(escapePath + "\/[A-Z]\/");
         if (re.test(pathName)) {
             var artistName = pathName.replace(re, "");
             //Après avoir lancé l'API de sanitizeAndRenameDirArtist les noms d'artistes auront des caractère encodé, il faut donc les décoder
             artistName = decodeURIComponent(artistName);
             req.db.collection(COLLECTIONARTIST).findOne({
                 name: artistName
             }, (err, artist) => {
                 if (err) {
                     return res.status(404).json(config.http.error.artist_404);
                 }
                 if (artist != null) {
                     let pathToArtist = PATH_MAPPING_ANIMUX + '/' + artistName[0].toUpperCase() + '/' + encodeURIComponent(artistName);
                     req.db.collection(COLLECTIONARTIST).updateOne({
                         name: artistName
                     }, {
                         $set: {
                             animux_path: pathToArtist
                         }
                     });
                     nbMatch++;
                     console.log(nbMatch + "/" + i + '     ' + pathToArtist);
                 } else {
                     loggerNotFound.write(artistName + "\n");
                 }
             });
         }
         if (i < l) {
             i++;
             loopArray(i);
         }
     })(i)
     res.json(config.http.valid.send_message_ok);
 };

 /**
  * Permet de trouver les fichiers contenant la synchronisation des lyrics ne matchant pas avec le nom des musiques 
  * de notre base de données et ainsi pouvoir faire une correction manuelle des fichiers
  * @param {*} req 
  * @param {*} res 
  */
 var getFileSong = (req, res) => {
     var options = {
             flags: 'w',
             autoClose: true
         },
         loggerNotFound = fs.createWriteStream('animux_song_not_found_log.txt', options),
         loggerFound = fs.createWriteStream('animux_song_found_log.txt', options);
     req.db.collection(COLLECTIONARTIST).find({
         animux_path: {
             $exists: 1
         }
     }, {
         animux_path: 1,
         name: 1
     }).toArray((err, tArtists) => {
         if (err) {
             return res.status(404).json(config.http.error.artist_404);
         }
         let nbMatch = 0,
             nbTotal = 0,
             nbEnd = 0;
         for (var i = 0; i < tArtists.length; i++) {
             let fileArray = readFilesSongs(tArtists[i].animux_path);
             for (var j = 0; j < fileArray.length; j++) {
                 var fileName = fileArray[j].replace(tArtists[i].animux_path + '/', "").replace(/_Animux.txt/i, "").replace(/\(live\)/i, "").replace("’", "'");
                 fileName = fileName.trim();
                 ((filePathName, fileName) => {
                     nbTotal++;
                     req.db.collection(COLLECTIONSONG).find({
                         $and: [{
                             name: tArtists[i].name
                         }, {
                             title: new RegExp("^" + utilHandler.escapeRegExp(fileName) + "$", "i")
                         }]
                     }).toArray((err, tSongs) => {
                         if (err) {
                             return res.status(404).json(config.http.error.song_404);
                         }
                         if (tSongs.length) {
                             readContentFileSong(filePathName).then((data) => {
                                 nbEnd++;
                                 nbMatch++
                                 console.log(filePathName + " trouvé: " + nbMatch + '/' + (nbTotal));
                                 loggerFound.write(filePathName + "\n");
                                 req.db.collection(COLLECTIONSONG).updateMany({
                                     $and: [{
                                         name: tSongs[0].name
                                     }, {
                                         title: new RegExp("^" + utilHandler.escapeRegExp(fileName) + "$", "i")
                                     }]
                                 }, {
                                     $set: {
                                         animux_path: filePathName,
                                         animux_content: data
                                     }
                                 });
                                 if (nbEnd == nbTotal) {
                                     console.log("END : " + nbMatch + '/' + nbTotal);
                                 }
                             }).catch((err) => {
                                 nbEnd++;
                                 console.error(err);
                                 if (nbEnd == nbTotal) {
                                     console.log("END : " + nbMatch + '/' + nbTotal);
                                 }
                             });
                         } else {
                             nbEnd++;
                             loggerNotFound.write(filePathName + "\n");
                             if (nbEnd == nbTotal) {
                                 console.log("END : " + nbMatch + '/' + nbTotal);
                             }
                         }
                     })
                 })(fileArray[j], fileName);
             }
         }
     });
     res.json(config.http.valid.send_message_ok);
 };

 /**
  * 
  * @param {*} filePath 
  */
 var readContentFileSong = (filePath) => {
     return new Promise(function (resolve, reject) {
         fs.readFile(filePath, 'utf8', function (err, data) {
             if (err) {
                 return reject(err);
             }
             return resolve(data);
         });
     });
 };
 /**
  * 
  * @param {*} rootPath 
  */
 var readFilesSongs = (rootPath) => {
     var fileArray = [];
     var files = fs.readdirSync(rootPath);
     let l = files.length,
         i = 0;
     for (i; i < l; i++) {
         var pathFile = rootPath + '/' + files[i];
         if (fs.lstatSync(pathFile).isFile()) {
             fileArray.push(pathFile);
         }
     }
     return fileArray;
 }
 /**
  * 
  * @param {*} rootPath 
  */
 var readDirsArtists = (rootPath) => {
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
     })(rootPath);
     return dirArray;
 }
 exports.getDirArtist = getDirArtist;
 exports.getFileSong = getFileSong;
 exports.sanitizeAndRenameDirArtist = sanitizeAndRenameDirArtist;