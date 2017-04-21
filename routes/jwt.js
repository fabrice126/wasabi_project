import express from 'express';
import config from './conf/conf';
import passport from 'passport';
import User from '../model/User.model';
import confJwt from '../routes/conf/confJwt';
import RateLimit from 'express-rate-limit';
const router = express.Router();

// router.post('/signup', (req, res) => {
//     if (!req.body.email || !req.body.password) return res.status(404).json(config.http.error.user.mail_exist);
//     var newUser = new User({
//         email: req.body.email,
//         password: req.body.password
//     });
//     // Attempt to save the user
//     newUser.save((err) => {
//         if (err) return res.status(404).json(config.http.error.user.mail_exist);
//         return res.json(config.http.valid.user.user_created);
//     });
// });
router.post('/login', new RateLimit(config.http.limit_request.search), (req, res) => {
    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) throw err;
        if (!user) return res.status(404).json(config.http.error.user.login);
        // Check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (!isMatch || err) return res.json(config.http.error.user.password);
            // Create token if the password matched and no error was thrown
            delete user.password;
            var token = req.jwt.sign(user, confJwt.secretOrKey, {
                expiresIn: 120 // in seconds
            });
            return res.json({
                success: true,
                token: 'JWT ' + token
            });
        });
    });
});
// passport.authenticate('jwt', config.passport.auth.jwt)
export default router;