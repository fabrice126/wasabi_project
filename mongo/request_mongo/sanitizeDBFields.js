db['artist'].find({
    name: "Metallica"
}).forEach(function (obj) {

    (function sanitizeProperties(obj, this) {

        for (var property in obj) {

            if (obj.hasOwnProperty(property)) {

                if (property == "merbers" || property == "formerMerbers" || property == "activeYears") {

                    if (typeof obj[property] == "object") {

                        sanitizeProperties(obj[property], this);

                    } else {

                        //On supprime les \n\r une fois supprimer on supprime les espaces de fin

                        obj[property] = obj[property].replace(/^(\s)|(\\n|\\r)/g, '').replace(/(\s+)$/g, '');

                        this.print(obj[property]);

                    }

                }

            }

        }

    })(obj)
    //         db['artist'].update({_id:obj._id},{ $set: obj } );
});