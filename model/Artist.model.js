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
var artistSchema = new mongoose.Schema({
    name: {
        ...stringSchemaIndex,
        unique: true,
        required: [true, 'You must type a name'],
    },
    id_artist_musicbrainz: stringSchemaIndex,
    id_artist_deezer: stringSchemaIndex,
    id_artist_deezer: stringSchemaIndex,
    picture: {
        standard: stringSchema,
        small: stringSchema,
        medium: stringSchema,
        big: stringSchema,
        xl: stringSchema
    },
    abstract: stringSchema,
    animux_path: stringSchema,
    nameVariations: arrayOfStringSchema,
    urls: arrayOfStringSchema,
    deezerFans: {
        type: Number,
        default: 0,
    },
    genres: arrayOfStringSchema,
    labels: arrayOfStringSchema,
    locationInfo: arrayOfStringSchema,
    type: stringSchema,
    gender: stringSchema,
    members: {
        type: [Object],
        default: []
    },
    lifeSpan: {
        ended: {
            type: Boolean,
            default: false,
        },
        begin: stringSchema,
        end: stringSchema
    },
    location: {
        id_city_musicbrainz: stringSchema,
        country: stringSchema,
        city: stringSchema
    },
    endArea: {
        id: stringSchema,
        name: stringSchema,
        disambiguation: stringSchema
    },
    disambiguation: stringSchema,
    rdf: stringSchema,
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    //---------------------------------------------Schema for urls--------------------------------------------
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    urlWikipedia: stringSchemaIndex,
    urlMusicBrainz: stringSchema,
    urlDeezer: stringSchema,
    urlDiscogs: stringSchema,
    urlOfficialWebsite: stringSchema,
    urlSpotify: stringSchema,
    urlYouTube: stringSchema,
    urlFacebook: stringSchema,
    urlInstagram: stringSchema,
    urlMySpace: stringSchema,
    urlWikidata: stringSchema,
    urlTwitter: stringSchema,
    urlAmazon: stringSchema,
    urlWikia: stringSchema,
    urlITunes: stringSchema,
    urlSecondHandSongs: stringSchema,
    urlLastFm: stringSchema,
    urlGooglePlus: stringSchema,
    urlBBC: stringSchema,
    urlAllmusic: stringSchema,
    urlPureVolume: stringSchema,
    urlRateYourMusic: stringSchema,
    urlSoundCloud: stringSchema,
    //liste des champs pouvant ne pas exister dans un document artist
    albums: {
        type: [],
        default: []
    }
}, {
    collection: 'artist',
    toObject: {
        retainKeyOrder: true,
    },
    toJSON: {
        retainKeyOrder: true,
    }
});
export default mongoose.model('Artist', artistSchema);