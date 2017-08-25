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
var albumSchema = new mongoose.Schema({
    name: {
        ...stringSchemaIndex,
        required: [true, 'You must type a name'],
    },
    title: {
        ...stringSchemaIndex,
        required: [true, 'You must type a title'],
    },
    id_album_deezer: stringSchemaIndex,
    id_album_discogs: stringSchemaIndex,
    id_album_musicbrainz: stringSchemaIndex,
    id_artist: {
        type: mongoose.Schema.ObjectId,
        ref: "Artist",
        required: [true, 'You must type an id_artist'],
        index: true
    },
    //Anciennement publicationDate
    publicationDate: stringSchema,
    genre: stringSchemaIndex,
    barcode: stringSchema,
    cover: {
        standard: stringSchema,
        small: stringSchema,
        medium: stringSchema,
        big: stringSchema,
        xl: stringSchema
    },
    country: stringSchema,
    dateRelease: stringSchema,
    deezerFans: {
        type: Number,
        default: 0,
    },
    disambiguation: stringSchema,
    explicitLyrics: {
        type: Boolean,
        default: false,
    },
    upc: stringSchema,
    language: stringSchema,
    length: stringSchema,
    rdf: stringSchema,
    urlWikipedia: stringSchemaIndex,
    urlAlbum: stringSchema,
    urlITunes: stringSchema,
    urlAmazon: stringSchema,
    urlSpotify: stringSchema,
    urlAllmusic: stringSchema,
    urlMusicBrainz: stringSchema,
    urlDiscogs: stringSchema,
    urlDeezer: stringSchema,
    //liste des champs pouvant ne pas exister dans un document album
    songs: {
        type: [],
        default: []
    },
}, {
    collection: 'album',
    toObject: {
        retainKeyOrder: true
    },
    toJSON: {
        retainKeyOrder: true
    }
});
export default mongoose.model('Album', albumSchema);