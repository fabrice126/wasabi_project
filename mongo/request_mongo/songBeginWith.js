db.getCollection('artist').aggregate([ 
                {"$match": {"albums.songs.titre": /^a/i}},
                // De-normalize le tableau pour sépérarer les documents
                {"$unwind": "$albums"},
                {"$unwind": "$albums.songs"},
                {"$match": {"albums.songs.titre": /^a/i}},
                {"$sort" : {'albums.songs.titre' : 1} },
                {"$limit" : 200},
                {"$project" : { "titleSong" : "$albums.songs.titre","name":1}},
            ])