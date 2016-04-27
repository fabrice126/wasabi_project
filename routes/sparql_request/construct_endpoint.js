var construct_endpoint = function(country) {
    var newcountry = country;
    if(country =='en.' ){
        newcountry = '';
    }
    return "http://"+newcountry+"dbpedia.org/sparql?default-graph-uri=http://"+newcountry+"dbpedia.org&query=";
};

exports.construct_endpoint = construct_endpoint;