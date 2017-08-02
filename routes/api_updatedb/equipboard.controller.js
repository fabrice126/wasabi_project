import tor_request from 'tor-request';
import express from 'express';
import config from '../conf/conf';
import util from '../handler/utilHandler';
import cheerio from 'cheerio';
import {
    ObjectId
} from 'mongoskin';

const router = express.Router();
const COLLECTIONARTIST = config.database.collection_artist;
/**
 * API to find links in equipboard. Basically we transform all members name to an url for equipboard  
 * e.g. : Kirk Hammett => equipboard.com/pros/kirk-hammett
 * if we get a response status 200 we found the member's page. Then we save the link into member's object
 * @param {*} req 
 * @param {*} res 
 */
var getCreateLinkEquipBoard = (req, res) => {
    var db = req.db,
        skip = 0,
        limit = 500,
        query = {
            members: {
                $ne: []
            }
        },
        projection = {
            "_id": 1,
            "members": 1
        };
    db.collection(COLLECTIONARTIST).count(query, (err, nbObj) => {
        console.log("There are " + nbObj + " " + COLLECTIONARTIST + " with members");
        var trouve = 0,
            total = 0;
        (function fetchObj(skip) {
            var nb = 0;
            if (skip < nbObj) {
                console.log("skip begin = " + skip);
                db.collection(COLLECTIONARTIST).find(query, projection).skip(skip).limit(limit).toArray((err, tObj) => {
                    console.log("Extraction started");
                    var i = 0;
                    (function loop(i) {
                        var l = tObj[i].members.length,
                            nbRequestMember = 0,
                            tUrlsMembers = Array(l.length).fill(null);
                        for (var j = 0; j < l; j++) {
                            var member = tObj[i].members[j];
                            let url = "http://equipboard.com/pros/" + transformName(member.name);
                            ((j) => {
                                requestToFindUrlEquipBoard(url).then((result) => {
                                    nbRequestMember++;
                                    total++;
                                    var urlEquipBoard = result.urlEquipBoard;
                                    if (result.statusCode == 200) {
                                        console.log(i + " => Trouvé = " + urlEquipBoard);
                                        tUrlsMembers[j] = urlEquipBoard;
                                        trouve++;
                                    }
                                    //We check if urlEquipBoard doesn't return an error
                                    //When tUrlsMembers contain all json of members we continue
                                    if (nbRequestMember == l) {
                                        updateUrlArtistMemberEquipBoard(tObj[i], tUrlsMembers);
                                        db.collection(COLLECTIONARTIST).update({
                                            _id: new ObjectId(tObj[i]._id)
                                        }, {
                                            $set: tObj[i]
                                        }, (err) => {
                                            if (err) throw err;
                                            nb++;
                                            if (nb == tObj.length) {
                                                skip += limit;
                                                console.log("SKIP = " + skip);
                                                console.log("--------------------------------------" + trouve + "/" + total + "--------------------------------------");
                                                fetchObj(skip);
                                            } else {
                                                i++;
                                                setTimeout(() => loop(i), 200);
                                            }
                                        });
                                    }
                                });
                            })(j);
                        }
                    })(i);
                });
            } else console.log("TRAITEMENT TERMINE");
        })(skip);
    });
    res.send("ok");
};

var getAllEquipmentBoard = (req, res) => {
    var test0 = "http://equipboard.com/pros/kirk-hammett",
        test1 = "http://equipboard.com/pros/css";
    var db = req.db,
        host = "http://equipboard.com",
        pageStart = "?page=2",
        skip = 0,
        limit = 1,
        query = {
            members: {
                $ne: []
            }
        },
        projection = {
            "_id": 1,
            "members": 1
        },
        url = test0 + pageStart;
    db.collection(COLLECTIONARTIST).count(query, (err, nbObj) => {
        console.log("There are " + nbObj + " " + COLLECTIONARTIST + " with members");
        (function fetchObj(skip) {
            var nb = 0;
            if (skip >= nbObj) return console.log("TRAITEMENT TERMINE");
            db.collection(COLLECTIONARTIST).find(query, projection).skip(skip).limit(limit).toArray((err, tObj) => {
                var i = 0;
                (function loop(i) {
                    var oArtist = tObj[i];
                    var l = oArtist.members.length,
                        nbRequestMember = 0;
                    for (var j = 0; j < l; j++) {
                        var member = oArtist.members[j];
                        ((j) => {
                            requestEquipBoard(url).then((result) => {
                                nbRequestMember++;
                                console.log(" => Trouvé  " + url);
                                const $ = cheerio.load(result.body);
                                const urlLastPage = $("nav.pagination>span.last>a").attr('href');
                                console.log("urlLastPage = " + urlLastPage);
                                //We have several pages
                                if (urlLastPage) {
                                    const tSections = $(".eb-section");
                                    console.log("Nombre de section = " + tSections.length);
                                    for (var i = 0, l = tSections.length; i < l; i++) {
                                        //e.g: Guitars 32 : http://equipboard.com/pros/kirk-hammett/ ou 32 est le nombre de guitare présent pour un artiste
                                        var equipmentTitle = $(tSections[i]).find("h2.eb-vip-section-heading").text().trim();
                                        var nbEquipment = equipmentTitle.substring(equipmentTitle.lastIndexOf(" ") + 1, equipmentTitle.length).trim();
                                        var oEquipment = {
                                            "type": equipmentTitle.substring(0, equipmentTitle.lastIndexOf(" ")).trim() || "",
                                            "equipment": []
                                        }
                                        console.log("'" + oEquipment.type + "'", "'" + nbEquipment + "'");
                                        var tItemDetails = $(tSections[i]).find(".eb-grid-item");
                                        for (var j = 0, ll = tItemDetails.length; j < ll; j++) {
                                            const container = $(tItemDetails[j]).find("div.eb-grid-item__link-container");
                                            oEquipment.equipment.push({
                                                name: $(tItemDetails[j]).find("div.eb-full-name").text().trim() || "",
                                                description: "",
                                                urlDescription: host + $(tItemDetails[j]).find(".eb-pro-item-proof-blurb .eb-more-link").attr('href').trim() || "",
                                                url: host + $(container).find("a.eb-grid-item__link").attr('href').trim() || "",
                                                img: $(container).find("img.eb-grid-item__img").attr('data-original').trim() || ""
                                            });
                                        }
                                        tEquipments.push(oEquipment);
                                        console.log("--------------------------------")
                                    }
                                    if (nbRequestMember == l) {
                                        updateUrlArtistMemberEquipBoard(oArtist, tUrlsMembers);
                                        //Faire l'enregistrement et loop(i+1)
                                    }
                                    const totalPage = urlLastPage.substring(urlLastPage.lastIndexOf('=') + 1, urlLastPage.length);
                                    console.log("totalPage = " + totalPage);
                                } else {
                                    //on traite la seul page du membre de groupe
                                    console.log("Aucune page supplémentaire");
                                }
                                //itérer sur ces pages
                                res.send(tEquipments);
                                // updateFieldsArtistMemberEquipBoard(tObj[i], oEquipBoard);
                            }).catch((error) => {});
                        })(j);
                    }
                })(i);
            });
        })(skip);
    });
}
var updateFieldsArtistMemberEquipBoard = function (objMember, tUrlsMembers) {
    console.log();

}
var updateUrlArtistMemberEquipBoard = function (objArtist, tUrlsMembers) {
    for (var i = 0, l = objArtist.members.length; i < l; i++) {
        if (tUrlsMembers[i]) objArtist.members[i].urlEquipBoard = tUrlsMembers[i];
        else objArtist.members[i].urlEquipBoard = "";
    }
}

//We transform the name of each member of a band to a suitable name to sended to equipboard website
var transformName = (name) => {
    return util.removeDiacritics(name) //we delete all diacritics sign e.g. : é->e, ö->o etc
        .toLowerCase()
        .trim()
        .replace(/[^a-zA-Z0-9]/g, '-') //if the character is not alphanumeric, we replace it by '-' e.g. : .A.D::N. -> -A-D--N-
        .replace(/\-+/g, '-') //If '-' appears several times in succession, we keep one e.g. : -A-D--N- -> -A-D-N-
        .replace(/([^a-zA-Z0-9]$)|(^[^a-zA-Z0-9])/g, ''); // If the name begins or ends by '-' we remove it : -A-D-N- -> A-D-N
};
/**
 * We try if Tor is enabled. If so, our ip address has changed
 */
var tryTor = (req, res) => {
    var url = "https://api.ipify.org?format=json";
    //Change ip address 
    tor_request.renewTorSession((err) => {
        if (err) return console.error(err);
        requestEquipBoard(url).then((body) => {
            return res.send(body);
        }, (err) => {
            return res.json(err);
        });
    });
};
//1er etape: pour chaque nom de membre/variationName envoyer une requête vers equipboard. Si le res.status == 200 alors on enregistre le lien dans le membre 
//2eme etape: pour chaque nom d'artiste envoyer une requête vers equipboard. Si le res.status == 200 alors on enregistre le lien dans l'artiste 
//3eme etape: Regarder comment parser la page avec cheerio pour récupérer les informations utiles 
/**
 * API permettant de recupérer les informations d'un membre de groupe sur equipboard
 * @param {*} urlEquipBoard : une url vers la page d'un artiste de MusicBrainz
 */
var requestToFindUrlEquipBoard = (urlEquipBoard) => {
    return new Promise((resolve, reject) => {
        (function requestProcess() {
            tor_request.request(urlEquipBoard, {
                timeout: 60000
            }, (err, res, body) => {
                var objRes = {
                    statusCode: res ? res.statusCode : "",
                    err: err ? err : "",
                    urlEquipBoard: urlEquipBoard
                };
                if (!err && res.statusCode == 200) return resolve(objRes);
                if (!err && res.statusCode == 404) return resolve(objRes);
                else {
                    //If request take too much time we relaunch it
                    if (err && (err.code == "ECONNRESET" || err.code === "ETIMEDOUT")) {
                        console.log(err.code + " => relance de la requête => " + urlEquipBoard);
                        requestProcess();
                    } else {
                        objRes.err = err;
                        return resolve(objRes);
                    }
                }
            });
        })()
    })
};

var requestEquipBoard = (urlEquipBoard) => {
    return new Promise((resolve, reject) => {
        (function requestProcess() {
            tor_request.request(urlEquipBoard, {
                timeout: 60000
            }, (err, res, body) => {
                //Voir les condition de reject et resolve
                if (!err && res.statusCode == 200) return resolve(body);
                if (err) {
                    //If request take too much time we relaunch it
                    if (err.code == "ECONNRESET" || err.code === "ETIMEDOUT") {
                        console.log(err.code + " => relance de la requête => " + urlEquipBoard);
                        requestProcess();
                    } else return reject(err);
                } else {
                    return reject(res);
                }
            });
        })()
    })
};
exports.tryTor = tryTor;
exports.getCreateLinkEquipBoard = getCreateLinkEquipBoard;
exports.getAllEquipmentBoard = getAllEquipmentBoard;