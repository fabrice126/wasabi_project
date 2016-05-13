var construct_request = function (song, country) {
    //Nous avons besoin d'une url encodée
    var song = encodeURIComponent(song);
    var countryLang='';
    if(country=='' || country =='en.'){
        countryLang = "en";
        country = '';
    }
    else{
        countryLang = country.substring(0,2);
    }
    return   ' PREFIX db-owl: <http://dbpedia.org/ontology/> '+ 
 ' PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+
 ' PREFIX prop: <http://dbpedia.org/property/> '+ 
 ' PREFIX dc:      <http://purl.org/dc/terms/> '+ 
 ' CONSTRUCT { '+ 
 ' <http://'+country+'dbpedia.org/resource/'+song+'>	db-owl:writer ?writer ; '+ 
 '             db-owl:abstract ?abstract; '+ 
 '             db-owl:producer ?producer; '+ 
 '             db-owl:genre ?genre; '+ 
 '             db-owl:recordLabel ?recordLabel;  '+ 
 '             db-owl:album ?album; '+ 
 '             db-owl:runtime ?runtime; '+ 
 '             prop:recorded ?recorded; '+ 
 '             dc:subject ?subject; '+ 
 '             db-owl:format ?format; '+ 
 '             db-owl:releaseDate ?releaseDate; '+ 
 '             prop:award ?award. '+ 
 ' } '+ 
 ' where { '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+song+'> db-owl:writer ?writer} . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+song+'> db-owl:abstract ?abstract . FILTER langMatches(lang(?abstract),  "'+ countryLang +'" )}  . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+song+'> db-owl:producer ?producer} . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+song+'> db-owl:genre ?genre} . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+song+'> db-owl:recordLabel ?recordLabel} . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+song+'> db-owl:album ?album} . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+song+'> db-owl:runtime ?runtime} . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+song+'> prop:recorded ?recorded } . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+song+'> dc:subject ?subject } . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+song+'> db-owl:format ?format } . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+song+'> db-owl:releaseDate ?releaseDate } . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+song+'> prop:award ?award . FILTER langMatches(lang(?award),  "'+ countryLang +'" )} . '+ 
 ' }ORDER BY DESC(?writer)  ';
}; 


exports.construct_request = construct_request;
 
