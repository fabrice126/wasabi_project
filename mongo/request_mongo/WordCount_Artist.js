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



var limit = 15000;
(function recusive(limit){

    var collectionTmp = 'word_count_by_lyrics_artist';
    db.getCollection('artist').find({wordCount:{$exists:false}}).limit(limit).forEach( function(artist) { 
         db.getCollection('song').mapReduce( map, reduce,{query:{name:artist.name}, out: collectionTmp });
         var currentWordCountSong = [];
         db.getCollection(collectionTmp).find({value:{$gt:1} }).sort({value:-1}).forEach( function(word) {
             currentWordCountSong.push(word);
         }); 
         
         db.getCollection('artist').update( {_id:artist._id},{ $set: {"wordCount":currentWordCountSong} } );
         db.getCollection(collectionTmp).drop(); 
    } );
    recusive(limit);
})(limit)
