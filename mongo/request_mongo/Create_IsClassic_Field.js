//on ajoute ou on met � jour le champ isClassic � false

db.song.update({}, {$set: {isClassic: false}}, { multi: true })

//On met � jour les champs isClassic � true si ils correspondent aux crit�res 

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



