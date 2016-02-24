db.getCollection('artist').aggregate([ 
                {"$match": {"albums": {$exists : true}}},
                // De-normalize le tableau pour sépérarer les documents
                {"$unwind": "$albums"},
                {"$project" : 
                    {
                        _id:0, 
                        "name":1,
                        "albumTitre":"$albums.titre",
                        "dateSortie":"$albums.titre",
                        "urlWikipedia":"$albums.urlSong",
                        "urlAlbum":"$albums.lyrics"
                    }
                },
                { 
                    $out : "album"
                }
            ])