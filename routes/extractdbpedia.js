var express         = require('express');
var router          = express.Router();
var db              = require('mongoskin').db('mongodb://localhost:27017/wasabi');
var SparqlParser    = require('sparqljs').Parser;
var SparqlGenerator = require('sparqljs').Generator;

router.get('/artist',function(req, res){
    var parser = new SparqlParser();
    var parsedQuery = parser.parse(
        'prefix db-owl: <http://dbpedia.org/ontology/>'+
        'prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>'+
        'prefix prop: <http://dbpedia.org/property/>'+
        'SELECT *' +
        'WHERE'+
        '{'+
            '<http://dbpedia.org/resource/Iron_Maiden> 	db-owl:bandMember ?bandMemberBand'+
        '}ORDER BY DESC(?bandMemberBand)'
    );

    // Regenerate a SPARQL query from a JSON object
    var generator = new SparqlGenerator();
    var query = {};
    query.variables = ['?bandMemberBand'];
    var generatedQuery = generator.stringify(query);
    
    
    
        this.console.log(JSON.stringify(query));

    this.console.log(JSON.stringify(parsedQuery));
    
//        <http://dbpedia.org/resource/Iron_Maiden>	db-owl:bandMember ?bandMemberBand ;
//            db-owl:abstract ?abstractBand ;
//            db-owl:activeYearsStartYear ?activeYearsStartYearBand  ;
//            db-owl:formerBandMember ?formerBandMemberBand .
//		
//        ?formerBandMemberBand 
//            rdfs:label   ?labelFormer;
//            prop:birthName   ?birthNameFormer;
//            prop:instrument   ?instrumentFormer;	
//            db-owl:abstract   ?abstractFormer;
//            db-owl:activeYearsStartYear   ?activeYearsStartYearFormer;
//            db-owl:birthDate   ?birthDateFormer.	 		
//            #dc:subject   ?subjectFormer.
//        ?bandMemberBand 	rdfs:label   ?labelMember ;
//            prop:birthName   ?birthNameMember;
//            prop:instrument   ?instrumentMember;	
//            db-owl:abstract   ?abstractMember;
//            db-owl:activeYearsStartYear   ?activeYearsStartYearMember;
//            db-owl:birthDate   ?birthDateMember. 		
//            #dc:subject   ?subjectMember.
});


module.exports = router;