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
};

var reduce = function( key, values ) {  
    return Array.sum(values);   
};

db.getCollection('song').find({wordCount:{$exists:false}}).forEach( function(song) { 
    try {
         var collectionTmp = 'word_count_by_lyrics_song';
          db.getCollection('song').mapReduce( map, reduce,{query:{_id:song._id}, out: collectionTmp });
         var cursorSong = db.getCollection(collectionTmp).find({value:{$gt:1} }).sort({value:-1}); 
         var currentWordCountSong = [];
         while ( cursorSong.hasNext() ) {
             currentWordCountSong.push(cursorSong.next());
         }
         db.getCollection('song').update( {_id:song._id},{ $set: {"wordCount":currentWordCountSong} } );
         db.getCollection(collectionTmp).drop(); 
    } catch (err) {
      print('ERREUR :'+err);
    }
} );