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

exports.sanitizeProperties  = sanitizeProperties; 
