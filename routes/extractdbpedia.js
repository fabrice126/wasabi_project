var express         = require('express');
var router          = express.Router();
var db              = require('mongoskin').db('mongodb://localhost:27017/wasabi');
var dbpediaHandler     = require('./handler/dbpediaHandler.js');

router.get('/artist',function(req, res){

    //Requête mongo db cherchant les urlWikipedia non equal a ""
    
    db.collection('artist').find({urlWikipedia:{$ne:""}});
    dbpediaHandler.getArtistInfosDbpedia(objArtist,sparqlRequest);


    
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
router.get('/album',function(req, res){
        db.collection('album').find({urlWikipedia:{$ne:""}});

        dbpediaHandler.getAlbumInfosDbpedia(objArtist,sparqlRequest);
});
router.get('/song',function(req, res){
        db.collection('song').find({urlWikipedia:{$ne:""}});

        dbpediaHandler.getSongInfosDbpedia(objArtist,sparqlRequest);
});
module.exports = router;

/*
http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=prefix+db-owl%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%3E%0D%0Aprefix+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0Aprefix+prop%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fproperty%2F%3E%0D%0Aprefix+dc%3A+%3Chttp%3A%2F%2Fdublincore.org%2Fdocuments%2F2012%2F06%2F14%2Fdcmi-terms%2F%3Fv%3Dterms%23subject%3E%0D%0ACONSTRUCT+%7B%0D%0A%09%09+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FMetallica%3E%09db-owl%3AbandMember+%3FbandMemberBand+%3B%0D%0A%09%09%09%09++%09%09db-owl%3Aabstract+%3FabstractBand+%3B%0D%0A%09%09%09%09%09%09db-owl%3AactiveYearsStartYear+%3FactiveYearsStartYearBand++%3B%0D%0A%09%09%09%09%09%09db-owl%3AformerBandMember+%3FformerBandMemberBand+.%0D%0A%09%09%0D%0A%09%09%3FformerBandMemberBand+%0D%0A%09%09%09%09rdfs%3Alabel+++%3FlabelFormer%3B%0D%0A%09%09%09%09prop%3AbirthName+++%3FbirthNameFormer%3B%0D%0A%09%09%09%09prop%3Ainstrument+++%3FinstrumentFormer%3B%09%0D%0A%09%09%09%09db-owl%3Aabstract+++%3FabstractFormer%3B%0D%0A%09%09%09%09db-owl%3AactiveYearsStartYear+++%3FactiveYearsStartYearFormer%3B%0D%0A%09%09%09%09db-owl%3AbirthDate+++%3FbirthDateFormer.%09+%09%09%0D%0A%09%09%09%09%23dc%3Asubject+++%3FsubjectFormer.%0D%0A%09%09%3FbandMemberBand+%09rdfs%3Alabel+++%3FlabelMember+%3B%0D%0A%09%09%09%09prop%3AbirthName+++%3FbirthNameMember%3B%0D%0A%09%09%09%09prop%3Ainstrument+++%3FinstrumentMember%3B%09%0D%0A%09%09%09%09db-owl%3Aabstract+++%3FabstractMember%3B%0D%0A%09%09%09%09db-owl%3AactiveYearsStartYear+++%3FactiveYearsStartYearMember%3B%0D%0A%09%09%09%09db-owl%3AbirthDate+++%3FbirthDateMember.+%09%09%0D%0A%09%09%09%09%23dc%3Asubject+++%3FsubjectMember%0D%0A%7D%0D%0Awhere+%7B%0D%0A%0D%0A%09%09%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FMetallica%3E+%09%09db-owl%3AbandMember+%3FbandMemberBand.%0D%0A%09%09OPTIONAL+%7B%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FMetallica%3E%09db-owl%3AactiveYearsStartYear+%3FactiveYearsStartYearBand%7D++.%0D%0A%09%09OPTIONAL+%7B%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FMetallica%3E%09db-owl%3Aabstract+%3FabstractBand%09%09%09.+FILTER+langMatches%28lang%28%3FabstractBand%29%2C+%27en%27%29%7D+.%0D%0A%09%09%23Extraction+des+informations+sur+les+anciens+membres%0D%0A%09%09%23OPTIONAL+imbriqu%C3%A9+car+%3FformerBandMemberBand+peut+ne+pas+exister%2C+si+c%27est+le+cas+virtuoso+pr%C3%A9dit+un+temps+trop+%C3%A9lev%C3%A9+pour+la+requ%C3%AAte+et+nous+bloque%0D%0A%09%09OPTIONAL+%7B%0D%0A%09%09%09%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FMetallica%3E%09db-owl%3AformerBandMember+%3FformerBandMemberBand+.%0D%0A%09%09%09%3FformerBandMemberBand+%09%09rdfs%3Alabel+++%09%09%3FlabelFormer.++FILTER+langMatches%28lang%28%3FlabelFormer%29%2C+%27en%27%29.%0D%0A%09%09%09OPTIONAL+%7B%3FformerBandMemberBand++%09prop%3AbirthName+++%09%3FbirthNameFormer%09.+FILTER+langMatches%28lang%28%3FbirthNameFormer%29%2C+%27en%27%29%7D+.%0D%0A%09%09%09OPTIONAL+%7B%3FformerBandMemberBand+%09prop%3Ainstrument+++%09%3FinstrumentFormer%09.+FILTER+langMatches%28lang%28%3FinstrumentFormer%29%2C+%27en%27%29%7D+.%0D%0A%09%09%09OPTIONAL+%7B%3FformerBandMemberBand+%09db-owl%3Aabstract+++%09%3FabstractFormer%09.+FILTER+langMatches%28lang%28%3FabstractFormer%29%2C+%27en%27%29%7D+.%0D%0A%09%09%09OPTIONAL+%7B%3FformerBandMemberBand+%09db-owl%3AactiveYearsStartYear+++%3FactiveYearsStartYearFormer%7D+.%0D%0A%09%09%09OPTIONAL+%7B%3FformerBandMemberBand++%09db-owl%3AbirthDate+++%09%3FbirthDateFormer%7D+.%0D%0A%09%09%7D.%0D%0A%09%09%0D%0A%09%09%23Extraction+des+informations+sur+les+membres%0D%0A%09%09OPTIONAL+%7B%3FbandMemberBand+%09rdfs%3Alabel+++%09%09%3FlabelMember+%09.+FILTER+langMatches%28lang%28%3FlabelMember%29%2C+%27en%27%29%7D+.%0D%0A%09%09OPTIONAL+%7B%3FbandMemberBand++%09prop%3AbirthName++%09%3FbirthNameMember%09.+FILTER+langMatches%28lang%28%3FbirthNameMember%29%2C+%27en%27%29%7D+.%0D%0A%09%09OPTIONAL+%7B%3FbandMemberBand+%09prop%3Ainstrument+++%09%3FinstrumentMember%09.+FILTER+langMatches%28lang%28%3FinstrumentMember%29%2C+%27en%27%29%7D+.%0D%0A%09%09OPTIONAL+%7B%3FbandMemberBand+%09db-owl%3Aabstract+++%09%3FabstractMember%09.+FILTER+langMatches%28lang%28%3FabstractMember%29%2C+%27en%27%29%7D+.%0D%0A%09%09OPTIONAL+%7B%3FbandMemberBand+%09db-owl%3AactiveYearsStartYear+++%3FactiveYearsStartYearMember%7D+.%0D%0A%09%09OPTIONAL+%7B%3FbandMemberBand++%09db-owl%3AbirthDate+++%09%3FbirthDateMember%7D+.%0D%0A%09%09%23OPTIONAL+%7B%3FbandMemberBand++%09dc%3Asubject+++%3FsubjectMember%7D+.%0D%0A%0D%0A%0D%0A%0D%0A+++++%7DORDER+BY+DESC%28%3FbandMemberBand%29+%0D%0A&format=text%2Fhtml&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on

*/