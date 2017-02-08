import dbpediaHandler from '../handler/dbpediaHandler.js';

var construct_request = (song, country) => {

    var objCountry = dbpediaHandler.getCountryOfEndpoint(country);

    return ' PREFIX db-owl: <http://dbpedia.org/ontology/> ' +
        ' PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
        ' PREFIX prop: <http://dbpedia.org/property/> ' +
        ' PREFIX dc:      <http://purl.org/dc/terms/> ' +
        ' CONSTRUCT { ' +
        ' <http://' + objCountry.country + 'dbpedia.org/resource/' + song + '>	db-owl:writer ?writer ; ' +
        '             db-owl:abstract ?abstract; ' +
        '             db-owl:producer ?producer; ' +
        '             db-owl:genre ?genre; ' +
        '             db-owl:recordLabel ?recordLabel;  ' +
        '             db-owl:album ?album; ' +
        '             db-owl:runtime ?runtime; ' +
        '             prop:recorded ?recorded; ' +
        '             dc:subject ?subject; ' +
        '             db-owl:format ?format; ' +
        '             db-owl:releaseDate ?releaseDate; ' +
        '             prop:award ?award. ' +
        ' } ' +
        ' where { ' +
        '     OPTIONAL {<http://' + objCountry.country + 'dbpedia.org/resource/' + song + '> db-owl:writer ?writer} . ' +
        '     OPTIONAL {<http://' + objCountry.country + 'dbpedia.org/resource/' + song + '> db-owl:abstract ?abstract . FILTER langMatches(lang(?abstract),  "' + objCountry.countryLang + '" )}  . ' +
        '     OPTIONAL {<http://' + objCountry.country + 'dbpedia.org/resource/' + song + '> db-owl:producer ?producer} . ' +
        '     OPTIONAL {<http://' + objCountry.country + 'dbpedia.org/resource/' + song + '> db-owl:genre ?genre} . ' +
        '     OPTIONAL {<http://' + objCountry.country + 'dbpedia.org/resource/' + song + '> db-owl:recordLabel ?recordLabel} . ' +
        '     OPTIONAL {<http://' + objCountry.country + 'dbpedia.org/resource/' + song + '> db-owl:album ?album} . ' +
        '     OPTIONAL {<http://' + objCountry.country + 'dbpedia.org/resource/' + song + '> db-owl:runtime ?runtime} . ' +
        '     OPTIONAL {<http://' + objCountry.country + 'dbpedia.org/resource/' + song + '> prop:recorded ?recorded } . ' +
        '     OPTIONAL {<http://' + objCountry.country + 'dbpedia.org/resource/' + song + '> dc:subject ?subject } . ' +
        '     OPTIONAL {<http://' + objCountry.country + 'dbpedia.org/resource/' + song + '> db-owl:format ?format } . ' +
        '     OPTIONAL {<http://' + objCountry.country + 'dbpedia.org/resource/' + song + '> db-owl:releaseDate ?releaseDate } . ' +
        '     OPTIONAL {<http://' + objCountry.country + 'dbpedia.org/resource/' + song + '> prop:award ?award . FILTER langMatches(lang(?award),  "' + objCountry.countryLang + '" )} . ' +
        ' }ORDER BY DESC(?writer)  ';
};


exports.construct_request = construct_request;