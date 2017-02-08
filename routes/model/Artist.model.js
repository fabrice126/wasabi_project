import mongoose from 'mongoose';

var artistSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'You must type a name'],
        index: true
    },
    urlWikipedia: {
        type: String,
        default: "",
        index: true
    },
    urlOfficialWebsite: {
        type: String,
        default: ""
    },
    urlFacebook: {
        type: String,
        default: ""
    },
    urlMySpace: {
        type: String,
        default: ""
    },
    urlTwitter: {
        type: String,
        default: ""
    },
    urlWikia: {
        type: String,
        default: ""
    },
    activeYears: {
        type: String,
        default: ""
    },
    members: {
        type: String,
        default: []
    },
    formerMembers: {
        type: String,
        default: []
    },
    locationInfo: {
        type: String,
        default: [],
    },
    genres: {
        type: String,
        default: []
    },
    labels: {
        type: String,
        default: []
    },
    albums: {
        type: String,
        default: []
    },
    wordCount: {
        type: String,
        default: []
    },
    rdf: {
        type: String,
        default: ""
    }
});
export default mongoose.model('Artist', artistSchema);