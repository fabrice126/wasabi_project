import mongoose from 'mongoose';
var stringSchema = {
    type: String,
    trim: true,
    default: ""
};
var arrayOfStringSchema = {
    type: [String],
    default: []
};
var stringSchemaIndex = {
    type: String,
    trim: true,
    default: "",
    index: true
};
var songSchema = new mongoose.Schema({
    name: {
        ...stringSchemaIndex,
        required: [true, 'You must type a name'],
    },
    title: {
        ...stringSchemaIndex,
        required: [true, 'You must type a title'],
    },
    albumTitle: {
        ...stringSchemaIndex,
        required: [true, 'You must type an albumTitle'],
    },
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
    id_song_musicbrainz: stringSchemaIndex,
    id_artist_deezer: stringSchemaIndex,
    id_album_deezer: stringSchemaIndex,
    id_song_deezer: stringSchemaIndex,
    position: {
        type: Number,
        required: [true, 'You must type a position'],
        index: true
    },
    publicationDate: stringSchema,
    lengthAlbum: stringSchema,
    publicationDateAlbum: stringSchema,
    lyrics: stringSchema,
    format: arrayOfStringSchema,
    genre: arrayOfStringSchema,
    producer: arrayOfStringSchema,
    recordLabel: arrayOfStringSchema,
    writer: arrayOfStringSchema,
    recorded: arrayOfStringSchema,
    abstract: stringSchema,
    releaseDate: stringSchema,
    runtime: arrayOfStringSchema,
    award: arrayOfStringSchema,
    subject: arrayOfStringSchema,
    availableCountries: arrayOfStringSchema,
    isClassic: {
        type: Boolean,
        default: false
    },
    isrc: stringSchema,
    length: stringSchema,
    explicitLyrics: {
        type: Boolean,
        default: false
    },
    rank: stringSchema,
    bpm: stringSchema,
    gain: stringSchema,
    preview: stringSchema,
    language: stringSchema,
    language_detect: stringSchema,
    begin: stringSchema,
    end: stringSchema,
    deezer_mapping: {
        type: [],
        default: []
    },
    disambiguation: stringSchema,
    multitrack_file: stringSchema,
    multitrack_path: stringSchema,
    animux_content: stringSchema,
    animux_path: stringSchema,
    rdf: stringSchema,
    urlSong: stringSchema,
    urlWikipedia: stringSchema,
    urlDeezer: stringSchema,
    urlYouTube: stringSchema,
    urlITunes: stringSchema,
    urlAmazon: stringSchema,
    urlGoEar: stringSchema,
    urlSpotify: stringSchema,
    urlAllmusic: stringSchema,
    urlMusicBrainz: stringSchema,
    urlLastFm: stringSchema,
    urlHypeMachine: stringSchema,
    urlPandora: stringSchema,
    //liste des champs pouvant ne pas exister dans un document album
}, {
    collection: 'song',
    toObject: {
        retainKeyOrder: true
    },
    toJSON: {
        retainKeyOrder: true
    }
});
export default mongoose.model('Song', songSchema);