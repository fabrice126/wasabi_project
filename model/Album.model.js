import mongoose from 'mongoose';

var albumSchema = new mongoose.Schema({
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
    //Anciennement publicationDate
    publicationDate: {
        type: String,
        trim: true,
        default: ""
    },
    urlWikipedia: {
        type: String,
        trim: true,
        default: ""
    },
    genre: {
        type: String,
        trim: true,
        default: "",
        index: true
    },
    length: {
        type: String,
        trim: true,
        default: ""
    },
    urlAlbum: {
        type: String,
        trim: true,
        default: ""
    },
    id_artist: {
        type: mongoose.Schema.ObjectId,
        ref: "Artist",
        required: [true, 'You must type an id_artist'],
        index: true
    },
    //liste des champs pouvant ne pas exister dans un document album
    song: {
        type: [Object],
    },
    rdf: {
        type: String,
    },
    wordCount: {
        type: [Object],
    }
}, {
    collection: 'album'
});
export default mongoose.model('Album', albumSchema);