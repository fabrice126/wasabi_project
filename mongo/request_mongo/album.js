db.getCollection('artist').aggregate([ 
                {"$match": {"albums": {$exists : true}}},
                // De-normalize le tableau pour sépérarer les documents
                {"$unwind": "$albums"},
                {"$project" : 
                    {
                        _id:0, 
                        "name":1,
                        "albumTitre":"$albums.titre",
                        "dateSortie":"$albums.dateSortie",
                        "urlWikipedia":"$albums.urlWikipedia",
                        "urlAlbum":"$albums.urlAlbum",
                    }
                },
                { 
                    $out : "album"
                }
            ])