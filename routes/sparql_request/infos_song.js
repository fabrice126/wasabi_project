var construct_request = function (artist, country) {
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
 ' <http://'+country+'dbpedia.org/resource/'+artist+'>	db-owl:writer ?writer ; '+ 
 '             db-owl:abstract ?abstract; '+ 
 '             db-owl:producer ?producer; '+ 
 '             db-owl:genre ?genre; '+ 
 '             db-owl:recordLabel ?recordLabel;  '+ 
 '             db-owl:album ?album; '+ 
 '             db-owl:runtime ?runtime; '+ 
 '             prop:recorded ?recorded; '+ 
 '             dc:subject ?subject; '+ 
 '             db-owl:format ?format; '+ 
 '             db-owl:format ?musicalArtist; '+ 
 '             db-owl:releaseDate ?releaseDate; '+ 
 '             prop:award ?award; '+ 
 '             prop:title ?title. '+ 
 ' } '+ 
 ' where { '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+artist+'>	db-owl:writer ?writer} . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+artist+'> db-owl:abstract ?abstract . FILTER langMatches(lang(?abstract),  "'+ countryLang +'" )}  . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+artist+'> db-owl:producer ?producer} . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+artist+'> db-owl:genre ?genre} . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+artist+'> db-owl:recordLabel ?recordLabel} . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+artist+'> db-owl:album ?album} . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+artist+'> db-owl:runtime ?runtime} . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+artist+'> prop:recorded ?recorded } . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+artist+'> dc:subject ?subject } . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+artist+'> db-owl:format ?format } . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+artist+'> db-owl:musicalArtist ?musicalArtist } . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+artist+'> db-owl:releaseDate ?releaseDate } . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+artist+'> prop:award ?award . FILTER langMatches(lang(?),  "'+ countryLang +'" )} . '+ 
 '     OPTIONAL {<http://'+country+'dbpedia.org/resource/'+artist+'> prop:title ?title} . '+ 
 ' }ORDER BY DESC(?writer)  ';
}; 


exports.construct_request = construct_request;


 



