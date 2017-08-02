//same_as_request.js de récupérer les attributs same as de la page dbpédia correspondant a un artist
//Quand l'utiliser : Si nous sommes en présence d'un artiste francais ayant une url wikipédia pointant vers un dbpédia non francais dans notre base de données
//Si tel est le cas, nous devons envoyer une requête vers l'url wikipédia afin de récupérer son attribut same as et ensuite recupérer le same as pointant vers le dbpédia francais
// si l'attribut same as pointant vers le dbpédia francais n'existe pas alors nous requêterons vers le dbpédia de l'url de notre base
import dbpediaHandler from '../extractdbpedia.controller.js';

var construct_request = function (obj, country) {

    var objCountry = dbpediaHandler.getCountryOfEndpoint(country);

    return ' PREFIX owl: <http://www.w3.org/2002/07/owl#> ' +
        ' SELECT ?sameAs WHERE { ' +
        '    <http://' + objCountry.country + 'dbpedia.org/resource/' + obj + '> owl:sameAs ?sameAs .FILTER regex(str(?sameAs), "http://fr.dbpedia.org/") ' +
        ' } ';
};


exports.construct_request = construct_request;