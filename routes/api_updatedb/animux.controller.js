import express from 'express';
import config from '../conf/conf';
import utilHandler from '../handler/utilHandler';
import fs from 'fs';
import mv from 'mv';
import {
    ObjectId
} from 'mongoskin';
const PATH_MAPPING_ANIMUX = "./mongo/animux";
const FILENAME_ARTIST_NOT_FOUND = "animux_artist_not_found_log.txt";
const FILENAME_ARTIST_NOT_FOUND_2 = "animux_artist_not_found_log_2.txt";
const COLLECTIONSONG = config.database.collection_song;
const COLLECTIONARTIST = config.database.collection_artist;

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
var countArtistAnimuxDirInDB = (req, res) => {
    var sum = 0,
        count = 0;
    req.db.collection(COLLECTIONARTIST).find({
        animux_path: {
            $exists: 1
        }
    }).toArray((err, tArtists) => {
        for (var i = 0; i < tArtists.length; i++) sum += tArtists[i].animux_path.length;
        var dirsArtists = readDirsArtists(PATH_MAPPING_ANIMUX);
        for (var j = 0; j < dirsArtists.length; j++) {
            var letter = dirsArtists[j].substring(0, dirsArtists[j].lastIndexOf("/"));
            if (/[A-Z]/.test(letter)) count++;
        }
        res.json({
            wasabi_artist_with_animux_path: tArtists.length,
            total_artist_animux_path_in_wasabi: sum,
            total_animux_directories: count
        });
    })
}
var countSongAnimuxFileInDB = (req, res) => {
    var count = 0;
    req.db.collection(COLLECTIONSONG).count({
        animux_path: {
            $exists: 1
        }
    }, (err, countSong) => {
        console.log(countSong);
        var dirsArtists = readDirsArtists(PATH_MAPPING_ANIMUX);
        for (var i = 0; i < dirsArtists.length; i++) {
            var letter = dirsArtists[i].substring(0, dirsArtists[i].lastIndexOf("/"));
            if (/[A-Z]/.test(letter))
                for (var j = 0; j < readDirsSongs(dirsArtists[i]).length; j++) count++;
        }
        res.json({
            wasabi_artist_with_animux_path: countSong,
            total_animux_directories: count
        });
    })
}
/**
 * 1ère étape pour traiter les fichiers animux
 * Permet de nettoyer les noms de fichier animux en supprimant des caractères spéciaux : voir sanitizeFilename
 * @param {*} req 
 * @param {*} res 
 */
var sanitizeAndRenameDirArtist = (req, res) => {
    var dirsArtists = [],
        //récupération des noms d'artistes dans les dossiers : exemple dirsArtists[i] = './mongo/animux/M/Metallica'
        dirsArtists = readDirsArtists(PATH_MAPPING_ANIMUX),
        nbMatch = 0;
    //on chercher si les noms d'artistes du tableau dirsArtists match avec des noms d'artistes de notre base
    //  (function loopArray(i) {
    for (var i = 0, l = dirsArtists.length; i < l; i++) {
        var pathArtist = dirsArtists[i],
            letter = pathArtist.substring(0, pathArtist.lastIndexOf("/"));
        //Nous n'avons en DB que des artistes commençant par des lettres
        if (/[A-Z]/.test(letter)) {
            var pathToArtist,
                dirsSongs = [],
                //artistName = Metallica On supprime le path ./mongo/animux/M/
                artistName = pathArtist.substring(pathArtist.lastIndexOf("/") + 1),
                artistNameDecode = decodeURIComponent(artistName);
            pathToArtist = PATH_MAPPING_ANIMUX + '/' + artistName[0] + '/' + artistName;
            dirsSongs = readDirsSongs(pathToArtist);
            //On va itérer sur les titres des musiques, les sanitize et les renommer
            for (var j = 0, ll = dirsSongs.length; j < ll; j++) {
                var pathToSongUnsanitize, pathToSongSanitize, songNameDecode,
                    pathSong = dirsSongs[j],
                    songName = pathSong.substring(pathSong.lastIndexOf("/") + 1);
                if (!/%\s/i.test(songName)) {
                    songNameDecode = decodeURIComponent(songName);
                } else {
                    //permet de traité le cas des noms d'artistes avec un '%' dans le titre ex: 100% Emotional_Animux.txt
                    //Si on decode une erreur se produit on se décode donc pas ces artistes
                    songNameDecode = songName;
                    console.log("Non décodé lors du premier lancement de l'API: " + songName);
                }
                //construction du chemin avec le nom de musique non sanitize
                pathToSongUnsanitize = pathToArtist + '/' + songName;
                songNameDecode = sanitizeFilename(songNameDecode);
                songName = encodeURIComponent(songNameDecode);
                pathToSongSanitize = pathToArtist + '/' + songName.trim();
                fs.renameSync(pathToSongUnsanitize, pathToSongSanitize);
            }
            //On modifie maintenant les noms des artistes (dossier)
            var pathToArtistUnsanitize, pathToArtistSanitize, newPathArtist;
            //Chemin non sanitize pour l'artiste './mongo/animux/M/Metallica' 
            pathToArtistUnsanitize = pathArtist;
            //On récupére './mongo/animux/M/'
            newPathArtist = pathArtist.substring(0, pathArtist.lastIndexOf("/"));
            //On ajoute à './mongo/animux/M/' le nom de l'artiste sanitize 
            artistNameDecode = sanitizeFilename(artistNameDecode);
            artistName = encodeURIComponent(artistNameDecode);
            pathToArtistSanitize = newPathArtist + '/' + artistName.trim();
            (function (pathToArtistUnsanitize, pathToArtistSanitize) {
                fs.rename(pathToArtistUnsanitize, pathToArtistSanitize, (err) => {
                    if (err) {
                        //ex rename './mongo/animux/D/Destiny´s Child' -> './mongo/animux/D//Destiny's Child' problème d'accent ´s vs 's
                        //Lorsqu'on veut renommer le premier répertoire avec le nom du second, le second existe.
                        //Nous devons donc transférer les fichiers du premier répertoire vers le second répertoire et supprimer le 1er répertoire
                        if (err.code == "ENOTEMPTY") {
                            console.log("-------------------- ENOTEMPTY --------------------");
                            var dirsSongs = readDirsSongs(err.path);
                            for (var i = 0; i < dirsSongs.length; i++) {
                                var songName = dirsSongs[i].substring(dirsSongs[i].lastIndexOf("/") + 1);
                                console.log("ENOTEMPTY, attempt to rename = " + pathToArtistSanitize + '/' + songName);
                                fs.renameSync(dirsSongs[i], pathToArtistSanitize + '/' + songName);
                            }
                            //On supprime l'ancien dossier si il n'y a plus de fichier à l'intérieur
                            if (readDirsSongs(err.path).length == 0) fs.rmdir(pathToArtistUnsanitize);
                        } else {
                            console.log(err);
                            throw err;
                        }
                    }
                });
            })(pathToArtistUnsanitize, pathToArtistSanitize)
        }
    }
    console.log("Traitement terminé");
    res.json(config.http.valid.send_message_ok);
};

/**
 * 2ème étape pour traiter les fichiers animux
 * Enregistre en DB le nom des répertoires d'artistes trouvés dans le champ: animux_path de la collection artist
 * Permet de trouver les répertoires ne matchant pas avec les noms d'artistes de notre DB: enregistré dans le fichier animux_artist_not_found_log.txt
 * 
 * @param {*} req 
 * @param {*} res 
 */
var getDirArtist = (req, res) => {
    var dirArray = [],
        options = {
            flags: 'w',
            autoClose: true
        },
        loggerNotFound = fs.createWriteStream(FILENAME_ARTIST_NOT_FOUND, options),
        //récupération des noms d'artistes dans les dossiers : exemple dirArray[i] = '/M/Metallica'
        dirArray = readDirsArtists(PATH_MAPPING_ANIMUX),
        l = dirArray.length,
        i = 0,
        nbTotal = 0,
        nbMatch = 0;
    //on chercher si les noms d'artistes du tableau dirArray match avec des noms d'artistes de notre base
    (function loopArray(i) {
        var pathName = dirArray[i];
        var escapePath = utilHandler.escapeRegExp(PATH_MAPPING_ANIMUX),
            re = new RegExp(escapePath + "\/[A-Z]\/");
        if (re.test(pathName)) {
            var artistName = pathName.replace(re, ""),
                artistName = decodeURIComponent(artistName),
                escapePathArtist = utilHandler.escapeRegExp(artistName),
                artistRegex = new RegExp('^' + escapePathArtist + '$', 'i');
            nbTotal++;
            req.db.collection(COLLECTIONARTIST).findOne({
                $or: [{
                    nameVariations: artistRegex
                }, {
                    name: artistRegex
                }]
            }, (err, artist) => {
                if (err) return res.status(404).json(config.http.error.artist_404);
                if (artist != null) {
                    let pathToArtist = [];
                    pathToArtist.push(PATH_MAPPING_ANIMUX + '/' + artistName[0].toUpperCase() + '/' + encodeURIComponent(artistName));
                    req.db.collection(COLLECTIONARTIST).updateOne({
                        name: artist.name
                    }, {
                        $set: {
                            animux_path: pathToArtist
                        }
                    });
                    nbMatch++;
                    console.log(nbMatch + "/" + nbTotal + '     ' + pathToArtist);
                } else loggerNotFound.write(artistName + "\n");
            });
        }
        if (i < l) {
            i++;
            //To avoid leak memory
            setTimeout(() => loopArray(i), 5);
        }
    })(i)
    res.json(config.http.valid.send_message_ok);
};
/**
 * 3ème étape pour traiter les fichiers animux
 * Tentative pour trouver les artistes dans le fichier animux_artist_not_found_log.txt
 * Application de règles: ajouter 'The' avant chaque artiste, suppression des feat/ft/&/and/featuring/vs etc. 
 * 
 * @param {*} req
 * @param {*} res 
 */
var getNotFoundLogArtist = (req, res) => {
    var regexAnd = /(\s)(&|and)(\s)/i,
        nbNotMatchThe = 0,
        totalFeat = 0,
        totalAnd = 0,
        totalOther = 0,
        options = {
            flags: 'w',
            autoClose: true
        },
        loggerNotFound = fs.createWriteStream(FILENAME_ARTIST_NOT_FOUND_2, options);
    //A chaque promise lancer getDirArtist pour regénérer le fichier animux_artist_not_found_log.txt 
    fs.readFile(FILENAME_ARTIST_NOT_FOUND, 'utf8', (err, data) => {
        if (err) return res.json(config.http.error.internal_error_404);
        var tArtistAnimux = data.split("\n");
        for (var i = 0; i < tArtistAnimux.length; i++) {
            var artistName = tArtistAnimux[i];
            //We add 'the' before each artist and we find in the DB if the artist exists
            processArtistAddThe(req.db, artistName).then((artistName) => {
                //The artist not match so we pass it to the next function
                return processArtistRemoveThe(req.db, artistName);
            }).then((artistName) => {
                //The artist not match so we pass it to the next function
                return processArtistFeatVersus(req.db, artistName);
            }).then((artistName) => {
                //The artist not match so we pass it to the next function
                return processArtistAnd(req.db, artistName);
            }).then((artistName) => {
                console.log(artistName);
                loggerNotFound.write(artistName + "\n");
            }, (artistName) => { /*reject, artist found*/ });
        }
    });
    res.json(config.http.valid.send_message_ok);
}
/**
 * 4ème étape pour traiter les fichiers animux
 * Enregistre en DB le nom des répertoires des musiques trouvés dans le champ: animux_path de la collection artist
 * Permet de trouver les répertoires ne matchant pas avec les noms des musiques de notre BD: enregistré dans le fichier animux_song_not_found_log.txt.txt
 * 
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
    //We find artist having animux path
    req.db.collection(COLLECTIONARTIST).find({
        animux_path: {
            $exists: 1
        }
    }, {
        animux_path: 1,
        name: 1
    }).toArray((err, tArtists) => {
        if (err) return res.status(404).json(config.http.error.artist_404);
        let nbMatch = 0,
            nbTotal = 0,
            nbEnd = 0;
        for (var i = 0; i < tArtists.length; i++) {
            for (var ii = 0; ii < tArtists[i].animux_path.length; ii++) {
                //we are reading files in directory artist
                let fileArray = readFilesSongs(tArtists[i].animux_path[ii]);
                //for each songs in the previous directory (artist directory), we are going to find the title of each songs
                for (var j = 0; j < fileArray.length; j++) {
                    var fileName = fileArray[j].replace(tArtists[i].animux_path[ii] + '/', "").replace(/_Animux.txt/i, "").replace(/\(live\)/i, "").replace("’", "'");
                    fileName = decodeURIComponent(fileName).trim();
                    ((filePathName, fileName) => {
                        nbTotal++;
                        //We try to match songs with insensitive case
                        req.db.collection(COLLECTIONSONG).find({
                            $and: [{
                                name: tArtists[i].name
                            }, {
                                title: new RegExp("^" + utilHandler.escapeRegExp(fileName) + "$", "i")
                            }]
                        }).toArray((err, tSongs) => {
                            if (err) return res.status(404).json(config.http.error.song_404);
                            if (tSongs.length) {
                                readContentFileSong(filePathName).then((data) => {
                                    nbEnd++;
                                    nbMatch++
                                    console.log(filePathName + " trouvé: " + nbMatch + '/' + (nbTotal));
                                    loggerFound.write(filePathName + "\n");
                                    //we update each songs for an artist
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
                                    if (nbEnd == nbTotal) console.log("END : " + nbMatch + '/' + nbTotal);
                                }).catch((err) => {
                                    nbEnd++;
                                    console.error(err);
                                    if (nbEnd == nbTotal) console.log("END : " + nbMatch + '/' + nbTotal);
                                });
                            } else {
                                nbEnd++;
                                loggerNotFound.write(filePathName + "\n");
                                if (nbEnd == nbTotal) console.log("END : " + nbMatch + '/' + nbTotal);
                            }
                        })
                    })(fileArray[j], fileName);
                }
            }
        }
    });
    res.json(config.http.valid.send_message_ok);
};
/**
 * On ajoute "The" devant chaque nom d'artiste du fichier animux_artist_not_found_log.txt qui est généré par la fonction getDirArtist
 * @param {*} db pour chercher dans la base de données si l'artiste éxiste une fois le "The" ajouté 
 * @param {*} artistName le nom du fichier animux auquel on ajoutera le "The"
 */
var processArtistAddThe = (db, artistName) => {
    return new Promise((resolve, reject) => {
        db.collection(COLLECTIONARTIST).findOne({
            $or: [{
                nameVariations: new RegExp("^" + utilHandler.escapeRegExp("The " + artistName) + "$", "i")
            }, {
                name: new RegExp("^" + utilHandler.escapeRegExp("The " + artistName) + "$", "i")
            }]
        }, (err, artist) => {
            if (err) return res.status(404).json(config.http.error.artist_404);
            if (artist != null) {
                checkIfAnimuxPathExistAndRename(db, artistName, artist);
                //On reject la promise car il n'y a plus de traitement a faire, l'artiste a été trouvé.
                reject(artistName);
            } else {
                //On resolve le artistName
                resolve(artistName)
            }
        });
    });
}
/**
 * 
 * @param {*} db 
 * @param {*} artistName 
 */
var processArtistRemoveThe = (db, artistName) => {
    return new Promise((resolve, reject) => {
        if (!/^The(\s)/i.test(artistName)) return resolve(artistName);
        var artistNameWithoutThe = artistName.replace(/^The(\s)/i, "");
        db.collection(COLLECTIONARTIST).findOne({
            $or: [{
                nameVariations: new RegExp("^" + utilHandler.escapeRegExp(artistNameWithoutThe) + '$', "i")
            }, {
                name: new RegExp("^" + utilHandler.escapeRegExp(artistNameWithoutThe) + '$', "i")
            }]
        }, (err, artist) => {
            if (err) return res.status(404).json(config.http.error.artist_404);
            if (artist != null) {
                checkIfAnimuxPathExistAndRename(db, artistName, artist);
                //Nous n'avons plus a traiter ce dossier
                reject(artistName);
            } else {
                //artistName commence par The mais n'est pas trouvé dans la base de données
                resolve(artistName);
            }
        })
    })
}

/**
 * If an artist begin contain ft|feat|featuring|vs we must split it an keep the first artist name 
 * for example : David Guetta featuring Rihanna => we will only keep David Guetta for find the artist name in wasabi
 * @param {*} db 
 * @param {*} artistName 
 */

var processArtistFeatVersus = (db, artistName) => {
    return new Promise((resolve, reject) => {
        if (!/[\s](ft|feat|featuring|vs)[\s|\.]|[,]/i.test(artistName)) return resolve(artistName);
        var tArtists,
            artistNameReplace,
            splitChar = "|";
        //for example we will be splitting "David Guetta vs Rihanna feat Steve Aoki" to "David Guetta | Rihanna | Steve Aoki"
        artistNameReplace = artistName.replace(/[\s](ft|feat|featuring|vs)[\s|\.]|[,]/gi, splitChar);
        tArtists = artistNameReplace.split(splitChar);
        //We only keep the first artist
        var firstArtist = tArtists[0].trim();
        firstArtist = sanitizeFilename(firstArtist);
        db.collection(COLLECTIONARTIST).findOne({
            $or: [{
                nameVariations: new RegExp("^" + utilHandler.escapeRegExp(firstArtist) + "$", "i")
            }, {
                name: new RegExp("^" + utilHandler.escapeRegExp(firstArtist) + "$", "i")
            }]
        }, (err, artist) => {
            if (err) return res.status(404).json(config.http.error.artist_404);
            if (artist != null) {
                updateArtistAnimuxPath(db, artist, artistName);
                //rechercher dans animux_path.indexOf() si le lien que l'on veut ajouter existe déja
                //On reject la promise car il n'y a plus de traitement a faire, l'artiste a été trouvé.
                reject(artistName);
            } else {
                //On resolve le artistName
                resolve(artistName);
            }
        });
    });
}
/**
 * 
 * @param {*} db 
 * @param {*} artistName 
 */
var processArtistAnd = (db, artistName) => {
    return new Promise((resolve, reject) => {
        if (!/[\s](&|and)[\s]/i.test(artistName)) return resolve(artistName);
        var tArtists,
            artistNameReplace,
            splitChar = "|";
        //ex: si le nom d'artiste est : "Usher feat. Lil' Jon & Ludacris" artistNameReplace = Usher | Lil' Jon & Ludacris
        artistNameReplace = artistName.replace(/[\s](ft|feat|featuring|vs)[\s|\.]|[,]/gi, splitChar);
        tArtists = artistNameReplace.split(splitChar);
        var firstArtist = tArtists[0].trim();
        //Si un groupe est de type : David Guetta Feat. Chris Brown & Lil Wayne, David Guetta est l'artiste principal nous ne cherchons pas plus. 
        if (firstArtist.search(/[\s](&|and)[\s]/i) == -1) return resolve(artistName);
        //firstArtist = (artist1 & artist2) ou (artist1 and artist2)
        artistNameReplace = firstArtist.replace(/[\s](&|and)[\s]/gi, splitChar);
        tArtists = artistNameReplace.split(splitChar);
        //firstArtistName = artist1 on supprime artist2
        var firstArtistName = tArtists[0].trim();
        // on cherche d'abord l'artiste entier (artist1 & artist2). si non trouvé, alors on cherche le artist1 qui est l'artiste principal
        db.collection(COLLECTIONARTIST).findOne({
            $or: [{
                nameVariations: new RegExp("^" + utilHandler.escapeRegExp(firstArtist) + "$", "i")
            }, {
                name: new RegExp("^" + utilHandler.escapeRegExp(firstArtist) + "$", "i")
            }]
        }, (err, artist) => {
            if (err) return res.status(404).json(config.http.error.artist_404);
            //On a trouvé le nom d'artiste composé de : artist1 & artist2
            if (artist != null) {
                updateArtistAnimuxPath(db, artist, artistName);
                return reject(artistName);
            } else {
                //Nous n'avons pas trouvé le nom d'artiste composé de artist1 & artist 2. Nous cherchons donc uniquement avec artist1, qui est l'artiste principal
                db.collection(COLLECTIONARTIST).findOne({
                    $or: [{
                        nameVariations: new RegExp("^" + utilHandler.escapeRegExp(firstArtistName) + "$", "i")
                    }, {
                        name: new RegExp("^" + utilHandler.escapeRegExp(firstArtistName) + "$", "i")
                    }]
                }, (err, artist) => {
                    if (artist != null) {
                        updateArtistAnimuxPath(db, artist, artistName);
                        return reject(artistName);
                    } else {
                        return resolve(artistName);
                    }
                });
            }
        });
    });
}
/**
 * 
 * @param {*} artistName 
 * @param {*} artist Object: we will check if artist.animux_path exist
 */
var checkIfAnimuxPathExistAndRename = (db, artistName, artist) => {
    //il existe deux répertoires pour un même artiste. ex: ./mongo/animux/B/Beatles et ./mongo/animux/T/The%20Beatles
    //On va donc ajouter le contenu du dossier n'étant pas présent en DB (./mongo/animux/B/Beatles) dans le contenu du dossier en DB (./mongo/animux/T/The%20Beatles)
    //nous ne devons donc pas ajouter de champ animux_path dans la DB pour cette artiste
    if (artist.animux_path && artist.animux_path[0]) {
        //On deplace les fichiers de ./mongo/animux/B/Beatles vers le dossier ./mongo/animux/T/The%20Beatles 
        let oldPath = PATH_MAPPING_ANIMUX + '/' + artistName[0].toUpperCase() + '/' + encodeURIComponent(artistName);
        let pathToArtist = artist.animux_path[0];
        var tFileNameSongs = readFilesSongs(oldPath);
        //old path = (tFileNameSongs[i] = ./mongo/animux/B/Beatles/You%C2%B4ve%20got%20to%20hide%20your%20love%20away_Animux.txt)
        for (var i = 0; i < tFileNameSongs.length; i++) {
            var indexToSplit = tFileNameSongs[i].lastIndexOf('/') + 1;
            let songName = tFileNameSongs[i].substring(tFileNameSongs[i].length, indexToSplit);
            // new path = ./mongo/animux/T/The%20Beatles/You%C2%B4ve%20got%20to%20hide%20your%20love%20away_Animux.txt
            fs.renameSync(tFileNameSongs[i], pathToArtist + '/' + songName);
        }
        //On check avant de supprimer l'ancien dossier de l'artiste 
        //car il se peut que des fichiers existent toujours.
        if (readFilesSongs(oldPath).length == 0) {
            console.log("Suppression du dossier: " + oldPath);
            fs.rmdirSync(oldPath);
            updateArtistAnimuxPath(db, artist, artistName);
        } else console.log("Il existe encore des fichiers dans ce dossier: " + oldPath);
    } else {
        //En ajoutant "The" au début du nom de dossier animux, nous avons trouvé l'artiste en DB. 
        //Il une fois les dossiers deplacé il faudra relancer l'API animux/create_mapping/artist/ pour mettre a jour dans animux_path les nouveaux dossier d'artiste
        let oldPath = PATH_MAPPING_ANIMUX + '/' + artistName[0].toUpperCase() + '/' + encodeURIComponent(artistName);
        let pathToArtist = PATH_MAPPING_ANIMUX + '/' + artist.name[0].toUpperCase() + '/' + encodeURIComponent(artist.name);
        //rename and move the folder in 'T' because artist begin with 'The'
        mv(oldPath, pathToArtist, (err) => {
            if (err) throw err;
            console.log("checkIfAnimuxPathExistAndRename rename = " + oldPath + ' => ' + pathToArtist);
            updateArtistAnimuxPath(db, artist, artistName);
        });
    }
}
/**
 * 
 * @param {*} db 
 * @param {*} artist object retrieve from the database
 * @param {*} artistName directory name decoded ex: The Beatles not The%20Beatles
 */
var updateArtistAnimuxPath = (db, artist, artistName) => {
    var pathToArtist = PATH_MAPPING_ANIMUX + '/' + artistName[0].toUpperCase() + '/' + encodeURIComponent(artistName)
    if (artist.animux_path && (artist.animux_path.indexOf(pathToArtist) >= 0)) console.log("already_exist = " + pathToArtist);
    else {
        db.collection(COLLECTIONARTIST).updateOne({
            name: artist.name
        }, {
            $push: {
                animux_path: pathToArtist
            }
        })
    }
}
/**
 * 
 * @param {*} filePath 
 */
var readContentFileSong = (filePath) => {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) return reject(err);
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
var readDirsSongs = (rootPath) => {
    var filesArray = [],
        files = fs.readdirSync(rootPath);
    for (var i = 0, l = files.length; i < l; i++)
        if (!fs.lstatSync(rootPath + '/' + files[i]).isDirectory()) filesArray.push(rootPath + '/' + files[i]);
    return filesArray;
}

//We replace characters with a weird encoding by same characters with a normal encoding
var sanitizeFilename = (filename) => {
    return filename.replace(/é/gi, "é")
        .replace(/ë/gi, "ë")
        .replace(/ö/gi, "ö")
        .replace(/á/gi, "á")
        .replace(/í/gi, "i")
        .replace(/ó/gi, "ó")
        .replace(/ú/gi, "ú")
        .replace(/´/gi, "'")
        .replace(/’/gi, "'")
        .replace(/è/gi, "è");
}

exports.sanitizeAndRenameDirArtist = sanitizeAndRenameDirArtist;
exports.getDirArtist = getDirArtist;
exports.getNotFoundLogArtist = getNotFoundLogArtist;
exports.getFileSong = getFileSong;
exports.countArtistAnimuxDirInDB = countArtistAnimuxDirInDB;
exports.countSongAnimuxFileInDB = countSongAnimuxFileInDB;