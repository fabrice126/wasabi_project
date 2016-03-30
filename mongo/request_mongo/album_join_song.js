var tAlbums = [];
db.album.find({name:"Iron Maiden"}).forEach(
    function(album){         
        album.songs = db.song.find({ $and: [ {"albumTitre":album.titre}, {"name":"Iron Maiden"} ] }).toArray();
        tAlbums.push(album);
        
    }
);
tAlbums