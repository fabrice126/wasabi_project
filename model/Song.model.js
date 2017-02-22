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
    urlYoutube: {
        type: String,
        trim: true,
        default: ""
    },
    urlITunes: {
        type: String,
        trim: true,
    },
    urlAmazon: {
        type: String,
        trim: true,
    },
    urlGoEar: {
        type: String,
        trim: true,
    },
    urlSpotify: {
        type: String,
        trim: true,
    },
    urlAllmusic: {
        type: String,
        trim: true,
    },
    urlMusicBrainz: {
        type: String,
        trim: true,
    },
    urlLastFm: {
        type: String,
        trim: true,
    },
    urlHypeMachine: {
        type: String,
        trim: true,
    },
    urlPandora: {
        type: String,
        trim: true,
    },
    rdf: {
        type: String,
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
    },
    releaseDate: {
        type: String,
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
    },
    multitrack_path: {
        type: String,
    },
    wordCount: {
        type: [],
    },



    //liste des champs pouvant ne pas exister dans un document album
}, {
    collection: 'song'
});
export default mongoose.model('Song', songSchema);