import mongoose from 'mongoose';

var artistSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'You must type a name'],
        index: true
    },
    urlWikipedia: {
        type: String,
        trim: true,
        default: "",
        index: true
    },
    urlOfficialWebsite: {
        type: String,
        trim: true,
        default: ""
    },
    urlFacebook: {
        type: String,
        trim: true,
        default: ""
    },
    urlMySpace: {
        type: String,
        trim: true,
        default: ""
    },
    urlTwitter: {
        type: String,
        trim: true,
        default: ""
    },
    locationInfo: {
        type: [String],
        default: []
    },
    //anciennement urlWikia
    urlArtistLyricsWikia: {
        type: String,
        trim: true,
        default: ""
    },
    activeYears: {
        type: String,
        trim: true,
        default: ""
    },
    genres: {
        type: [String],
        default: []
    },
    labels: {
        type: [String],
        default: []
    },
    members: {
        type: [],
        default: []
    },
    formerMembers: {
        type: [],
        default: []
    },
    //liste des champs pouvant ne pas exister dans un document artist
    albums: {
        type: [],
    },
    wordCount: {
        type: [],
    },
    rdf: {
        type: String,
    }
}, {
    collection: 'artist'
});
export default mongoose.model('Artist', artistSchema);