db.getCollection('album').find({}).forEach( function(album) {
    db.getCollection('song').find({$and:[{albumTitre:album.titre},{name:album.name},{dateSortieAlbum:album.dateSortie},{lengthAlbum:album.length}]}).forEach(function( song ) {
        db.song.update({_id:song._id}, {$set:{id_album:album._id}})
    });
});
db.song.createIndex({id_album:1});