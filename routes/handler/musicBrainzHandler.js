import request from 'request';

/**
 * API permettant de recupérer les informations d'un artiste sur musicbrainz
 * @param {*} urlMusicBrainz : une url vers la page d'un artiste de MusicBrainz
 */
var getArtistInfosFromMusicBrainz = (urlMusicBrainz) => {
    return new Promise((resolve, reject) => {
        request({
            url: urlMusicBrainz,
            headers: {
                'User-Agent': 'wasabi'
            }
        }, (err, resp, body) => {
            if (!err && resp.statusCode == 200) {
                resolve(JSON.parse(body));
            } else {
                console.log("erreur "+err);
                reject(err);
            }
        });
    })
};






exports.getArtistInfosFromMusicBrainz = getArtistInfosFromMusicBrainz;