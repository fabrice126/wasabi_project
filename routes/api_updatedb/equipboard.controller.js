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
const HOST = "http://equipboard.com";
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
/**
 * API used for add in our database informations about stuff of band members
 * @param {*} req 
 * @param {*} res 
 */
var getAllEquipmentBoard = (req, res) => {
    var db = req.db,
        skip = 0,
        limit = 100,
        pageStart = "?page=";
    (function loopArtist(skip) {
        db.collection(COLLECTIONARTIST).aggregate([{
            $match: {}
        }, {
            $unwind: "$members"
        }, {
            $match: {
                $and: [{
                    "members.urlEquipBoard": {
                        $exists: 1
                    }
                }, {
                    "members.urlEquipBoard": {
                        $ne: ""
                    }
                }]
            }
        }, {
            $project: {
                _id: 1,
                members: 1
            }
        }, {
            $skip: skip
        }, {
            $limit: limit
        }], (err, tArtists) => {
            if (err) {
                console.log(err);
                return res.status(404).json(config.http.error.artist_404)
            };
            console.log("There are " + tArtists.length + " members");
            var time = 2000;
            for (var i = 0; i < tArtists.length; i++) {
                var member = tArtists[i];
                ((member, i) => {
                    setTimeout(() => {
                        var url = member.members.urlEquipBoard + pageStart;
                        member.members.equipments = [];
                        requestPages(url, 1, member, db, res);
                        if (i == limit - 1) {
                            console.log("skip = " + skip);
                            loopArtist(skip += limit);
                        }
                    }, i * time)
                })(member, i);
            }
        });
    })(skip);
    return res.json(config.http.valid.send_message_ok);
}

var requestPages = (url, currentPage, member, db, res) => {
    var urlPage = url + currentPage;
    // console.log("\t2 - requestPages urlPage = " + urlPage);
    requestEquipBoard(urlPage).then((body) => {
        const $ = cheerio.load(body);
        // e.g. : urlLastPage => /pros/kirk-hammett?page=3 this member has 3 pages or "undefined" => only one page
        const urlLastPage = $("nav.pagination>span.last>a").attr('href');
        //If urlLastPage is not defined so we set totalPage at 1 because the member has only one page.
        const totalPage = urlLastPage ? urlLastPage.substring(urlLastPage.lastIndexOf('=') + 1, urlLastPage.length) : null;
        loopPages($, currentPage, totalPage, url, member, db, res);
    }).catch((error) => {
        console.log("--------------------------");
        console.log(error)
    });
};
var loopPages = ($, currentPage, totalPage, url, member, db, res) => {
    // console.log("\t\t3 - params loopPages = ", currentPage, totalPage, url);
    extractDataFromPage($).then((tEquipments) => {
        currentPage++;
        member.members.equipments.push(...tEquipments);
        //If totalPage is undefined we are in the last page
        if (!totalPage) {
            var equipments = member.members.equipments;
            //We merges the types which appears several times
            for (var i = 0; i < equipments.length; i++) {
                for (var j = i + 1; j < equipments.length; j++) {
                    if (equipments[i].type != equipments[j].type) break;
                    else {
                        equipments[i].items.push(...equipments[j].items);
                        equipments.splice(j, 1);
                    }
                }
            }
            //We save the members this artist
            updateFieldsArtistMemberEquipBoard(db, member);
            // return res.json(member);
        } else return requestPages(url, currentPage, member, db, res);
    }).catch((e) => console.log(e));
};
var extractDataFromPage = ($) => {
    return new Promise((resolve, reject) => {
        var tEquipments = [];
        const tSections = $(".eb-section");
        for (var i = 0, l = tSections.length; i < l; i++) {
            //e.g: Guitars 32 : http://equipboard.com/pros/kirk-hammett/ ou 32 est le nombre de guitare présent pour un artiste
            var equipmentTitle = $(tSections[i]).find("h2.eb-vip-section-heading").text().trim();
            var nbEquipment = equipmentTitle.substring(equipmentTitle.lastIndexOf(" ") + 1, equipmentTitle.length).trim();
            var oEquipment = {
                "type": equipmentTitle.substring(0, equipmentTitle.lastIndexOf(" ")).trim() || "",
                "items": []
            }
            var tItemDetails = $(tSections[i]).find(".eb-grid-item");
            for (var j = 0, ll = tItemDetails.length; j < ll; j++) {
                const container = $(tItemDetails[j]).find("div.eb-grid-item__link-container");
                oEquipment.items.push({
                    name: $(tItemDetails[j]).find("div.eb-full-name").text().trim() || "",
                    description: "",
                    urlDescription: HOST + $(tItemDetails[j]).find(".eb-pro-item-proof-blurb .eb-more-link").attr('href').trim() || "",
                    url: HOST + $(container).find("a.eb-grid-item__link").attr('href').trim() || "",
                    img: $(container).find("img.eb-grid-item__img").attr('data-original').trim() || ""
                });
            }
            if (oEquipment.items.length) tEquipments.push(oEquipment);
        }
        resolve(tEquipments);
    });
}
/**
 * API used for get description about each stuff of each artists 
 * @param {*} req 
 * @param {*} res 
 */
var getAllEquipmentDescription = (req, res) => {
    var db = req.db,
        skip = 3600,
        limit = 1000;
    (function loopDescription(skip) {
        console.log("skip = " + skip);
        db.collection(COLLECTIONARTIST).aggregate([{
            $unwind: "$members"
        }, {
            $match: {
                $and: [{
                    "members.equipments": {
                        $exists: 1
                    }
                }, {
                    "members.equipments": {
                        $ne: []
                    }
                }]
            }
        }, {
            $project: {
                _id: 1,
                members: 1
            }
        }, {
            $skip: skip
        }, {
            $limit: limit
        }], (err, tArtists) => {
            if (err) return res.status(404).json(config.http.error.artist_404)
            console.log("There are " + tArtists.length + " members");
            var i = 0;
            (function loop(i) {
                var totalEquipmentsItems = 0,
                    count = 0,
                    equipments = tArtists[i].members.equipments;
                for (var j = 0; j < equipments.length; j++) {
                    totalEquipmentsItems += equipments[j].items.length;
                    for (var k = 0; k < equipments[j].items.length; k++) {
                        var urlDescription = equipments[j].items[k].urlDescription,
                            item = equipments[j].items[k];
                        ((item, urlDescription) => {
                            requestEquipBoard(urlDescription).then((body) => {
                                const $ = cheerio.load(body);
                                item.description = $(".eb-blurb").html().trim();
                                count++;
                                if (count == totalEquipmentsItems) {
                                    updateFieldsArtistMemberEquipBoard(db, tArtists[i]);
                                    console.log(i + skip);
                                    i++;
                                    if (i == limit - 1) setTimeout(() => loopDescription(skip += limit), 10000)
                                    else loop(i);
                                }
                            }).catch((error) => {
                                count++;
                                if (count == totalEquipmentsItems) {
                                    updateFieldsArtistMemberEquipBoard(db, tArtists[i]);
                                    console.log(i + skip);
                                    i++;
                                    if (i == limit - 1) setTimeout(() => loopDescription(skip += limit), 10000)
                                    else loop(i);
                                }
                            });
                        })(item, urlDescription)
                    }
                }
            })(i);
        });
    })(skip);
    return res.json(config.http.valid.send_message_ok);
}

var updateFieldsArtistMemberEquipBoard = function (db, objMember) {
    db.collection(COLLECTIONARTIST).updateOne({
        _id: new ObjectId(objMember._id),
        members: {
            $elemMatch: {
                id_member_musicbrainz: objMember.members.id_member_musicbrainz,
                begin: objMember.members.begin,
                end: objMember.members.end
            }
        }
    }, {
        $set: {
            "members.$.equipments": objMember.members.equipments
        }
    }, (err) => {
        if (err) {
            console.log("----------FAIL updated =>" + objMember._id + ", " + objMember.members.urlEquipBoard);
            console.log(err);
        } else console.log("updated => " + objMember._id);
    });
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
    var nbREquestProcess = 0;
    return new Promise((resolve, reject) => {
        (function requestProcess() {
            tor_request.request(urlEquipBoard, {
                timeout: 60000
            }, (err, res, body) => {
                //Voir les condition de reject et resolve
                if (!err && res.statusCode == 200) return resolve(body);
                if (err) {
                    //If request take too much time we relaunch it
                    console.log("error code = " + err.code);
                    if (nbREquestProcess != 6 && (err.code == "ECONNRESET" || err.code === "ETIMEDOUT" || err.code === "ESOCKETTIMEDOUT")) {
                        console.log(err.code + " => relance de la requête => " + urlEquipBoard);
                        nbREquestProcess++;
                        setTimeout(() => requestProcess(), 2000);
                    } else return reject(err);
                } else {
                    console.log(nbREquestProcess + " ---------------DANS ELSE REJECT REQUESTEQUIPBOARD--------------- " + urlEquipBoard);
                    if (nbREquestProcess == 5) return reject(body);
                    nbREquestProcess++;
                    setTimeout(() => requestProcess(), 2000);
                }
            });
        })()
    })
};


exports.tryTor = tryTor;
exports.getCreateLinkEquipBoard = getCreateLinkEquipBoard;
exports.getAllEquipmentBoard = getAllEquipmentBoard;
exports.getAllEquipmentDescription = getAllEquipmentDescription;