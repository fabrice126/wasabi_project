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
    urlAmazon: {
        type: String,
        trim: true,
        default: ""
    },
    urlITunes: {
        type: String,
        trim: true,
        default: ""
    },
    urlAllmusic: {
        type: String,
        trim: true,
        default: ""
    },
    urlDiscogs: {
        type: String,
        trim: true,
        default: ""
    },
    urlMusicBrainz: {
        type: String,
        trim: true,
        default: ""
    },
    urlYouTube: {
        type: String,
        trim: true,
        default: ""
    },
    urlSpotify: {
        type: String,
        trim: true,
        default: ""
    },
    urlPureVolume: {
        type: String,
        trim: true,
        default: ""
    },
    urlRateYourMusic: {
        type: String,
        trim: true,
        default: ""
    },
    urlSoundCloud: {
        type: String,
        trim: true,
        default: ""
    },

    locationInfo: {
        type: [String],
        default: []
    },
    urlWikia: {
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
    //liste des champs pouvant ne pas exister dans un document artist
    albums: {
        type: [],
    },
    wordCount: {
        type: [],
    },
    rdf: {
        type: String,
    },
    id_artist_musicbrainz: {
        type: String,
        trim: true,
        default: "",
    },
    disambiguation: {
        type: String,
        trim: true,
        default: "",
    },
    type: {
        type: String,
        trim: true,
        default: "",
    },
    lifeSpan: {
        ended: {
            type: Boolean,
            default: false,
        },
        begin: {
            type: String,
            trim: true,
            default: "",
        },
        end: {
            type: String,
            trim: true,
            default: "",
        }
    },
    location: {
        id_city_musicbrainz: {
            type: String,
            trim: true,
            default: "",
        },
        country: {
            type: String,
            trim: true,
            default: "",
        },
        city: {
            type: String,
            trim: true,
            default: "",
        }
    },
    endArea: {
        id: {
            type: String,
            trim: true,
            default: "",
        },
        name: {
            type: String,
            trim: true,
            default: ""

        },
        disambiguation: {
            type: String,
            trim: true,
            default: "",
        }
    },
    gender: {
        type: String,
        trim: true,
        default: "",
    }
}, {
    collection: 'artist'
});
export default mongoose.model('Artist', artistSchema);