db.getCollection('artistFull').aggregate([ 
                {"$match": {"albums.songs.titre": {$exists : true}}},
                // De-normalize le tableau pour sépérarer les documents
                {"$unwind": "$albums"},
                {"$unwind": "$albums.songs"},
                {"$project" : 
                    {
                        _id:0, 
                        "name":1,
                        "albumTitre":"$albums.titre",
                        "titre":"$albums.songs.titre",
                        "urlSong":"$albums.songs.urlSong",
                        "lyrics":"$albums.songs.lyrics",
                        "urlWikipedia":"$albums.songs.urlWikipedia"
                    }
                },
                { 
                    $out : "song"
                }
            ])