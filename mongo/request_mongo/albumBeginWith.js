db.getCollection('artist').aggregate([ 
                {"$match": {"albums.titre": /^a/i}},
                // De-normalize le tableau pour sépérarer les documents
                {"$unwind": "$albums"},
                {"$match": {"albums.titre": /^a/i}},
//                 {"$sort" : {'albums.titre' : 1} },
                {"$limit" : 2000},
                {"$project" : { "titleAlbum" : "$albums.titre","name":1}},
            ])