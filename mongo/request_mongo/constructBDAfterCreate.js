// /!\ CETTE OPERATION PEUT PRENDRE DU TEMPS /!\
//Creation de la collection album
db.getCollection('artist').aggregate([ 
                {"$match": {"albums": {$exists : true}}},
                { "$unwind": "$albums"},
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
                { $out : "album"}
            ])
//create index pour la collection album                
db.getCollection('album').createIndex({ name: 1});    
db.getCollection('album').createIndex({ titre: 1}); 
db.getCollection('album').createIndex({ dateSortie: 1}); 
db.getCollection('album').createIndex({ genre: 1}); 
//Creation de la collection song
db.getCollection('artist').aggregate([ 
                {"$match": {"albums.songs.titre": {$exists : true}}},
                {"$unwind": "$albums"},
                { "$unwind": { path: "$albums.songs", includeArrayIndex: "position" } },
                {"$project" : 
                    {
                        _id:0, 
                        "name":1,
                        "albumTitre":"$albums.titre",
                        "titre":"$albums.songs.titre",
                        "urlSong":"$albums.songs.urlSong",
                        "lyrics":"$albums.songs.lyrics",
                        "urlWikipedia":"$albums.songs.urlWikipedia",
                        "position":1
                    }
                },
                { $out : "song" }
            ])
//create index pour la collection song
db.getCollection('song').createIndex({ name: 1});    
db.getCollection('song').createIndex({ albumTitre: 1}); 
db.getCollection('song').createIndex({ titre: 1}); 
db.getCollection('song').createIndex({ position: 1}); 
db.getCollection('song').createIndex( {titre: "text"});
         
//suppression du champ albums dans la collection artist      
db.getCollection('artist').update({},{$unset: {albums:1}},false,true);
//create index pour la collection artist
db.getCollection('artist').createIndex({ name: 1});    
