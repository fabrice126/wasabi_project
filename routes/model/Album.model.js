import mongoose from 'mongoose';

var albumSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: [true, 'You must type a title'],
        index: true
    },
    dateSortie: {
        type: String,
        default: ""
    },
    urlWikipedia: {
        type: String,
        default: ""
    },
    genre: {
        type: String,
        default: "",
        index: true
    },
    length: {
        type: String,
        default: ""
    },
    urlAlbum: {
        type: String,
        default: ""
    },
    song: {
        type: String,
        default: []
    },
    id_artist: {
        type: mongoose.Schema.ObjectId,
        ref: "Artist",
        required: [true, 'You must type an id_artist'],
        index: true
    },
    name: {
        type: String,
        required: [true, 'You must type a name'],
        index: true
    }
});
export default mongoose.model('Album', albumSchema);

