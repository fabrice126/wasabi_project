// /!\ CETTE OPERATION PEUT PRENDRE DU TEMPS /!\
//create index pour la collection album                
db.getCollection('album').createIndex({ name: 1});    
db.getCollection('album').createIndex({ title: 1}); 
db.getCollection('album').createIndex({ publicationDate: 1}); 
db.getCollection('album').createIndex({ genre: 1}); 
//create index pour la collection song
db.getCollection('song').createIndex({ name: 1});    
db.getCollection('song').createIndex({ albumTitle: 1}); 
db.getCollection('song').createIndex({ title: 1}); 
db.getCollection('song').createIndex({ position: 1}); 
//create index pour la collection artist
db.getCollection('artist').createIndex({ name: 1}, { unique: true });
db.getCollection('artist').createIndex({ urlWikipedia:1});
