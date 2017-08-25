class Artist {
    constructor() {
        this.name = "";
        this.gender = "";
        this.picture = "";
        this.members = [];
        this.labels = [];
        this.genres = [];
        this.abstract = "";
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
        this.nameVariations = [];
        this.urls = []
        this.locationInfo = [];
        this.albums = [];

        this.deezerFans = 0;
        this.disambiguation = "";
        this.type = "";

        this.animux_path = "";
        this.rdf = "";

        this.id_artist_musicbrainz = "";
        this.id_artist_discogs = "";
        this.id_artist_deezer = "";

        this.urlWikipedia = "";
        this.urlWikidata = "";
        this.urlSecondHandSongs = "";
        this.urlLastFm = "";
        this.urlInstagram = "";
        this.urlGooglePlus = "";
        this.urlDeezer = "";
        this.urlBBC = "";
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
    }
}
module.exports = Artist;