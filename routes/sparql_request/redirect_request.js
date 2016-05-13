//redirect_request.js permet comme son nom l'indique de rediriger les requêtes vers les bonnes URL
//Explication : Si une page nommée "http://dbpedia.org/page/KISS_(Band)" a été renommée par "http://dbpedia.org/resource/Kiss_(band)" alors une propriété (wikiPageRedirects)
//nous permettra d'obtenir la nouvelle page avec l'ancienne URL

var construct_request = function (obj, country) {
    //Nous avons besoin d'une url encodée
    var obj = encodeURIComponent(obj);
    var countryLang='';
    if(country=='' || country =='en.'){
        country = '';
    }
    return   ' PREFIX db-owl: <http://dbpedia.org/ontology/> '+ 
    ' SELECT ?redirect WHERE { '+
    '    <http://'+country+'dbpedia.org/resource/'+obj+'> db-owl:wikiPageRedirects ?redirect  '+
    ' } ';
}; 


exports.construct_request = construct_request;
