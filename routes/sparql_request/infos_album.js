var construct_request = function (album, country) {
    //Nous avons besoin d'une url encodée
    var album = encodeURIComponent(album);
    var countryLang='';
    if(country=='' || country =='en.'){
        countryLang = "en";
        country = '';
    }
    else{
        countryLang = country.substring(0,2);
    }
    
return ' PREFIX db-owl: <http://dbpedia.org/ontology/> \n'+
'  PREFIX rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n'+
'  PREFIX prop:   <http://dbpedia.org/property/> \n'+
'  PREFIX dc: <http://purl.org/dc/terms/> \n'+
'  CONSTRUCT { \n'+
'  <http://'+country+'dbpedia.org/resource/'+album+'>  db-owl:abstract 	?abstractAlbum; \n'+
'    db-owl:artist 	?artistAlbum; \n'+
'    db-owl:genre 	?genreAlbum; \n'+
'    db-owl:producer 	?producerAlbum; \n'+
'    db-owl:recordDate 	?recordDateAlbum; \n'+
'    db-owl:recordLabel  ?recordLabelAlbum; \n'+
'    db-owl:releaseDate  ?releaseDateAlbum; \n'+
'    db-owl:runtime	    ?runtimeAlbum; \n'+
'    dc:subject		?subjectAlbum; \n'+
'    prop:award		?awardAlbum; \n'+
'    prop:studio	?studioAlbum. \n'+
'  ?producerAlbum  db-owl:abstract         ?abstractProducer; \n'+
'   db-owl:associatedMusicalArtist  ?associatedMusicalArtist; \n'+
'	db-owl:recordLabel  ?recordLabel; \n'+
'   dc:subject     		?subject; \n'+
'	db-owl:artist		?artist; \n'+
'	db-owl:occupation	?occupation. \n'+
'  } \n'+
'  where { \n'+
'  { \n'+
' 	OPTIONAL {<http://'+country+'dbpedia.org/resource/'+album+'> 	db-owl:abstract  ?abstractAlbum . FILTER langMatches(lang(?abstractAlbum), "'+countryLang+'")}. \n'+
'	OPTIONAL {<http://'+country+'dbpedia.org/resource/'+album+'> 	db-owl:artist           ?artistAlbum}. \n'+
'	OPTIONAL {<http://'+country+'dbpedia.org/resource/'+album+'> 	db-owl:genre     	?genreAlbum}. \n'+
'	OPTIONAL {<http://'+country+'dbpedia.org/resource/'+album+'> 	db-owl:recordDate       ?recordDateAlbum} . \n'+
'	OPTIONAL {<http://'+country+'dbpedia.org/resource/'+album+'> 	db-owl:recordLabel      ?recordLabelAlbum} . \n'+
'	OPTIONAL {<http://'+country+'dbpedia.org/resource/'+album+'> 	db-owl:releaseDate      ?releaseDateAlbum} . \n'+
'	OPTIONAL {<http://'+country+'dbpedia.org/resource/'+album+'> 	db-owl:runtime          ?runtimeAlbum} . \n'+
'	OPTIONAL {<http://'+country+'dbpedia.org/resource/'+album+'> 	dc:subject              ?subjectAlbum} . \n'+
'	OPTIONAL {<http://'+country+'dbpedia.org/resource/'+album+'> 	prop:award              ?awardAlbum 	. FILTER langMatches(lang(?awardAlbum), "'+countryLang+'")}. \n'+
'	OPTIONAL {<http://'+country+'dbpedia.org/resource/'+album+'> 	prop:studio             ?studioAlbum} . \n'+
'   } UNION { \n'+
'	OPTIONAL { \n'+
'		<http://'+country+'dbpedia.org/resource/'+album+'> 	db-owl:producer            ?producerAlbum \n'+
'   	OPTIONAL {?producerAlbum       	db-owl:abstract                 ?abstractProducer      . FILTER langMatches(lang(?abstractProducer), "'+countryLang+'")}. \n'+
'		OPTIONAL {?producerAlbum  	db-owl:associatedMusicalArtist  ?associatedMusicalArtist}. \n'+
'		OPTIONAL {?producerAlbum        db-owl:recordLabel      ?recordLabel}. \n'+
'		OPTIONAL {?producerAlbum       	dc:subject              ?subject}. \n'+
'       OPTIONAL {?producerAlbum   	db-owl:artist  		?artist}. \n'+
'		OPTIONAL {?producerAlbum  	db-owl:occupation       ?occupation}. \n'+
'	} \n'+
'	} \n'+
' }ORDER BY DESC(?artistAlbum) ' ;
  
}; 

exports.construct_request = construct_request;




