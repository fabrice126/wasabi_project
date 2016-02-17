db.getCollection('artist').aggregate([ 
                {"$match": {"albums.songs.titre": {$exists:true}}},
                {"$unwind": "$albums"},
                {"$unwind": "$albums.songs"},
                {"$match": {"albums.songs.titre": {$exists:true}}},
                {"$project" : { "titre" : "$albums.songs.titre",
                                "urlSong" : "$albums.songs.urlSong",
                                "lyrics" : "$albums.songs.lyrics",
                                "name":1,
                                _id:0
                                }
                },
                {"$out":"allSongsTitle"}
            ])