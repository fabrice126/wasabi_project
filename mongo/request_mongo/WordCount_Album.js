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
// db.getCollection('album').find({wordCount:{$exists:false}}).skip(208000).forEach( function(album) { 
function test(skip){
    var i = 0 ;
    db.getCollection('album').find({wordCount:{$exists:false}}).limit(skip).forEach( function(album) { 
        
        i++;
    try {
        var collectionTmp = 'word_count_by_lyrics_album';
         db.getCollection('song').mapReduce( map, reduce,{query:{id_album:album._id}, out: collectionTmp });
         var currentWordCountSong = [];
         db.getCollection(collectionTmp).find({value:{$gt:1} }).sort({value:-1}).forEach( function(word) {
             currentWordCountSong.push(word);
         }); 
         
         db.getCollection('album').update( {_id:album._id},{ $set: {"wordCount":currentWordCountSong} } );
         db.getCollection(collectionTmp).drop(); 
         if(i ==skip && skip == 15000){
             
         }
    } catch (err) {
      print('ERREUR :'+err);
    }
} );
}
test(15000);
