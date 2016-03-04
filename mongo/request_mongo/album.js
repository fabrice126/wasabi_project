db.getCollection('artistFull').aggregate([ 
                {"$match": {"albums": {$exists : true}}},
                // De-normalize le tableau pour sépérarer les documents
                {"$unwind": "$albums"},
                {"$project" : 
                    {
                        _id:0, 
                        "name":1,
                        "titre":"$albums.titre",
                        "dateSortie":"$albums.dateSortie",
                        "urlWikipedia":"$albums.urlWikipedia",
                        "genre":"$albums.genre",
                        "length":"$albums.length",
                        "urlAlbum":"$albums.urlAlbum",
                    }
                },
                { 
                    $out : "album"
                }
            ])