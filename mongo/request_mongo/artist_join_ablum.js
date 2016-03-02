db.getCollection('album').find({name:"Michael Jackson"}).forEach(
    function (artist) {
        album = db.getCollection('album').find({name:artist.name})    
    }
);
    album
    