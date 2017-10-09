db.getCollection('artist').find({}).forEach( function(artist) {
    db.getCollection('album').find({name:artist.name}).forEach(function( album ) {
        db.album.update({_id:album._id}, {$set:{id_artist:artist._id}})
    });
});
db.album.createIndex({id_artist:1});





