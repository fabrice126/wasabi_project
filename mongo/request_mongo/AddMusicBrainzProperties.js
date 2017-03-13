/**
 * Conseil : lancer ce script après avoir lancé l'API /updatedb/muscibrainz/artist 
 * Ce script doit être lancé uniquement si les documents possédant une URL vers 
 * musicbrainz n'ont pas les propriétés ci-dessous, donc que l'API /updatedb/muscibrainz/artist n'a jamais été exécutée
 * 
 * Ce script permet :
 * 1 - de mettre a jour chaque document de la collection artiste 
 * 2 - d'y ajouter les propriétés relatives a musicbrainz
 * 3 - Si le document n'a pas d'id_artist_musicbrainz :
 *      => c'est qu'il n'a pas de lien vers musicbrainz (urlMusicBrainz == "") OU que l'urlMusicBrainz n'est pas valide
 * 
 * 
 */

var objArtist = {
    id_artist_musicbrainz: "",
    disambiguation: "",
    type: "",
    lifeSpan: {
        "ended": false,
        "begin": "",
        "end": ""
    },
    location: {
        "id_city_musicbrainz": "",
        "country": "",
        "city": ""
    },
    endArea: {
        "id": "",
        "name": "",
        "disambiguation": ""
    },
    gender: "",
    members:[]
}
db.artist.updateMany({
    id_artist_musicbrainz: {
        $exists: 0
    }
}, {
    $set: objArtist
})