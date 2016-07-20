//on ajoute ou on met à jour le champ isClassic à false
db.song.update({}, {$set: {isClassic: false}}, { multi: true })
//On met à jour les champs isClassic à true si ils correspondent aux critères 
db.song.update(
    {$or:[
            {subject:/best/i},
            {subject:/award/i},
            {subject:/Hall_of_fame/i},
            {subject:/diamond/i},
            {subject:/platinum/i},
            {subject:/gold/i},
            {subject:/hot_100/i}
        ]}, 
        {$set: {isClassic: true}}, { multi: true })

