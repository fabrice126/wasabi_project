//A lancer une fois le RDF récupéré sur dbpédia et les propriétés du rdf ajoutées dans la base de données
db.song.createIndex({"award" : 1},{ sparse: true });
db.song.createIndex({"subject" : 1},{ sparse: true });
db.song.createIndex({"producer" : 1},{ sparse: true });
db.song.createIndex({"recorded" : 1},{ sparse: true });
db.song.createIndex({"recordLabel" : 1},{ sparse: true });
db.song.createIndex({"genre" : 1},{ sparse: true });
db.song.createIndex({"writer" : 1},{ sparse: true });
db.song.createIndex({"format" : 1},{ sparse: true });