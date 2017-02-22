// /!\ CETTE OPERATION PEUT PRENDRE DU TEMPS /!\
//Creation de la collection album
db.getCollection('artist').aggregate([ 
                {"$match": {"albums": {$exists : true}}},
                { "$unwind": "$albums"},
                {"$project" : 
                    {
                        _id:0, 
                        "name":1,
                        "title":"$albums.title",
                        "publicationDate":"$albums.publicationDate",
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
db.getCollection('album').createIndex({ title: 1}); 
db.getCollection('album').createIndex({ publicationDate: 1}); 
db.getCollection('album').createIndex({ genre: 1}); 
//Creation de la collection song
db.getCollection('artist').aggregate([ 
                {"$match": {"albums.songs.title": {$exists : true}}},
                {"$unwind": "$albums"},
                { "$unwind": { path: "$albums.songs", includeArrayIndex: "position" } },
                {"$project" : 
                    {
                        _id:0, 
                        "name":1,
                        "albumTitle":"$albums.title",
                        "lengthAlbum":"$albums.length",
                        "publicationDateAlbum":"$albums.publicationDate",
                        "title":"$albums.songs.title",
                        "urlSong":"$albums.songs.urlSong",
                        "lyrics":"$albums.songs.lyrics",
                        "urlWikipedia":"$albums.songs.urlWikipedia",
                        "position":1,
                    }
                },
                { $out : "song" }
            ])
//create index pour la collection song
db.getCollection('song').createIndex({ name: 1});    
db.getCollection('song').createIndex({ albumTitle: 1}); 
db.getCollection('song').createIndex({ title: 1}); 
db.getCollection('song').createIndex({ position: 1}); 

         
//suppression du champ albums dans la collection artist      
db.getCollection('artist').update({},{$unset: {albums:1}},false,true);
//create index pour la collection artist
db.getCollection('artist').createIndex({ name: 1}, { unique: true });
db.getCollection('artist').createIndex({ urlWikipedia:1});
