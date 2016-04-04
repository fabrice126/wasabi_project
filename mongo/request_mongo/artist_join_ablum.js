
var artist = db.artist.findOne({name:"Iron Maiden"});
artist.albums = [];
db.album.find({name:"Iron Maiden"}).forEach(
    function(album){         
        album.songs = db.song.find({ $and: [ {"albumTitre":album.titre}, {"name":"Iron Maiden"} ] }).toArray();
        artist.albums.push(album);
    }
);
artist
    