var sanitizeProperties = function(obj){
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            if(property !="rdf"){
                if (typeof obj[property] == "object"){
                    sanitizeProperties(obj[property]);
                }
                else{
                    //On supprime les \n\r une fois supprimer on supprime les espaces de fin
                    obj[property] = obj[property].replace(/^(\s)|(\\n|\\r)/g,'').replace(/(\s+)$/g,'');
                }
            }
        }
    }
    return obj;
};


//encode uniquement les caractères présents dans le replace
//Cette fonction est utilisé pour encoder les caractères spéciaux ne pouvant être présent dans le nom d'un dossier sous windows
var encodePathWindows = function (str) {
    //Sous windows les caractères interdit dans le nom d'un fichier/dossier sont /\:*?"<>|
    return str.replace(/["?<>|\\:*\/\.]/g, function(c) {
        c =='.' ? c = "%2E" : c = encodeURIComponent(c);
        return c;
    });
};

exports.sanitizeProperties  = sanitizeProperties;
exports.encodePathWindows = encodePathWindows;
