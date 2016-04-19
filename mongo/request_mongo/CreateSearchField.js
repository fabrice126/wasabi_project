db.getCollection('song').find({}).forEach( function(song) {
    var searchTags = song.titre+" "+song.name+" "+song.albumTitre;
    searchTags = searchTags.toLowerCase();
    db.song.update({_id:song._id}, {$set:{searchTags:searchTags}})
});
db.song.createIndex({searchTags: "text"});