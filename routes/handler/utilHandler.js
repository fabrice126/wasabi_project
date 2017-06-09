import fs from 'fs';

/**
 *
 * @param obj
 * @returns {*}
 */
var sanitizeProperties = function (obj) {
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (property != "rdf") {
                if (typeof obj[property] == "object") {
                    sanitizeProperties(obj[property]);
                } else {
                    //On supprime les \n\r une fois supprimer on supprime les espaces de fin
                    obj[property] = obj[property].replace(/^(\s)|(\\n|\\r)/g, '').replace(/(\s+)$/g, '');
                }
            }
        }
    }
    return obj;
};
/**
 * encode uniquement les caractères présents dans le replace
 * Cette fonction est utilisé pour encoder les caractères spéciaux ne pouvant être présent dans le nom d'un dossier sous windows
 * @param str
 * @returns {*|XML|string|void}
 */
var encodePathWindows = function (str) {
    //Sous windows les caractères interdit dans le nom d'un fichier/dossier sont " ? < > | \ : * / .
    return str.replace(/["?<>|\\:*\/\.]/g, function (c) {
        if ('.' == c) {
            c = "%2E";
        } else if ('*' == c) {
            c = "%2A";
        } else {
            c = encodeURIComponent(c);
        }
        return c;
    });
};
/**
 *  encode uniquement les caractères présents dans le replace
 *  Cette fonction est utilisé pour encoder les caractères spéciaux ne pouvant être présent dans le nom d'un dossier sous windows
 * @param str
 * @returns {*|XML|string|void}
 */
var decodePathWindows = function (str) {
    //Sous windows les caractères interdit ou posant problème dans le nom d'un fichier/dossier sont " ? < > | \ : * / .
    // les caractères ci dessus une fois encodé donnent respectivement: %22 %3F %3C %3E %7C %5C %3A %2A %2F %2E nous devons donc les décoder
    return str.replace(/(%22|%3F|%3C|%3E|%7C|%5C|%3A|%2A|%2F|%2E)/g, function (c) {
        if ('%2E' == c) {
            c = '.';
        } else if ('%2A' == c) {
            c = '*';
        } else {
            c = decodeURIComponent(c);
        }
        return c;
    });
};
/**
 * Permet de modifier le nom d'un fichier / dossier afin de l'encoder avec la fonction encodePathWindows de utilHandler.js
 * A utiliser lorsque de nouveaux fichier sont ajoutés dans le dossier contenant les musiques multipistes/single piste
 * @param oldPath
 * @param newPath
 */
var writeEncodedFile = function (oldPath, newPath) {
    //ne pas oublier de mettre l'extension si besoin
    if (oldPath == newPath) {
        return;
    }
    fs.rename(oldPath, newPath, function (err) {
        if (err) console.log('ERROR: ' + err);
    });
};
/**
 * Permet d'échapper les caractères spéciaux utilisés dans les regex
 * @param str
 * @returns {*|XML|string|void}
 */
function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}


function fillField(selector) {
    if (selector != "" && selector != null) {
        return selector.trim();
    }
    return "";
}


var decodeHtmlEntities = function (str) {
    return String(str).replace(/&apos;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
}


exports.sanitizeProperties = sanitizeProperties;
exports.encodePathWindows = encodePathWindows;
exports.decodePathWindows = decodePathWindows;
exports.writeEncodedFile = writeEncodedFile;
exports.escapeRegExp = escapeRegExp;
exports.decodeHtmlEntities = decodeHtmlEntities;
exports.fillField = fillField;