import mongoose from 'mongoose';

var songSchema = new mongoose.Schema({
    id_artist: {
        type: mongoose.Schema.ObjectId,
        ref: "Artist",
        required: [true, 'You must type an id_artist'],
        index: true
    },
    id_album: {
        type: mongoose.Schema.ObjectId,
        ref: "Album",
        required: [true, 'You must type an id_album'],
        index: true
    },
    name: {
        type: String,
        trim: true,
        required: [true, 'You must type a name'],
        index: true
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'You must type a title'],
        index: true
    },
    albumTitle: {
        type: String,
        trim: true,
        required: [true, 'You must type an albumTitle'],
        index: true
    },
    position: {
        type: Number,
        required: [true, 'You must type a position'],
        index: true
    },
    lengthAlbum: {
        type: String,
        trim: true,
        default: ""
    },
    publicationDateAlbum: {
        type: String,
        trim: true,
        default: ""
    },
    lyrics: {
        type: String,
        trim: true,
        default: ""
    },
    urlSong: {
        type: String,
        trim: true,
        default: ""
    },
    urlWikipedia: {
        type: String,
        trim: true,
        default: ""
    },
    urlYouTube: {
        type: String,
        trim: true,
        default: ""
    },
    urlITunes: {
        type: String,
        trim: true,
        default: ""
    },
    urlAmazon: {
        type: String,
        trim: true,
        default: ""
    },
    urlGoEar: {
        type: String,
        trim: true,
        default: ""
    },
    urlSpotify: {
        type: String,
        trim: true,
        default: ""
    },
    urlAllmusic: {
        type: String,
        trim: true,
        default: ""
    },
    urlMusicBrainz: {
        type: String,
        trim: true,
        default: ""
    },
    urlLastFm: {
        type: String,
        trim: true,
        default: ""
    },
    urlHypeMachine: {
        type: String,
        trim: true,
        default: ""
    },
    urlPandora: {
        type: String,
        trim: true,
        default: ""
    },
    rdf: {
        type: String,
        trim: true,
        default: ""
    },
    format: {
        type: [String],
    },
    genre: {
        type: [String],
    },
    producer: {
        type: [String],
    },
    recordLabel: {
        type: [String],
    },
    writer: {
        type: [String],
    },
    recorded: {
        type: [String],
    },
    abstract: {
        type: String,
        trim: true,
        default: ""
    },
    releaseDate: {
        type: String,
        trim: true,
        default: ""
    },
    runtime: {
        type: [String],
    },
    award: {
        type: [String],
    },
    subject: {
        type: [String],
    },
    isClassic: {
        type: Boolean,
        default: false
    },
    multitrack_file: {
        type: String,
        trim: true,
        default: ""
    },
    multitrack_path: {
        type: String,
        trim: true,
        default: ""
    },
    wordCount: {
        type: [],
        default: []
    },

    id_song_deezer: {
        type: String,
        trim: true,
        default: ""
    },
    isrc: {
        type: String,
        trim: true,
        default: ""
    },
    length: {
        type: String,
        trim: true,
        default: ""
    },
    explicitLyrics: {
        type: Boolean,
        default: false
    },
    rank: {
        type: String,
        trim: true,
        default: ""
    },
    bpm: {
        type: String,
        trim: true,
        default: ""
    },
    gain: {
        type: String,
        trim: true,
        default: ""
    },
    publicationDate: {
        type: String,
        trim: true,
        default: ""
    },
    preview: {
        type: String,
        trim: true,
        default: ""
    },
    availableCountries: {
        type: [String],
    },

    //liste des champs pouvant ne pas exister dans un document album
}, {
    collection: 'song'
});
export default mongoose.model('Song', songSchema);