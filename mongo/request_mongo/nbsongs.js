db.getCollection('artist').aggregate([ 
                {"$match": {"albums.songs.titre": {$exists : true}}},
                // De-normalize le tableau pour sépérarer les documents
                {"$unwind": "$albums"},
                {"$unwind": "$albums.songs"},
                {"$match": {"albums.songs.lyrics": {$exists : true}}},
                {"$project" : {_id:0, "albums.songs.titre":1}},
                { 
                    $out : "randomAggregates"
                }
            ])