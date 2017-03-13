class Artist {
    constructor() {
        this.name = "";
        this.urlWikipedia = "";
        this.urlOfficialWebsite = "";
        this.urlFacebook = "";
        this.urlMySpace = "";
        this.urlTwitter = "";
        this.urlWikia = "";

        this.urlAmazon = "";
        this.urlITunes = "";
        this.urlAllmusic = "";
        this.urlDiscogs = "";
        this.urlMusicBrainz = "";
        this.urlYouTube = "";
        this.urlSpotify = "";
        this.urlPureVolume = "";
        this.urlRateYourMusic = "";
        this.urlSoundCloud = "";

        this.members = [];
        this.locationInfo = [];
        this.genres = [];
        this.labels = [];
        this.albums = [];
        this.id_artist_musicbrainz = "";
        this.disambiguation = "";
        this.type = "";
        this.lifeSpan = {
            "ended": false,
            "begin": "",
            "end": ""
        };
        this.location = {
            "id_city_musicbrainz": "",
            "country": "",
            "city": ""
        };
        this.endArea = {
            "id": "",
            "name": "",
            "disambiguation": ""
        };
        this.gender = "";
    }
}
module.exports = Artist;