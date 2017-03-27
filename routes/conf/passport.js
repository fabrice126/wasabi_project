var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../../model/User.model');
var confJwt = require('./confJwt');
// Setup work and export for the JWT passport strategy
module.exports = function (passport) {
    var opts = {
        "secretOrKey": confJwt.secretOrKey,
        "jwtFromRequest": ExtractJwt.fromAuthHeader(),
    };
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        User.findById(jwt_payload._doc._id, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};