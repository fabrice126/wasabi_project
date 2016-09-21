const ObjectId          = require('mongoskin').ObjectID;

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
    return Array.sum(values)
};

exports.map = map;
exports.reduce = reduce;
