class Song {
    constructor() {
        this.title = "";
        this.urlSong = "";
        this.lyrics = "";
        this.urlWikipedia = "";
        this.urlYouTube = "";
        this.urlITunes = "";
        this.urlAmazon = "";
        this.urlGoEar = "";
        this.urlSpotify = "";
        this.urlAllmusic = "";
        this.urlMusicBrainz = "";
        this.urlLastFm = "";
        this.urlHypeMachine = "";
        this.urlPandora = "";
        this.isClassic = false;

        this.id_song_deezer = "";
        this.isrc = "";
        this.length = "";
        this.explicitLyrics = false;
        this.rank = "";
        this.bpm = "";
        this.publicationDate = "";
        this.gain = "";
        this.preview = "";
        this.availableCountries = [];
    }
}
module.exports = Song;