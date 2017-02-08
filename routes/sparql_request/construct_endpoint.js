import dbpediaHandler from '../handler/dbpediaHandler.js';

var construct_endpoint = (country) => {
    var objCountry = dbpediaHandler.getCountryOfEndpoint(country);
    return "http://" + objCountry.country + "dbpedia.org/sparql?default-graph-uri=http://" + objCountry.country + "dbpedia.org&query=";
};

exports.construct_endpoint = construct_endpoint;