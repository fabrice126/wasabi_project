import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

var userSchema = new mongoose.Schema({
    // username: {
    //     type: String,
    //     match: /^[a-zA-Z0-9-_]+$/,
    //     minlength: 2,
    //     maxlength: 20,
    //     trim: true,
    //     unique: true,
    //     required: [true, 'You must type a username'],
    //     index: true
    // },
    // firstname: {
    //     type: String,
    //     minlength: 1,
    //     maxlength: 30,
    //     required: [true, 'You must type a firstname'],
    //     index: true
    // },
    // lastname: {
    //     type: String,
    //     minlength: 1,
    //     maxlength: 30,
    //     required: [true, 'You must type a lastname'],
    //     index: true
    // },
    email: {
        type: String,
        minlength: 5,
        maxlength: 100,
        unique: true,
        required: [true, 'You must type an email'],
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: [true, 'You must type a password']
    },
    // role: {
    //     type: String,
    //     enum: ['Client', 'Admin'],
    //     default: 'Client'
    // },
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // },
}, {
    collection: 'user'
});


// Saves the user's password hashed (plain text password storage is not good)
userSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

// Create method to compare password input to password saved in database
userSchema.methods.comparePassword = function (pw, cb) {
    bcrypt.compare(pw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};
module.exports = mongoose.model('User', userSchema)