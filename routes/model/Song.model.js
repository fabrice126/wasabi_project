import mongoose from 'mongoose';

var songSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: [true, 'You must type a title'],
        index: true
    },
    urlSong: {
        type: String,
        default: ""
    },
    lyrics: {
        type: String,
        default: ""
    },
    urlWikipedia: {
        type: String,
        default: ""
    },
    urlYoutube: {
        type: String,
        default: ""
    },
    urlITunes: {
        type: String,
        default: ""
    },
    urlAmazon: {
        type: String,
        default: ""
    },
    urlGoEar: {
        type: String,
        default: ""
    },
    urlSpotify: {
        type: String,
        default: ""
    },
    urlAllmusic: {
        type: String,
        default: ""
    },
    urlMusicBrainz: {
        type: String,
        default: ""
    },
    urlLastFm: {
        type: String,
        default: ""
    },
    urlHypeMachine: {
        type: String,
        default: ""
    },
    urlPandora: {
        type: String,
        default: ""
    },
    isClassic: {
        type: Boolean,
        default: false
    },
    position: {
        type: Number,
        required: [true, 'You must type a position'],
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
        required: [true, 'You must type a name'],
        index: true
    },
    albumTitre: {
        type: String,
        required: [true, 'You must type an albumTitre'],
        index: true
    }
});
export default mongoose.model('Song', songSchema);
