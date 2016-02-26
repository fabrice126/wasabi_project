//Cette requête vérifie si il y a des documents identiques
//L'attribut "name" doit être unique, supprimer les documents en trop
db.getCollection('artist').aggregate([
  { $group: { 
    _id: { name: "$name"}, 
    uniqueIds: { $addToSet: "$_id" },
    count: { $sum: 1 } 
  }}, 
  { $match: { 
    count: { $gt: 1 } 
  }}
])