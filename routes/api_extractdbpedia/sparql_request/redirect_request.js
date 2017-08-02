//redirect_request.js permet comme son nom l'indique de rediriger les requêtes vers les bonnes URL
//Explication : Si une page nommée "http://dbpedia.org/page/KISS_(Band)" a été renommée par "http://dbpedia.org/resource/Kiss_(band)" alors une propriété (wikiPageRedirects)
//nous permettra d'obtenir la nouvelle page avec l'ancienne URL
import dbpediaHandler from '../extractdbpedia.controller.js';

var construct_request = (obj, country) => {

    var objCountry = dbpediaHandler.getCountryOfEndpoint(country);

    return ' PREFIX db-owl: <http://dbpedia.org/ontology/> ' +
        ' PREFIX owl: <http://www.w3.org/2002/07/owl#> ' +
        ' SELECT ?redirect WHERE { ' +
        '    <http://' + objCountry.country + 'dbpedia.org/resource/' + obj + '> db-owl:wikiPageRedirects ?redirect ' +
        ' } ';
};


exports.construct_request = construct_request;