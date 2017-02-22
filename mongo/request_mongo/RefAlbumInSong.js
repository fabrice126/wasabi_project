db.getCollection('album').find({}).forEach( function(album) {
    db.getCollection('song').find({$and:[{albumTitle:album.title},{name:album.name},{publicationDateAlbum:album.publicationDate},{lengthAlbum:album.length}]}).forEach(function( song ) {
        db.song.update({_id:song._id}, {$set:{id_album:album._id}})
    });
});
db.song.createIndex({id_album:1});