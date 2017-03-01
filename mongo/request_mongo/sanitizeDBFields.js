var collections = ["artist","album","song"];

function sanitizeCollection(collection){
    var i = 0;
    var count = db[collection].count();
    db[collection].find({},{rdf:0,wordCount:0}).forEach(function (obj) {
        if(i%5000 == 0){
            print(collection+": "+i+"/"+count);
        }
        i++;
        (function sanitizeProperties(obj) {
            for (var property in obj) {
                if(property !== "_id"){
                    //print("\n__"+property+"__");
                    if (typeof obj[property] == "object") {
                        sanitizeProperties(obj[property]);
                    } else {
                        //On supprime les \n\r et les espaces de fin et de début
                        if(typeof obj[property] === "string" && obj[property] != ""){
                            obj[property] = obj[property].trim();
                            // print("  "+property+"=>"+obj[property]);
                        }
                    }
                }
            }
        })(obj)
        db[collection].update({_id:obj._id},{ $set: obj } );
    });
}
collections.forEach(function(collectionName){
    sanitizeCollection(collectionName);
});



