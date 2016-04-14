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



//Skip pour reprendre le Map Reduce ou il s'est arrêté
var cursorArtist = db.getCollection('artist').find({},{name:1}).skip(76280);
while ( cursorArtist.hasNext() ) {
    var name = cursorArtist.next().name;
    db.getCollection('song').mapReduce( map, reduce,{query:{name:name}, out:'word_count_by_lyrics' });
    var cursorSong = db.getCollection('word_count_by_lyrics').find({$and:[{value:{$gt:1} }]}).sort({value:-1}); 

    var  currentWordCountSong = [];
    while ( cursorSong.hasNext() ) {
        currentWordCountSong.push(cursorSong.next());
    }
    db.getCollection('artist').update( { name: name },{ $set: {"wordCount":currentWordCountSong} } );
    db.getCollection('word_count_by_lyrics').drop();  
}

//query:{name:"Iron Maiden",albumTitre:"The Number Of The Beast", titre:"The Number Of The Beast"}    out:'word_count_by_lyrics'
// var cursorMR = db.getCollection('song').mapReduce( map, reduce,{query:{name:"Iron Maiden"} });
// printjson(cursorMR);


// var cursorSong = db.getCollection('word_count_by_lyrics').find({$and:[{value:{$gt:1} }]}).sort({value:-1});   
// while ( cursorSong.hasNext() ) {
//    currentWordCountSong.push(cursorSong.next());
// }
// printjson( currentWordCountSong );
// db.getCollection('song').update( { name: "Iron Maiden",albumTitre:"The Number Of The Beast",titre: "The Number Of The Beast"},{ $set: {"wordCount":currentWordCountSong} } );



