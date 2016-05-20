db.getCollection('song').createIndex({"award" : 1},{ sparse: true })
db.getCollection('song').createIndex({"subject" : 1},{ sparse: true })