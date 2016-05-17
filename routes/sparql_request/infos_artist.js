var dbpediaHandler  = require('../handler/dbpediaHandler.js');

var construct_request = function (artist, country) {

    var objCountry = dbpediaHandler.getCountryOfEndpoint(country);
    
    return  ' PREFIX db-owl: <http://dbpedia.org/ontology/> ' +
    ' PREFIX rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+
    ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> '+
    ' PREFIX prop:   <http://dbpedia.org/property/> '+
    ' PREFIX dc:      <http://purl.org/dc/terms/> '+
    ' CONSTRUCT { '+
    ' <http://'+objCountry.country+'dbpedia.org/resource/'+artist+'> db-owl:bandMember ?bandMemberBand ; '+
    ' db-owl:abstract ?abstractBand ; '+
    ' db-owl:genre ?genre ; '+
    ' db-owl:recordLabel ?recordLabel ; '+
    ' db-owl:activeYearsStartYear ?activeYearsStartYearBand ; '+
    ' db-owl:associatedMusicalArtist ?associatedMusicalArtistBand ; '+
    ' dc:subject ?subjectBand ; '+
    ' prop:birthName ?birthName ; '+
    ' prop:instrument ?instrument ; '+	
    ' db-owl:birthDate ?birthDate ; '+
    ' db-owl:formerBandMember ?formerBandMemberBand .  '+
    ' ?formerBandMemberBand  rdfs:label ?labelFormer ; '+
    ' prop:birthName ?birthNameFormer ; '+
    ' prop:instrument ?instrumentFormer ; '+	
    ' db-owl:abstract ?abstractFormer ; '+
    ' db-owl:activeYearsStartYear ?activeYearsStartYearFormer ; '+
    ' dc:subject ?subjectFormer ; '+
    ' db-owl:birthDate ?birthDateFormer . '+		
    ' ?bandMemberBand rdfs:label ?labelMember ; '+
    ' prop:birthName ?birthNameMember ; '+
    ' prop:instrument ?instrumentMember ; '+	
    ' db-owl:abstract ?abstractMember ;  '+
    ' db-owl:activeYearsStartYear ?activeYearsStartYearMember ; '+
    ' dc:subject ?subjectMember ; '+
    ' db-owl:birthDate ?birthDateMember . '+
    ' } '+
    ' where { '+
    '    { '+
    '       OPTIONAL {<http://'+objCountry.country+'dbpedia.org/resource/'+artist+'> 	dc:subject ?subjectBand} '+
    '       OPTIONAL {<http://'+objCountry.country+'dbpedia.org/resource/'+artist+'> db-owl:genre ?genre}. '+
    '       OPTIONAL {<http://'+objCountry.country+'dbpedia.org/resource/'+artist+'> db-owl:associatedMusicalArtist ?associatedMusicalArtistBand} . '+
    '       OPTIONAL {<http://'+objCountry.country+'dbpedia.org/resource/'+artist+'> db-owl:recordLabel ?recordLabel} . '+
    '       OPTIONAL {<http://'+objCountry.country+'dbpedia.org/resource/'+artist+'> db-owl:activeYearsStartYear ?activeYearsStartYearBand} . '+
    '       OPTIONAL {<http://'+objCountry.country+'dbpedia.org/resource/'+artist+'> db-owl:abstract ?abstractBand . FILTER langMatches(lang(?abstractBand), "'+objCountry.countryLang+'")} . '+
    '       OPTIONAL {<http://'+objCountry.country+'dbpedia.org/resource/'+artist+'> prop:birthName ?birthName . FILTER langMatches(lang(?birthName), "'+objCountry.countryLang+'")} . '+
    '       OPTIONAL {<http://'+objCountry.country+'dbpedia.org/resource/'+artist+'> prop:instrument ?instrument . FILTER langMatches(lang(?instrument), "'+objCountry.countryLang+'")} . '+
    '       OPTIONAL {<http://'+objCountry.country+'dbpedia.org/resource/'+artist+'> db-owl:birthDate ?birthDate} . '+
    '    }UNION{ '+
    '       OPTIONAL { '+
    '           <http://'+objCountry.country+'dbpedia.org/resource/'+artist+'> db-owl:formerBandMember ?formerBandMemberBand . '+
    '           OPTIONAL {?formerBandMemberBand rdfs:label ?labelFormer       . FILTER langMatches(lang(?labelFormer), "'+objCountry.countryLang+'")} . '+
    '           OPTIONAL {?formerBandMemberBand prop:birthName ?birthNameFormer	. FILTER langMatches(lang(?birthNameFormer), "'+objCountry.countryLang+'")} . '+
    '           OPTIONAL {?formerBandMemberBand prop:instrument ?instrumentFormer	. FILTER langMatches(lang(?instrumentFormer), "'+objCountry.countryLang+'")} . '+
    '           OPTIONAL {?formerBandMemberBand db-owl:abstract ?abstractFormer	. FILTER langMatches(lang(?abstractFormer), "'+objCountry.countryLang+'")} . '+
    '           OPTIONAL {?formerBandMemberBand db-owl:activeYearsStartYear ?activeYearsStartYearFormer} . '+
    '           OPTIONAL {?formerBandMemberBand dc:subject ?subjectFormer } . '+
    '           OPTIONAL {?formerBandMemberBand db-owl:birthDate ?birthDateFormer} . '+
    '       }. '+
    '       OPTIONAL { '+
    '           <http://'+objCountry.country+'dbpedia.org/resource/'+artist+'> db-owl:bandMember ?bandMemberBand . '+
    '           OPTIONAL {?bandMemberBand 	rdfs:label ?labelMember . FILTER langMatches(lang(?labelMember), "'+objCountry.countryLang+'")} . '+
    '           OPTIONAL {?bandMemberBand  prop:birthName ?birthNameMember . FILTER langMatches(lang(?birthNameMember), "'+objCountry.countryLang+'")} . '+
    '           OPTIONAL {?bandMemberBand 	prop:instrument ?instrumentMember . FILTER langMatches(lang(?instrumentMember), "'+objCountry.countryLang+'")} . '+
    '           OPTIONAL {?bandMemberBand 	db-owl:abstract ?abstractMember . FILTER langMatches(lang(?abstractMember), "'+objCountry.countryLang+'")} . '+
    '           OPTIONAL {?bandMemberBand 	db-owl:activeYearsStartYear  ?activeYearsStartYearMember} . '+
    '           OPTIONAL {?bandMemberBand  db-owl:birthDate ?birthDateMember} . '+
    '           OPTIONAL {?bandMemberBand  dc:subject ?subjectMember} . '+
    '       } '+
    '   } '+
    ' } ORDER BY DESC(?bandMemberBand) ';
}; 


exports.construct_request = construct_request;






