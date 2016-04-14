var map = function (){
    if(this.lyrics != null){
        var newlyrics = this.lyrics.replace(/(<([^>]+)>)/ig, " ").replace(/[.,!?]/g," ").replace(/\(([^)]+)\)/g,'').toLowerCase();
        var words = [];
        words = newlyrics.match(/\S+/g);
        if (words != null) {
            for (var i = 0; i < words.length; i++) {
                var word= words[i].replace(/^&apos;/,'').replace(/&apos;$/,'').replace(/&quot;/,'');
                if(word != "" && word.length>2 && word.length<100 ){
                    emit(word, 1 );
                }
            }
        }
        else{
            return;
        }
    }
    else{
        return ;
    }
}

var reduce = function( key, values ) {  
    return Array.sum(values)   
}

var cursorArtist = db.getCollection('album').find({}).skip(26000).forEach( function(album) { 
    var name = album.name;
    var titre = album.titre;

    var collectionTmp = 'word_count_by_lyrics';
     db.getCollection('song').mapReduce( map, reduce,{query:{$and:[{name:name},{albumTitre:titre}]}, out: collectionTmp });
     var cursorSong = db.getCollection(collectionTmp).find({$and:[{value:{$gt:1} }]}).sort({value:-1}); 
     var currentWordCountSong = [];
     while ( cursorSong.hasNext() ) {
         currentWordCountSong.push(cursorSong.next());
     }
     db.getCollection('album').update( {$and:[{name:name},{titre:titre}]},{ $set: {"wordCount":currentWordCountSong} } );
     db.getCollection(collectionTmp).drop(); 
} );